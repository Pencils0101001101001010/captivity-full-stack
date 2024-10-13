"use server";

import { CartData, getCartDataInclude } from "@/app/(customer)/types";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";

type FetchCartResult =
  | { success: true; data: CartData }
  | { success: false; error: string };

export async function fetchCart(): Promise<FetchCartResult> {
  try {
    const { user } = await validateRequest();
    if (!user || user.role !== "CUSTOMER") {
      throw new Error("Unauthorized. Only customers can fetch their cart.");
    }

    const cart = await prisma.cart.findFirst({
      where: { userId: user.id },
      include: getCartDataInclude(),
    });

    if (!cart) {
      // If no cart exists, create a new one for the user
      const newCart = await prisma.cart.create({
        data: { userId: user.id },
        include: getCartDataInclude(),
      });
      return { success: true, data: newCart };
    }

    return { success: true, data: cart };
  } catch (error) {
    console.error("Error fetching cart:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
