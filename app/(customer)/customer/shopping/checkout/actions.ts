"use server";

import { revalidatePath } from "next/cache";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { CartActionResult, CartData, OrderData } from "@/app/(customer)/types";
import { FormValues } from "./validations";
import { Prisma } from "@prisma/client";

export async function submitOrder(
  formData: FormValues,
  cartData: CartData
): Promise<CartActionResult<OrderData>> {
  try {
    const { user } = await validateRequest();
    if (!user || user.role !== "CUSTOMER") {
      return { success: false, error: "Unauthorized. Please log in." };
    }

    // Calculate total amount
    const totalAmount = cartData.extendedItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    // Prepare order data
    const orderData: Omit<Prisma.OrderCreateInput, "user" | "cart" | "id"> = {
      captivityBranch: formData.captivityBranch,
      methodOfCollection: formData.methodOfCollection,
      salesRep: formData.salesRep || null,
      referenceNumber: formData.referenceNumber || null,
      firstName: formData.firstName,
      lastName: formData.lastName,
      companyName: formData.companyName,
      countryRegion: formData.countryRegion,
      streetAddress: formData.streetAddress,
      apartmentSuite: formData.apartmentSuite || null,
      townCity: formData.townCity,
      province: formData.province,
      postcode: formData.postcode,
      phone: formData.phone,
      email: formData.email,
      orderNotes: formData.orderNotes || null,
      agreeTerms: formData.agreeTerms,
      receiveEmailReviews: formData.receiveEmailReviews || false,
      totalAmount: totalAmount,
      status: "PENDING",
    };

    // Create the order within a transaction
    const result = await prisma.$transaction(
      async transactionPrisma => {
        let existingCart, order, newCart;

        try {
          // Step 1: Verify cart existence and check if it's active
          existingCart = await transactionPrisma.cart.findUnique({
            where: { id: cartData.id },
            include: { order: true, cartItems: true },
          });

          if (!existingCart || !existingCart.isActive) {
            throw new Error("Active cart not found");
          }

          // Step 2: Create order
          order = await transactionPrisma.order.create({
            data: {
              ...orderData,
              user: { connect: { id: user.id } },
              cart: { connect: { id: cartData.id } },
            },
            include: {
              user: true,
              cart: {
                include: {
                  cartItems: {
                    include: {
                      product: true,
                      variation: true,
                    },
                  },
                },
              },
            },
          });

          // Step 3: Mark the current cart as inactive
          await transactionPrisma.cart.update({
            where: { id: cartData.id },
            data: { isActive: false },
          });

          // Step 4: Create a new empty active cart for the user
          newCart = await transactionPrisma.cart.create({
            data: {
              userId: user.id,
              isActive: true,
            },
          });

          return { order, newCartId: newCart.id };
        } catch (error) {
          console.error("Error in transaction:", error);
          throw error; // Re-throw the error to roll back the transaction
        }
      },
      {
        maxWait: 5000, // 5 seconds
        timeout: 10000, // 10 seconds
      }
    );

    // Revalidate relevant paths
    revalidatePath("/customer/shopping/cart");
    revalidatePath("/customer/orders");

    return {
      success: true,
      message: "Order submitted successfully",
      data: result.order,
    };
  } catch (error: any) {
    console.error("Error submitting order:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("Prisma Error Code:", error.code);
      console.error("Prisma Error Message:", error.message);
      if (error.meta) {
        console.error("Error Meta:", JSON.stringify(error.meta, null, 2));
      }
    }
    return {
      success: false,
      error: error.message || "An unexpected error occurred",
    };
  }
}
