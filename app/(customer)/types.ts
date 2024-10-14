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
