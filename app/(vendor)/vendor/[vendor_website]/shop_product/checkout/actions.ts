"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { OrderStatus, Prisma, UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import {
  VendorFormValues,
  VendorOrderActionResult,
  VendorOrder,
} from "./_lib/types";

interface AuthUser {
  id: string;
  role: UserRole;
  storeSlug: string | null;
}

const transformOrder = (order: any): VendorOrder => ({
  id: order.id,
  userId: order.userId,
  status: order.status,
  totalAmount: order.totalAmount,
  createdAt: order.createdAt,
  updatedAt: order.updatedAt,
  vendorBranch: order.vendorBranch,
  methodOfCollection: order.methodOfCollection,
  salesRep: order.salesRep || "",
  referenceNumber: order.referenceNumber || "",
  firstName: order.firstName,
  lastName: order.lastName,
  companyName: order.companyName,
  countryRegion: order.countryRegion,
  streetAddress: order.streetAddress,
  apartmentSuite: order.apartmentSuite || "",
  townCity: order.townCity,
  province: order.province,
  postcode: order.postcode,
  phone: order.phone,
  email: order.email,
  orderNotes: order.orderNotes || "",
  agreeTerms: order.agreeTerms,
  receiveEmailReviews: order.receiveEmailReviews || false,
  vendorOrderItems: order.vendorOrderItems.map((item: any) => ({
    id: item.id,
    quantity: item.quantity,
    price: item.price,
    vendorVariation: {
      size: item.vendorVariation.size,
      color: item.vendorVariation.color,
      variationImageURL: item.vendorVariation.variationImageURL,
      name: item.vendorVariation.name,
      sku: item.vendorVariation.sku,
      sku2: item.vendorVariation.sku2,
      vendorProduct: {
        id: item.vendorVariation.vendorProduct.id,
        productName: item.vendorVariation.vendorProduct.productName,
        sellingPrice: item.vendorVariation.vendorProduct.sellingPrice,
      },
    },
  })),
});

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

    const order = await prisma.$transaction(
      async tx => {
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

    if (!completeOrder) {
      return {
        success: false,
        message: "Failed to create order",
        error: "Order creation failed",
      };
    }

    revalidatePath("/vendor/orders");
    revalidatePath("/vendor");

    return {
      success: true,
      message: "Order created successfully",
      data: transformOrder(completeOrder),
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
      const allOrders = await prisma.vendorOrder.findMany({
        where: {
          OR: [
            { userId: user.id },
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
        data: allOrders.map(transformOrder),
      };
    } else {
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
        data: customerOrders.map(transformOrder),
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
