"use server";

import {
  CartActionResult,
  CartData,
  createUserCart,
  getUserCartData,
} from "@/app/(customer)/types";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Helper function to get cart data
const getCartData = async (userId: string): Promise<CartData> => {
  let cart = await getUserCartData(userId, prisma);
  if (!cart) {
    cart = await createUserCart(userId, prisma);
  }
  return cart;
};

export async function addToCart(
  productId: number,
  variationId: number,
  quantity: number
): Promise<CartActionResult<CartData>> {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return { success: false, error: "Unauthorized. Please log in." };
    }

    const result = await prisma.$transaction(async prismaClient => {
      const variation = await prismaClient.variation.findUnique({
        where: { id: variationId },
        include: { product: true },
      });

      if (!variation) {
        return {
          success: false,
          error: "Product variation not found",
        } as const;
      }

      if (variation.product.id !== productId) {
        return {
          success: false,
          error: "Product and variation mismatch",
        } as const;
      }

      if (variation.quantity < quantity) {
        return { success: false, error: "Not enough stock available" } as const;
      }

      let cart = await prismaClient.cart.findFirst({
        where: { userId: user.id },
        include: { cartItems: true },
      });

      if (!cart) {
        cart = await prismaClient.cart.create({
          data: { userId: user.id },
          include: { cartItems: true },
        });
      }

      const existingCartItem = cart.cartItems.find(
        item => item.productId === productId && item.variationId === variationId
      );

      if (existingCartItem) {
        if (existingCartItem.isActive) {
          // Check if total quantity exceeds available stock
          if (existingCartItem.quantity + quantity > variation.quantity) {
            return {
              success: false,
              error: "Not enough stock available",
            } as const;
          }
          // Update quantity of existing active item
          await prismaClient.cartItem.update({
            where: { id: existingCartItem.id },
            data: { quantity: existingCartItem.quantity + quantity },
          });
        } else {
          // Reactivate inactive item and update quantity
          await prismaClient.cartItem.update({
            where: { id: existingCartItem.id },
            data: { isActive: true, quantity: quantity },
          });
        }
      } else {
        // Create new cart item
        await prismaClient.cartItem.create({
          data: {
            cartId: cart.id,
            productId,
            variationId,
            quantity,
            isActive: true,
          },
        });
      }

      return { success: true } as const;
    });

    if (!result.success) {
      return result;
    }

    const updatedCartData = await getCartData(user.id);

    revalidatePath(`/customer/shopping/products/${productId}`);

    return {
      success: true,
      message: "Product added to cart successfully",
      data: updatedCartData,
    };
  } catch (error: any) {
    console.error("Error adding product to cart:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function removeFromCart(
  productId: number,
  variationId: number
): Promise<CartActionResult<CartData>> {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return { success: false, error: "Unauthorized. Please log in." };
    }

    const cartData = await getCartData(user.id);
    const itemIndex = cartData.items.findIndex(
      item =>
        item.productId === productId &&
        item.variationId === variationId &&
        item.isActive
    );

    if (itemIndex === -1) {
      return { success: false, error: "Active item not found in cart" };
    }

    const removedQuantity = cartData.items[itemIndex].quantity;

    await prisma.cartItem.update({
      where: {
        cartId_productId_variationId: {
          cartId: cartData.id,
          productId,
          variationId,
        },
      },
      data: { isActive: false },
    });

    await prisma.variation.update({
      where: { id: variationId },
      data: { quantity: { increment: removedQuantity } },
    });

    const updatedCartData = await getCartData(user.id);

    revalidatePath(`/customer/shopping/cart`);

    return {
      success: true,
      message: "Product removed from cart successfully",
      data: updatedCartData,
    };
  } catch (error: any) {
    console.error("Error removing product from cart:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function updateCartItemQuantity(
  productId: number,
  variationId: number,
  newQuantity: number
): Promise<CartActionResult<CartData>> {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return { success: false, error: "Unauthorized. Please log in." };
    }

    if (newQuantity < 0) {
      return { success: false, error: "Quantity cannot be negative" };
    }

    const cartData = await getCartData(user.id);
    const itemIndex = cartData.items.findIndex(
      item =>
        item.productId === productId &&
        item.variationId === variationId &&
        item.isActive
    );

    if (itemIndex === -1) {
      return { success: false, error: "Active item not found in cart" };
    }

    const variation = await prisma.variation.findUnique({
      where: { id: variationId },
    });

    if (!variation) {
      return { success: false, error: "Product variation not found" };
    }

    const quantityDifference = newQuantity - cartData.items[itemIndex].quantity;

    if (variation.quantity < quantityDifference) {
      return { success: false, error: "Not enough stock available" };
    }

    if (newQuantity === 0) {
      return removeFromCart(productId, variationId);
    }

    await prisma.cartItem.update({
      where: {
        cartId_productId_variationId: {
          cartId: cartData.id,
          productId,
          variationId,
        },
      },
      data: { quantity: newQuantity },
    });

    await prisma.variation.update({
      where: { id: variationId },
      data: { quantity: { decrement: quantityDifference } },
    });

    const updatedCartData = await getCartData(user.id);

    revalidatePath(`/customer/shopping/cart`);

    return {
      success: true,
      message: "Cart item quantity updated successfully",
      data: updatedCartData,
    };
  } catch (error: any) {
    console.error("Error updating cart item quantity:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function getCart(): Promise<CartActionResult<CartData>> {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return { success: false, error: "Unauthorized. Please log in." };
    }

    const cartData = await getCartData(user.id);

    if (!cartData || cartData.items.length === 0) {
      return {
        success: true,
        message: "Cart is empty",
        data: { id: 0, items: [], extendedItems: [] },
      };
    }

    // Filter out inactive items
    cartData.items = cartData.items.filter(item => item.isActive);
    cartData.extendedItems = cartData.extendedItems.filter(
      item => item.isActive
    );

    return {
      success: true,
      message: "Cart retrieved successfully",
      data: cartData,
    };
  } catch (error: any) {
    console.error("Error retrieving cart:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function clearCart(): Promise<CartActionResult<CartData>> {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return { success: false, error: "Unauthorized. Please log in." };
    }

    const cart = await prisma.cart.findFirst({
      where: { userId: user.id },
      include: { cartItems: { where: { isActive: true } } },
    });

    if (cart) {
      // Restore quantities to variations
      for (const item of cart.cartItems) {
        await prisma.variation.update({
          where: { id: item.variationId! },
          data: { quantity: { increment: item.quantity } },
        });
      }

      // Mark all active cart items as inactive
      await prisma.cartItem.updateMany({
        where: { cartId: cart.id, isActive: true },
        data: { isActive: false },
      });
    }

    const emptyCartData: CartData = {
      id: cart?.id || 0,
      items: [],
      extendedItems: [],
    };

    revalidatePath(`/customer/shopping/cart`);

    return {
      success: true,
      message: "Cart cleared successfully",
      data: emptyCartData,
    };
  } catch (error: any) {
    console.error("Error clearing cart:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
