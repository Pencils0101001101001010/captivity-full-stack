"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

type CartItem = {
  productId: number;
  variationId: number;
  quantity: number;
};

type CartData = {
  id: number;
  items: CartItem[];
};

type CartActionResult<T = void> =
  | { success: true; message: string; data?: T }
  | { success: false; error: string };

// Helper function to set cart cookie
const setCartCookie = (cartData: CartData) => {
  cookies().set({
    name: "cartData",
    value: JSON.stringify(cartData),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  });
};

// Helper function to get cart data
const getCartData = async (userId: string): Promise<CartData> => {
  let cart = await prisma.cart.findFirst({
    where: { userId },
    include: { cartItems: true },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: { cartItems: true },
    });
  }

  return {
    id: cart.id,
    items: cart.cartItems.map(item => ({
      productId: item.productId,
      variationId: item.variationId!,
      quantity: item.quantity,
    })),
  };
};

//////////////////////////////addToCart/////////////////////////////////////
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

    const variation = await prisma.variation.findUnique({
      where: { id: variationId },
      include: { product: true },
    });

    if (!variation) {
      return { success: false, error: "Product variation not found" };
    }

    if (variation.product.id !== productId) {
      return { success: false, error: "Product and variation mismatch" };
    }

    if (variation.quantity < quantity) {
      return { success: false, error: "Not enough stock available" };
    }

    let cart = await prisma.cart.findFirst({
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
      item => item.productId === productId && item.variationId === variationId
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
          productId,
          variationId,
          quantity,
        },
      });
    }

    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: { cartItems: true },
    });

    if (!updatedCart) {
      return { success: false, error: "Failed to retrieve updated cart" };
    }

    const cartData: CartData = {
      id: updatedCart.id,
      items: updatedCart.cartItems.map(item => ({
        productId: item.productId,
        variationId: item.variationId!,
        quantity: item.quantity,
      })),
    };

    cookies().set({
      name: "cartData",
      value: JSON.stringify(cartData),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    revalidatePath(`/products/${productId}`);

    return {
      success: true,
      message: "Product added to cart successfully",
      data: cartData,
    };
  } catch (error: any) {
    console.error("Error adding product to cart:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
//////////////////////////////removeFromCart/////////////////////////////////////

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
      item => item.productId === productId && item.variationId === variationId
    );

    if (itemIndex === -1) {
      return { success: false, error: "Item not found in cart" };
    }

    const removedQuantity = cartData.items[itemIndex].quantity;
    cartData.items.splice(itemIndex, 1);

    await prisma.cartItem.delete({
      where: {
        cartId_productId_variationId: {
          cartId: cartData.id,
          productId,
          variationId,
        },
      },
    });

    await prisma.variation.update({
      where: { id: variationId },
      data: { quantity: { increment: removedQuantity } },
    });

    setCartCookie(cartData);
    revalidatePath(`/customer/shopping/cart`);

    return {
      success: true,
      message: "Product removed from cart successfully",
      data: cartData,
    };
  } catch (error: any) {
    console.error("Error removing product from cart:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
///////////////////////////updateCartItemQuantity///////////////////////////////
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
      item => item.productId === productId && item.variationId === variationId
    );

    if (itemIndex === -1) {
      return { success: false, error: "Item not found in cart" };
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

    cartData.items[itemIndex].quantity = newQuantity;

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

    setCartCookie(cartData);
    revalidatePath(`/customer/shopping/cart`);

    return {
      success: true,
      message: "Cart item quantity updated successfully",
      data: cartData,
    };
  } catch (error: any) {
    console.error("Error updating cart item quantity:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
/////////////////////////////////getCart////////////////////////////////////////
export async function getCart(): Promise<CartActionResult<CartData>> {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return { success: false, error: "Unauthorized. Please log in." };
    }

    const cartData = await getCartData(user.id);
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
///////////////////////////////clearCart////////////////////////////////////////
export async function clearCart(): Promise<CartActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return { success: false, error: "Unauthorized. Please log in." };
    }

    const cart = await prisma.cart.findFirst({
      where: { userId: user.id },
      include: { cartItems: true },
    });

    if (cart) {
      // Restore quantities to variations
      for (const item of cart.cartItems) {
        await prisma.variation.update({
          where: { id: item.variationId! },
          data: { quantity: { increment: item.quantity } },
        });
      }

      // Delete all cart items
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
    }

    setCartCookie({ id: cart?.id || 0, items: [] });
    revalidatePath(`/customer/shopping/cart`);

    return { success: true, message: "Cart cleared successfully" };
  } catch (error: any) {
    console.error("Error clearing cart:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
