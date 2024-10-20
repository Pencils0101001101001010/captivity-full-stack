"use server";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type AddToCartResult =
  | { success: true; message: string }
  | { success: false; error: string };

export async function addToCart(
  variationId: number,
  quantity: number
): Promise<AddToCartResult> {
  try {
    // Validate user session
    const { user } = await validateRequest();
    if (!user || user.role !== "CUSTOMER") {
      throw new Error("Unauthorized. Please log in.");
    }

    // Check if the user already has a cart
    let cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: { cartItems: true },
    });

    // If the user doesn't have a cart, create one
    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: user.id },
        include: { cartItems: true },
      });
    }

    // Check if the variation already exists in the cart
    const existingCartItem = cart.cartItems.find(
      item => item.variationId === variationId
    );

    if (existingCartItem) {
      // Update the quantity of the existing cart item
      await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity },
      });
    } else {
      // Add a new cart item
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          variationId: variationId,
          quantity: quantity,
        },
      });
    }

    // Revalidate the cart page to reflect the changes
    revalidatePath("/customer/shopping/cart");

    return {
      success: true,
      message: "Product added to cart successfully",
    };
  } catch (error) {
    console.error("Error adding product to cart:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
