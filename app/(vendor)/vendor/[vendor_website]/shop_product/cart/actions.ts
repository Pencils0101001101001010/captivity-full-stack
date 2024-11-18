"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { Cart, VendorVariation, VendorProduct } from "@prisma/client";

// Define a CartItem type that matches your database schema
type VendorCartItem = {
  id: string;
  cartId: string;
  variationId: string;
  quantity: number;
  variation: VendorVariation & {
    vendorProduct: VendorProduct;
  };
};

// Merging the models for Vendor Cart
type VendorCartWithItems = Cart & {
  cartItems: Array<VendorCartItem>;
};

type VendorCartActionResult =
  | { success: true; data: VendorCartWithItems }
  | { success: false; error: string };

// Helper function to get or create vendor cart
async function getOrCreateVendorCart(userId: string): Promise<Cart> {
  let cart = await prisma.cart.findUnique({
    where: { userId },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
    });
  }

  return cart;
}

export async function addToVendorCart(
  variationId: string,
  quantity: number
): Promise<VendorCartActionResult> {
  try {
    const { user } = await validateRequest();
    if (
      !user ||
      !["VENDOR", "VENDORCUSTOMER", "APPROVEDVENDORCUSTOMER"].includes(
        user.role
      )
    ) {
      return {
        success: false,
        error: "Unauthorized. Please login as a vendor customer.",
      };
    }

    const cart = await getOrCreateVendorCart(user.id);

    // Check if variation exists and is in stock
    const variation = await prisma.vendorVariation.findUnique({
      where: { id: variationId },
      include: {
        vendorProduct: true,
      },
    });

    if (!variation) {
      return { success: false, error: "Product variation not found" };
    }

    if (variation.quantity < quantity) {
      return { success: false, error: "Insufficient stock available" };
    }

    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        variationId,
      },
    });

    if (existingCartItem) {
      const newQuantity = existingCartItem.quantity + quantity;
      if (newQuantity > variation.quantity) {
        return {
          success: false,
          error: "Cannot add more than available stock",
        };
      }

      await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          variationId,
          quantity,
        },
      });
    }

    return await fetchVendorCart();
  } catch (error) {
    console.error("Error adding to vendor cart:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function updateVendorCartItemQuantity(
  cartItemId: string,
  quantity: number
): Promise<VendorCartActionResult> {
  try {
    const { user } = await validateRequest();
    if (
      !user ||
      !["VENDOR", "VENDORCUSTOMER", "APPROVEDVENDORCUSTOMER"].includes(
        user.role
      )
    ) {
      return {
        success: false,
        error: "Unauthorized. Please login as a vendor customer.",
      };
    }

    // First get the cart item to check the associated variation
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: {
        variation: {
          select: {
            quantity: true,
          },
        },
      },
    });

    if (!cartItem) {
      return { success: false, error: "Cart item not found" };
    }

    if (quantity > cartItem.variation.quantity) {
      return { success: false, error: "Cannot add more than available stock" };
    }

    await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });

    return await fetchVendorCart();
  } catch (error) {
    console.error("Error updating vendor cart item quantity:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function removeFromVendorCart(
  cartItemId: string
): Promise<VendorCartActionResult> {
  try {
    const { user } = await validateRequest();
    if (
      !user ||
      !["VENDOR", "VENDORCUSTOMER", "APPROVEDVENDORCUSTOMER"].includes(
        user.role
      )
    ) {
      return {
        success: false,
        error: "Unauthorized. Please login as a vendor customer.",
      };
    }

    await prisma.cartItem.delete({
      where: { id: cartItemId },
    });

    return await fetchVendorCart();
  } catch (error) {
    console.error("Error removing from vendor cart:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function fetchVendorCart(): Promise<VendorCartActionResult> {
  try {
    const { user } = await validateRequest();
    if (
      !user ||
      !["VENDOR", "VENDORCUSTOMER", "APPROVEDVENDORCUSTOMER"].includes(
        user.role
      )
    ) {
      return {
        success: false,
        error: "Unauthorized. Please login as a vendor customer.",
      };
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: {
        cartItems: {
          include: {
            variation: {
              include: {
                product: true, // This matches your schema relation
              },
            },
          },
        },
      },
    });

    if (!cart) {
      return { success: false, error: "Cart not found" };
    }

    // Cast the cart to the expected type
    return { success: true, data: cart as unknown as VendorCartWithItems };
  } catch (error) {
    console.error("Error fetching vendor cart:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function clearVendorCart(): Promise<VendorCartActionResult> {
  try {
    const { user } = await validateRequest();
    if (
      !user ||
      !["VENDOR", "VENDORCUSTOMER", "APPROVEDVENDORCUSTOMER"].includes(
        user.role
      )
    ) {
      return {
        success: false,
        error: "Unauthorized. Please login as a vendor customer.",
      };
    }

    await prisma.cartItem.deleteMany({
      where: { cart: { userId: user.id } },
    });

    return await fetchVendorCart();
  } catch (error) {
    console.error("Error clearing vendor cart:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
