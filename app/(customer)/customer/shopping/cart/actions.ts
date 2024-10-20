"use server";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cache } from "react";

//CART CRUD

//////////////////////////////////CREATE///////////////////////////////////////
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
//////////////////////////////////READ/////////////////////////////////////////

export type Variation = {
  id: number;
  name: string;
  color: string;
  size: string;
  sku: string;
  variationImageURL: string;
  quantity: number; // Add this line
  product: {
    id: number;
    productName: string;
    sellingPrice: number;
  };
};

export type CartItem = {
  id: number;
  quantity: number;
  variation: Variation;
};
export type FetchCartResult =
  | { success: true; data: { cartItems: CartItem[]; totalCost: number } }
  | { success: false; error: string };

export const fetchCart = cache(async (): Promise<FetchCartResult> => {
  try {
    // Validate user session
    const { user } = await validateRequest();
    if (!user || user.role !== "CUSTOMER") {
      throw new Error("Unauthorized. Please log in as a customer.");
    }

    // Fetch the user's cart with related data
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
        quantity: item.variation.quantity, // Add this line
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
});

/////////////////////////////////UPDATE/////////////////////////////////////
export type UpdateCartItemQuantityResult =
  | {
      success: true;
      message: string;
      newQuantity: number;
      newTotalCost: number;
    }
  | { success: false; error: string };

export async function updateCartItemQuantity(
  cartItemId: number,
  newQuantity: number
): Promise<UpdateCartItemQuantityResult> {
  try {
    // Validate user session
    const { user } = await validateRequest();
    if (!user || user.role !== "CUSTOMER") {
      throw new Error("Unauthorized. Please log in as a customer.");
    }

    // Find the cart item and ensure it belongs to the current user
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

    // Check if the new quantity is valid
    if (newQuantity < 1) {
      throw new Error("Quantity must be at least 1");
    }

    // Check if the new quantity is within available stock
    if (newQuantity > cartItem.variation.quantity) {
      throw new Error(
        `Only ${cartItem.variation.quantity} items available in stock`
      );
    }

    // Update the cart item quantity
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

    // Calculate new total cost for the entire cart
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

    // Revalidate the cart page to reflect the changes
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

////////////////////////////////DELETE//////////////////////////////////////
export type DeleteCartItemResult =
  | { success: true; message: string }
  | { success: false; error: string };

export async function deleteCartItem(
  cartItemId: number
): Promise<DeleteCartItemResult> {
  try {
    // Validate user session
    const { user } = await validateRequest();
    if (!user || user.role !== "CUSTOMER") {
      throw new Error("Unauthorized. Please log in as a customer.");
    }

    // Find the cart item and ensure it belongs to the current user
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

    // Delete the cart item
    await prisma.cartItem.delete({
      where: { id: cartItemId },
    });

    // Revalidate the cart page to reflect the changes
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
