"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { OrderStatus, Prisma, User, UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { VendorFormValues, VendorOrderActionResult } from "./_lib/types";

interface AuthUser {
  id: string;
  role: UserRole;
  storeSlug: string | null;
}

export async function createVendorOrder(
  formData: VendorFormValues
): Promise<VendorOrderActionResult> {
  try {
    const { user } = (await validateRequest()) as { user: AuthUser | null };
    if (!user || (user.role !== "VENDOR" && user.role !== "VENDORCUSTOMER")) {
      return {
        success: false,
        message: "Authentication required",
        error: "Please login to place an order",
      };
    }

    // 1. Verify cart and calculate total
    const existingCart = await prisma.vendorCart.findUnique({
      where: { userId: user.id },
      include: {
        vendorCartItems: {
          include: {
            vendorVariation: {
              include: {
                vendorProduct: true,
              },
            },
          },
        },
      },
    });

    if (!existingCart?.vendorCartItems?.length) {
      return {
        success: false,
        message: "Cart is empty",
        error: "Cannot create order with empty cart",
      };
    }

    // 2. Verify stock availability before proceeding
    for (const item of existingCart.vendorCartItems) {
      const variation = await prisma.vendorVariation.findUnique({
        where: { id: item.vendorVariationId },
      });

      if (!variation || variation.quantity < item.quantity) {
        return {
          success: false,
          message: "Insufficient stock",
          error: `Insufficient stock for product variation ${item.vendorVariationId}`,
        };
      }
    }

    const totalAmount = existingCart.vendorCartItems.reduce(
      (total, item) =>
        total + item.vendorVariation.vendorProduct.sellingPrice * item.quantity,
      0
    );

    // 3. Create order with a simplified transaction
    const order = await prisma.$transaction(
      async tx => {
        // Create order
        const newOrder = await tx.vendorOrder.create({
          data: {
            userId: user.id,
            status: OrderStatus.PENDING,
            totalAmount,
            vendorBranch: formData.vendorBranch,
            methodOfCollection: formData.methodOfCollection,
            salesRep: formData.salesRep || "",
            referenceNumber: formData.referenceNumber || "",
            firstName: formData.firstName,
            lastName: formData.lastName,
            companyName: formData.companyName,
            countryRegion: formData.countryRegion,
            streetAddress: formData.streetAddress,
            apartmentSuite: formData.apartmentSuite || "",
            townCity: formData.townCity,
            province: formData.province,
            postcode: formData.postcode,
            phone: formData.phone,
            email: formData.email,
            orderNotes: formData.orderNotes || "",
            agreeTerms: formData.agreeTerms,
            receiveEmailReviews: formData.receiveEmailReviews,
          },
        });

        // Create order items
        await Promise.all(
          existingCart.vendorCartItems.map(item =>
            tx.vendorOrderItem.create({
              data: {
                vendorOrderId: newOrder.id,
                vendorVariationId: item.vendorVariationId,
                quantity: item.quantity,
                price: item.vendorVariation.vendorProduct.sellingPrice,
              },
            })
          )
        );

        // Update variation quantities
        await Promise.all(
          existingCart.vendorCartItems.map(item =>
            tx.vendorVariation.update({
              where: { id: item.vendorVariationId },
              data: {
                quantity: {
                  decrement: item.quantity,
                },
              },
            })
          )
        );

        // Delete cart items
        await tx.vendorCartItem.deleteMany({
          where: { vendorCartId: existingCart.id },
        });

        return newOrder;
      },
      {
        maxWait: 10000,
        timeout: 20000,
        isolationLevel: "Serializable",
      }
    );

    // 4. Fetch complete order details after transaction
    const completeOrder = await prisma.vendorOrder.findUnique({
      where: { id: order.id },
      include: {
        vendorOrderItems: {
          include: {
            vendorVariation: {
              include: {
                vendorProduct: true,
              },
            },
          },
        },
      },
    });

    // 5. Revalidate paths
    revalidatePath("/vendor/orders");
    revalidatePath("/vendor");

    return {
      success: true,
      message: "Order created successfully",
      data: completeOrder,
    };
  } catch (error) {
    console.error("Error creating vendor order:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2028") {
        return {
          success: false,
          message: "Transaction error",
          error: "Failed to process order. Please try again.",
        };
      }
    }

    return {
      success: false,
      message: "Failed to create order",
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function getVendorOrder(
  orderId?: string
): Promise<VendorOrderActionResult> {
  try {
    const { user } = (await validateRequest()) as { user: AuthUser | null };
    if (!user || (user.role !== "VENDOR" && user.role !== "VENDORCUSTOMER")) {
      return {
        success: false,
        message: "Authentication required",
        error: "Please login to view orders",
      };
    }

    if (user.role === "VENDOR" && user.storeSlug) {
      // For vendors: get all orders from their customers and their own orders
      const allOrders = await prisma.vendorOrder.findMany({
        where: {
          OR: [
            // Vendor's own orders
            { userId: user.id },
            // Orders from vendor's customers
            {
              user: {
                AND: [
                  { role: "VENDORCUSTOMER" },
                  {
                    storeSlug: {
                      startsWith: `${user.storeSlug}-customer-`,
                    },
                  },
                ],
              },
            },
          ],
          ...(orderId ? { id: orderId } : {}),
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          vendorOrderItems: {
            include: {
              vendorVariation: {
                include: {
                  vendorProduct: true,
                },
              },
            },
          },
          user: {
            select: {
              id: true,
              role: true,
              storeSlug: true,
              username: true,
              email: true,
            },
          },
        },
      });

      if (!allOrders.length) {
        return {
          success: false,
          message: "No orders found",
          error: "No orders available",
        };
      }

      return {
        success: true,
        message: "Orders retrieved successfully",
        data: allOrders,
      };
    } else {
      // For vendor customers: get only their own orders
      const customerOrders = await prisma.vendorOrder.findMany({
        where: {
          userId: user.id,
          ...(orderId ? { id: orderId } : {}),
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          vendorOrderItems: {
            include: {
              vendorVariation: {
                include: {
                  vendorProduct: true,
                },
              },
            },
          },
        },
      });

      return {
        success: true,
        message: "Orders retrieved successfully",
        data: customerOrders,
      };
    }
  } catch (error) {
    console.error("Error retrieving vendor order:", error);
    return {
      success: false,
      message: "Failed to retrieve order",
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function getVendorUserDetails() {
  try {
    const { user } = (await validateRequest()) as { user: AuthUser | null };
    if (!user || (user.role !== "VENDOR" && user.role !== "VENDORCUSTOMER")) {
      return {
        success: false,
        message: "Authentication required",
        error: "Please login to view details",
      };
    }

    const userDetails = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        salesRep: true,
        companyName: true,
        country: true,
        streetAddress: true,
        addressLine2: true,
        townCity: true,
        suburb: true,
        postcode: true,
      },
    });

    if (!userDetails) {
      return {
        success: false,
        message: "User details not found",
        error: "No user details found",
      };
    }

    return {
      success: true,
      message: "User details retrieved successfully",
      data: userDetails,
    };
  } catch (error) {
    console.error("Error retrieving vendor user details:", error);
    return {
      success: false,
      message: "Failed to retrieve user details",
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
