"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Product } from "@prisma/client";

type FetchProductByIdResult =
  | { success: true; data: Product | null }
  | { success: false; error: string };

export async function fetchProductById(
  id: number
): Promise<FetchProductByIdResult> {
  try {
    // Validate user session
    const { user } = await validateRequest();
    if (!user) {
      throw new Error("Unauthorized. Please log in.");
    }

    // Check if the user has the ADMIN role
    if (user.role !== "CUSTOMER") {
      throw new Error("Only customers can fetch product details.");
    }

    // Fetch the product from the database
    const product = await prisma.product.findUnique({
      where: { id },
    });

    // Revalidate the product detail page
    revalidatePath(`/customer/quick-order/${id}`);

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

////////////////////////////////////////////////////////

export async function addToCart(productId: number, quantity: number) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      throw new Error("You must be logged in to add items to cart");
    }

    let cart = await prisma.cart.findFirst({
      where: { userId: user.id },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: user.id },
      });
    }

    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: productId,
      },
    });

    if (existingCartItem) {
      await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quanity: existingCartItem.quanity + quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: productId,
          quanity: quantity,
        },
      });
    }

    revalidatePath(`/customer/quick-order`);
    revalidatePath(`/customer/cart`);
    return { success: true };
  } catch (error) {
    console.error("Failed to add item to cart:", error);
    return { success: false, error: "Failed to add item to cart" };
  }
}

/////////////////////////////////////////////////////////////////////////

export async function getCartItemCount() {
  try {
    const { user } = await validateRequest();
    if (!user) {
      throw new Error("You must be logged in to view cart");
    }

    const cart = await prisma.cart.findFirst({
      where: { userId: user.id },
      include: {
        CartItem: true,
      },
    });

    if (!cart) {
      return 0;
    }

    const totalCount = cart.CartItem.reduce(
      (sum, item) => sum + item.quanity,
      0
    );
    return totalCount;
  } catch (error) {
    console.error("Failed to get cart item count:", error);
    return 0;
  }
}
