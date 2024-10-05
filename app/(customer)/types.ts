import { Prisma } from "@prisma/client";

// Select relevant fields for the User model
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

// Type for User data, selecting the fields specified in getUserDataSelect
export type UserData = Prisma.UserGetPayload<{
  select: ReturnType<typeof getUserDataSelect>;
}>;

// Select relevant fields for the Product model
export function getProductDataInclude() {
  return {
    user: {
      select: getUserDataSelect(),
    },
  } satisfies Prisma.ProductInclude;
}

// Type for Product data, including the user relation
export type ProductData = Prisma.ProductGetPayload<{
  include: ReturnType<typeof getProductDataInclude>;
}>;

// Select relevant fields for the CartItem model, including product and cart relations
export function getCartItemDataInclude() {
  return {
    products: {
      include: getProductDataInclude(),
    },
    carts: {
      include: {
        users: {
          select: getUserDataSelect(),
        },
      },
    },
  } satisfies Prisma.CartItemInclude;
}

// Type for CartItem data, including product and cart relations
export type CartItemData = Prisma.CartItemGetPayload<{
  include: ReturnType<typeof getCartItemDataInclude>;
}>;

// Select relevant fields for the Cart model, including cart items and user relations
export function getCartDataInclude() {
  return {
    users: {
      select: getUserDataSelect(),
    },
    CartItem: {
      include: getCartItemDataInclude(),
    },
  } satisfies Prisma.CartInclude;
}

// Type for Cart data, including user and cart items relations
export type CartData = Prisma.CartGetPayload<{
  include: ReturnType<typeof getCartDataInclude>;
}>;

// Select relevant fields for the Session model
export function getSessionDataInclude() {
  return {
    user: {
      select: getUserDataSelect(),
    },
  } satisfies Prisma.SessionInclude;
}

// Type for Session data, including the user relation
export type SessionData = Prisma.SessionGetPayload<{
  include: ReturnType<typeof getSessionDataInclude>;
}>;

// Type for the logged-in user including related sessions, cart, and products
export function getLoggedInUserDataInclude() {
  return {
    sessions: {
      include: getSessionDataInclude(),
    },
    Cart: {
      include: getCartDataInclude(),
    },
    Product: {
      include: getProductDataInclude(),
    },
  } satisfies Prisma.UserInclude;
}

// Type for the logged-in user with their sessions, cart, and products
export type LoggedInUserData = Prisma.UserGetPayload<{
  include: ReturnType<typeof getLoggedInUserDataInclude>;
}>;
