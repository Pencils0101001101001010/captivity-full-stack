"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { FormValues, OrderActionResult } from "./_lib/types";

export async function createOrder(
  formData: FormValues
): Promise<OrderActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return {
        success: false,
        message: "Authentication required",
        error: "Please login to place an order",
      };
    }

    // First, fetch the cart outside the transaction to verify it exists
    const existingCart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: {
        cartItems: {
          include: {
            variation: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    if (!existingCart || !existingCart.cartItems.length) {
      return {
        success: false,
        message: "Cart is empty",
        error: "Cannot create order with empty cart",
      };
    }

    // Calculate total amount
    const totalAmount = existingCart.cartItems.reduce(
      (total, item) =>
        total + item.variation.product.sellingPrice * item.quantity,
      0
    );

    // Create the order in a single transaction
    const order = await prisma.$transaction(async tx => {
      // 1. Create the order first
      const newOrder = await tx.order.create({
        data: {
          userId: user.id,
          status: OrderStatus.PENDING,
          totalAmount,
          captivityBranch: formData.captivityBranch,
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

      // 2. Create all order items in a single operation
      await tx.orderItem.createMany({
        data: existingCart.cartItems.map(item => ({
          orderId: newOrder.id,
          variationId: item.variationId,
          quantity: item.quantity,
          price: item.variation.product.sellingPrice,
        })),
      });

      // 3. Update all variation quantities in a single operation
      for (const item of existingCart.cartItems) {
        await tx.variation.update({
          where: { id: item.variationId },
          data: {
            quantity: {
              decrement: item.quantity,
            },
          },
        });
      }

      // 4. Delete all cart items
      await tx.cartItem.deleteMany({
        where: { cartId: existingCart.id },
      });

      // 5. Return the created order with all its relations
      return await tx.order.findUnique({
        where: { id: newOrder.id },
        include: {
          orderItems: {
            include: {
              variation: {
                include: {
                  product: true,
                },
              },
            },
          },
        },
      });
    });

    // Revalidate paths after successful transaction
    revalidatePath("/customer/orders");
    revalidatePath("/customer/shopping/cart");

    return {
      success: true,
      message: "Order created successfully",
      data: order,
    };
  } catch (error) {
    console.error("Error creating order:", error);
    if (
      error instanceof Error &&
      error.message.includes("Insufficient stock")
    ) {
      return {
        success: false,
        message: "Insufficient stock",
        error: error.message,
      };
    }
    return {
      success: false,
      message: "Failed to create order",
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function getOrder(orderId: string): Promise<OrderActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return {
        success: false,
        message: "Authentication required",
        error: "Please login to view order",
      };
    }

    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
        userId: user.id,
      },
      include: {
        orderItems: {
          include: {
            variation: {
              include: {
                product: true,
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
        error: "The requested order does not exist",
      };
    }

    return {
      success: true,
      message: "Order retrieved successfully",
      data: order,
    };
  } catch (error) {
    console.error("Error retrieving order:", error);
    return {
      success: false,
      message: "Failed to retrieve order",
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function getUserOrders(): Promise<OrderActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return {
        success: false,
        message: "Authentication required",
        error: "Please login to view orders",
      };
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: user.id,
      },
      include: {
        orderItems: {
          include: {
            variation: {
              include: {
                product: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      message: "Orders retrieved successfully",
      data: orders,
    };
  } catch (error) {
    console.error("Error retrieving orders:", error);
    return {
      success: false,
      message: "Failed to retrieve orders",
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
