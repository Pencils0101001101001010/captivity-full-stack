"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { Product } from "@prisma/client";
import { revalidatePath } from "next/cache";

type FetchProductByIdResult =
  | { success: true; data: Product | null }
  | { success: false; error: string };

export async function fetchProductById(
  productId: number
): Promise<FetchProductByIdResult> {
  try {
    const { user } = await validateRequest();
    if (!user || user.role !== "CUSTOMER") {
      throw new Error(
        "Unauthorized. Only customers can fetch product details."
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    return { success: true, data: product };
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

/////////////////////////////////////////////////////////////////////////////////

type AddToCartResult =
  | { success: true; message: string }
  | { success: false; error: string };

export async function addToCart(
  productId: number,
  quantity: number
): Promise<AddToCartResult> {
  try {
    const { user } = await validateRequest();
    if (!user || user.role !== "CUSTOMER") {
      throw new Error("Unauthorized. Only customers can add items to cart.");
    }

    // Find existing cart or create a new one
    let cart = await prisma.cart.findFirst({
      where: { userId: user.id },
      include: { CartItem: true },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: user.id },
        include: { CartItem: true },
      });
    }

    // Check if the product is already in the cart
    const existingCartItem = cart.CartItem.find(
      item => item.productId === productId
    );

    if (existingCartItem) {
      // Update existing cart item
      await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quanity: existingCartItem.quanity + quantity },
      });
    } else {
      // Add new cart item
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quanity: quantity,
        },
      });
    }

    revalidatePath("/customer/cart"); // Adjust the path as needed

    return { success: true, message: "Item added to cart successfully" };
  } catch (error) {
    console.error("Error adding item to cart:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
