"use server";
import { revalidatePath } from "next/cache";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { CartActionResult, CartData, OrderData } from "@/app/(customer)/types";
import { FormValues } from "./validations";

export async function submitOrder(
  formData: FormValues,
  cartData: CartData
): Promise<CartActionResult<OrderData>> {
  try {
    console.log("Starting submitOrder function");
    const { user } = await validateRequest();
    if (!user) {
      return { success: false, error: "Unauthorized. Please log in." };
    }

    console.log("Calculating total amount");
    const totalAmount = cartData.extendedItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    console.log("Creating order");
    const createdOrder = await prisma.order.create({
      data: {
        user: { connect: { id: user.id } },
        cart: { connect: { id: cartData.id } },
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

    console.log("Order created successfully");

    console.log("Updating cart items");
    for (const item of cartData.items) {
      await prisma.cartItem.update({
        where: {
          cartId_productId_variationId: {
            cartId: cartData.id,
            productId: item.productId,
            variationId: item.variationId,
          },
        },
        data: {
          isActive: false,
        },
      });
    }

    console.log("Cart items updated successfully");

    console.log("Revalidating paths");
    revalidatePath("/customer/shopping/cart");
    revalidatePath("/customer/orders");

    console.log("Paths revalidated");

    return {
      success: true,
      message: "Order submitted successfully",
      data: createdOrder,
    };
  } catch (error: any) {
    console.error("Error submitting order:", error);
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    if (error.code) console.error("Error code:", error.code);
    if (error.meta) console.error("Error meta:", error.meta);
    return { success: false, error: "An unexpected error occurred" };
  }
}
