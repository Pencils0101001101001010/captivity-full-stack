import { Prisma } from "@prisma/client";

export function getUserDataSelect() {
  return {
    id: true,
    username: true,
    displayName: true,
    avatarUrl: true,
    bio: true,
    role: true,
    createdAt: true,
  } satisfies Prisma.UserSelect;
}

export type UserData = Prisma.UserGetPayload<{
  select: ReturnType<typeof getUserDataSelect>;
}>;

export function getProductDataInclude() {
  return {
    user: {
      select: getUserDataSelect(),
    },
  } satisfies Prisma.ProductInclude;
}

export type ProductData = Prisma.ProductGetPayload<{
  include: ReturnType<typeof getProductDataInclude>;
}>;

export function getCartDataInclude() {
  return {
    users: {
      select: getUserDataSelect(),
    },
    products: {
      include: getProductDataInclude(),
    },
  } satisfies Prisma.CartInclude;
}

export type CartData = Prisma.CartGetPayload<{
  include: ReturnType<typeof getCartDataInclude>;
}>;

// Type Definitions
export type GroupedProduct = {
  id(id: any, arg1: number): void;
  baseProduct: string;
  shortDescription: string;
  imageUrl: string;
  regularPrice: number | null;
  variants: Array<{
    size: string;
    stock: number | null;
    sku: string;
  }>;
};
