"use server";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Product, CartItem } from "@prisma/client";

type FetchProductByIdResult =
  | { success: true; data: Product | null }
  | { success: false; error: string };

export async function fetchProductById(
  id: number
): Promise<FetchProductByIdResult> {
  try {
    const { user } = await validateRequest();
    if (!user) {
      throw new Error("Unauthorized. Please log in.");
    }

    if (user.role !== "CUSTOMER") {
      throw new Error("Only customers can fetch product details.");
    }

    const product = await prisma.product.findUnique({
      where: { id },
    });

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

export async function addToCart(productId: number, quantity: number) {
  try {
    console.log(`Adding to cart: productId=${productId}, quantity=${quantity}`);
    const { user } = await validateRequest();
    if (!user) {
      console.log("User not authenticated");
      throw new Error("You must be logged in to add items to cart");
    }

    console.log("Finding or creating cart");
    let cart = await prisma.cart.findFirst({
      where: { userId: user.id },
    });

    if (!cart) {
      console.log("Creating new cart");
      cart = await prisma.cart.create({
        data: { userId: user.id },
      });
    }

    console.log("Checking for existing cart item");
    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: productId,
      },
    });

    if (existingCartItem) {
      console.log("Updating existing cart item");
      await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quanity: existingCartItem.quanity + quantity },
      });
    } else {
      console.log("Creating new cart item");
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: productId,
          quanity: quantity,
        },
      });
    }

    console.log("Revalidating paths");
    revalidatePath(`/customer/quick-order`);
    revalidatePath(`/customer/cart`);
    console.log("Add to cart operation completed successfully");
    return { success: true };
  } catch (error) {
    console.error("Failed to add item to cart:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function getCartItemCount() {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return 0;
    }

    const cart = await prisma.cart.findFirst({
      where: { userId: user.id },
    });

    if (!cart) {
      return 0;
    }

    const count = await prisma.cartItem.count({
      where: { cartId: cart.id },
    });

    console.log("Cart item count:", count);
    return count;
  } catch (error) {
    console.error("Failed to get cart item count:", error);
    return 0;
  }
}

export async function fetchCartItems() {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return [];
    }

    const cart = await prisma.cart.findFirst({
      where: { userId: user.id },
    });

    if (!cart) {
      return [];
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { cartId: cart.id },
      include: {
        products: true,
      },
    });

    const transformedItems = cartItems.map(item => ({
      id: item.id,
      name: item.products.name,
      price: item.products.regularPrice || 0,
      quantity: item.quanity,
      imageUrl: item.products.imageUrl || "",
      attributes:
        `${item.products.attribute1Values || ""}, ${item.products.attribute2Values || ""}`.trim(),
    }));

    console.log("Fetched cart items:", transformedItems);
    return transformedItems;
  } catch (error) {
    console.error("Failed to fetch cart items:", error);
    return [];
  }
}

export async function calculateAvailableStock(
  productId: number,
  attr1: string,
  attr2: string
) {
  const seed = productId + attr1.charCodeAt(0) + attr2.charCodeAt(0);
  const pseudoRandom = Math.abs(Math.sin(seed) * 10000);
  return Math.floor(pseudoRandom % 10) + 1;
}
