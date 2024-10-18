// app/lib/cart.ts

import { validateRequest } from "@/auth";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";

export type CartWithProducts = Prisma.CartGetPayload<{
  include: {
    cartItems: {
      include: {
        product: true;
        variation: true;
      };
    };
  };
}>;

export type ShoppingCart = CartWithProducts & {
  size: number;
  subtotal: number;
};

export async function getCart(): Promise<ShoppingCart | null> {
  const { user } = await validateRequest();

  if (!user) {
    return null;
  }

  const cart = await prisma.cart.findFirst({
    where: { userId: user.id },
    include: {
      cartItems: {
        include: {
          product: true,
          variation: true,
        },
      },
    },
  });

  if (!cart) {
    return null;
  }

  return {
    ...cart,
    size: cart.cartItems.reduce((acc, item) => acc + item.quantity, 0),
    subtotal: cart.cartItems.reduce(
      (acc, item) => acc + item.quantity * item.product.sellingPrice,
      0
    ),
  };
}

export async function createCart(): Promise<ShoppingCart> {
  const { user } = await validateRequest();

  if (!user) {
    throw new Error("User must be authenticated to create a cart");
  }

  const newCart = await prisma.cart.create({
    data: { userId: user.id },
    include: {
      cartItems: {
        include: {
          product: true,
          variation: true,
        },
      },
    },
  });

  return {
    ...newCart,
    size: 0,
    subtotal: 0,
    cartItems: [],
  };
}
