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
    products: {
      include: getProductDataInclude(),
    },
  } satisfies Prisma.CartInclude;
}

export type CartData = Prisma.CartGetPayload<{
  include: ReturnType<typeof getCartDataInclude>;
}>;
