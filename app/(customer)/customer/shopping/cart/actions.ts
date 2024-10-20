"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  AddToCartResult,
  DeleteCartItemResult,
  FetchCartResult,
  UpdateCartItemQuantityResult,
} from "./types";

export async function fetchCart(): Promise<FetchCartResult> {
  try {
    const { user } = await validateRequest();
    if (!user || user.role !== "CUSTOMER") {
      throw new Error("Unauthorized. Please log in as a customer.");
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: {
        cartItems: {
          include: {
            variation: {
              include: {
                product: {
                  select: {
                    id: true,
                    productName: true,
                    sellingPrice: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!cart) {
      return { success: true, data: { cartItems: [], totalCost: 0 } };
    }

    const cartItems = cart.cartItems.map(item => ({
      id: item.id,
      quantity: item.quantity,
      variation: {
        id: item.variation.id,
        name: item.variation.name,
        color: item.variation.color,
        size: item.variation.size,
        sku: item.variation.sku,
        variationImageURL: item.variation.variationImageURL,
        quantity: item.variation.quantity,
        product: {
          id: item.variation.product.id,
          productName: item.variation.product.productName,
          sellingPrice: item.variation.product.sellingPrice,
        },
      },
    }));

    const totalCost = cartItems.reduce(
      (sum, item) => sum + item.variation.product.sellingPrice * item.quantity,
      0
    );

    return {
      success: true,
      data: {
        cartItems,
        totalCost,
      },
    };
  } catch (error) {
    console.error("Error fetching cart:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function addToCart(
  variationId: number,
  quantity: number
): Promise<AddToCartResult> {
  try {
    const { user } = await validateRequest();
    if (!user || user.role !== "CUSTOMER") {
      throw new Error("Unauthorized. Please log in.");
    }

    let cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: { cartItems: true },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: user.id },
        include: { cartItems: true },
      });
    }

    const existingCartItem = cart.cartItems.find(
      item => item.variationId === variationId
    );

    if (existingCartItem) {
      await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          variationId: variationId,
          quantity: quantity,
        },
      });
    }

    revalidatePath("/customer/shopping/cart");
    revalidatePath("/");

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

export async function updateCartItemQuantity(
  cartItemId: number,
  newQuantity: number
): Promise<UpdateCartItemQuantityResult> {
  try {
    const { user } = await validateRequest();
    if (!user || user.role !== "CUSTOMER") {
      throw new Error("Unauthorized. Please log in as a customer.");
    }

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: {
        cart: true,
        variation: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cartItem) {
      throw new Error("Cart item not found");
    }

    if (cartItem.cart.userId !== user.id) {
      throw new Error("Unauthorized. This cart item doesn't belong to you.");
    }

    if (newQuantity < 1) {
      throw new Error("Quantity must be at least 1");
    }

    if (newQuantity > cartItem.variation.quantity) {
      throw new Error(
        `Only ${cartItem.variation.quantity} items available in stock`
      );
    }

    const updatedCartItem = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity: newQuantity },
      include: {
        variation: {
          include: {
            product: true,
          },
        },
      },
    });

    const updatedCart = await prisma.cart.findUnique({
      where: { id: cartItem.cartId },
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

    const newTotalCost = updatedCart!.cartItems.reduce(
      (sum, item) => sum + item.variation.product.sellingPrice * item.quantity,
      0
    );

    revalidatePath("/customer/shopping/cart");

    return {
      success: true,
      message: "Cart item quantity updated successfully",
      newQuantity: updatedCartItem.quantity,
      newTotalCost: newTotalCost,
    };
  } catch (error) {
    console.error("Error updating cart item quantity:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function deleteCartItem(
  cartItemId: number
): Promise<DeleteCartItemResult> {
  try {
    const { user } = await validateRequest();
    if (!user || user.role !== "CUSTOMER") {
      throw new Error("Unauthorized. Please log in as a customer.");
    }

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: { cart: true },
    });

    if (!cartItem) {
      throw new Error("Cart item not found");
    }

    if (cartItem.cart.userId !== user.id) {
      throw new Error("Unauthorized. This cart item doesn't belong to you.");
    }

    await prisma.cartItem.delete({
      where: { id: cartItemId },
    });

    revalidatePath("/customer/shopping/cart");

    return {
      success: true,
      message: "Item removed from cart successfully",
    };
  } catch (error) {
    console.error("Error removing item from cart:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
