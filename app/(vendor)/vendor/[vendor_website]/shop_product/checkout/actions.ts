"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { OrderStatus, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { VendorFormValues, VendorOrderActionResult } from "./_lib/types";

export async function createVendorOrder(
  formData: VendorFormValues
): Promise<VendorOrderActionResult> {
  try {
    const { user } = await validateRequest();
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
        maxWait: 10000, // 10 seconds maximum wait time
        timeout: 20000, // 20 seconds timeout
        isolationLevel: "Serializable", // Highest isolation level
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

    // Properly type check for Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2028") {
        return {
          success: false,
          message: "Transaction error",
          error: "Failed to process order. Please try again.",
        };
      }
    }

    // Handle generic errors
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
    const { user } = await validateRequest();
    if (!user || (user.role !== "VENDOR" && user.role !== "VENDORCUSTOMER")) {
      return {
        success: false,
        message: "Authentication required",
        error: "Please login to place an order",
      };
    }

    const order = await prisma.vendorOrder.findFirst({
      where: {
        userId: user.id,
        ...(orderId ? { id: orderId } : {}), // Only include id in where clause if provided
      },
      orderBy: {
        createdAt: "desc", // Get the most recent order
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

    if (!order) {
      return {
        success: false,
        message: "Order not found",
        error: "No orders found",
      };
    }

    return {
      success: true,
      message: "Order retrieved successfully",
      data: order,
    };
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
    const { user } = await validateRequest();
    if (!user || (user.role !== "VENDOR" && user.role !== "VENDORCUSTOMER")) {
      return {
        success: false,
        message: "Authentication required",
        error: "Please login to place an order",
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
