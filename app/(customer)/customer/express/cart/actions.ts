// actions.ts
"use server";

import prisma from "@/lib/prisma";
import { createCart, getCart } from "./cart";

export async function addToCart({
  productId,
  quantity,
  color,
  size,
}: {
  productId: number;
  quantity: number;
  color: string;
  size: string;
}) {
  try {
    console.log("Server received request:", {
      productId,
      quantity,
      color,
      size,
    });

    // Get existing cart or create new one
    let cart = await getCart();
    if (!cart) {
      console.log("Creating new cart...");
      cart = await createCart();
    }

    // Find the variation that matches the color and size
    const variation = await prisma.variation.findFirst({
      where: {
        productId,
        color,
        size,
      },
    });

    console.log("Found variation:", variation);

    if (!variation) {
      throw new Error("Product variation not found");
    }

    // Check if we have enough stock
    if (variation.quantity < quantity) {
      throw new Error(`Only ${variation.quantity} items available in stock`);
    }

    // Check if item already exists in cart
    const existingCartItem = cart.cartItems.find(
      item => item.productId === productId && item.variationId === variation.id
    );

    let updatedCartItem;

    if (existingCartItem) {
      // Check if adding more would exceed available stock
      if (existingCartItem.quantity + quantity > variation.quantity) {
        throw new Error("Adding this quantity would exceed available stock");
      }

      // Update quantity if item exists
      updatedCartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity },
        include: {
          product: true,
          variation: true,
        },
      });

      console.log("Updated existing cart item:", updatedCartItem);
    } else {
      // Add new item if it doesn't exist
      updatedCartItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          variationId: variation.id,
          quantity,
        },
        include: {
          product: true,
          variation: true,
        },
      });

      console.log("Created new cart item:", updatedCartItem);
    }

    return {
      success: true,
      cart,
      cartItem: updatedCartItem,
      message: "Item successfully added to cart",
    };
  } catch (error) {
    console.error("Server error adding to cart:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Failed to add item to cart");
  }
}
