"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import {
  CartActionResult,
  CartData,
  OrderData,
  createOrder,
} from "@/app/(customer)/types";
import { FormValues } from "./validations";
import { Prisma } from "@prisma/client";

export async function submitOrder(
  formData: FormValues,
  cartData: CartData
): Promise<CartActionResult<OrderData>> {
  try {
    const { user } = await validateRequest();
    if (!user) {
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

    // Create the order
    const createdOrder = await createOrder(
      user.id,
      cartData.id,
      orderData,
      prisma
    );

    // Clear the user's cart after successful order creation
    await prisma.cartItem.deleteMany({
      where: { cartId: cartData.id },
    });

    // Clear the cart cookie
    cookies().set({
      name: "cartData",
      value: "",
      expires: new Date(0),
      path: "/",
    });

    // Revalidate relevant paths
    revalidatePath("/customer/shopping/cart");
    revalidatePath("/customer/orders");

    return {
      success: true,
      message: "Order submitted successfully",
      data: createdOrder,
    };
  } catch (error: any) {
    console.error("Error submitting order:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
