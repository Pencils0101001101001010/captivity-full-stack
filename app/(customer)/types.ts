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
    orders: {
      select: {
        id: true,
        totalAmount: true,
        status: true,
        createdAt: true,
        orderItems: {
          select: {
            id: true,
            variation: {
              select: {
                id: true,
                name: true,
                color: true,
                size: true,
                sku: true,
                sku2: true,
                variationImageURL: true,
              },
            },
            quantity: true,
            price: true,
          },
        },
      },
    },
    cart: {
      select: {
        id: true,
        cartItems: {
          select: {
            id: true,
            quantity: true,
            variation: {
              select: {
                id: true,
                name: true,
                color: true,
                size: true,
                sku: true,
                sku2: true,
                variationImageURL: true,
              },
            },
          },
        },
      },
    },
    products: {
      select: {
        id: true,
        productName: true,
        description: true,
        sellingPrice: true,
        isPublished: true,
        dynamicPricing: {
          select: {
            id: true,
            from: true,
            to: true,
            type: true,
            amount: true,
          },
        },
        variations: {
          select: {
            id: true,
            name: true,
            color: true,
            size: true,
            sku: true,
            sku2: true,
            variationImageURL: true,
            quantity: true,
          },
        },
        featuredImage: {
          select: {
            id: true,
            thumbnail: true,
            medium: true,
            large: true,
          },
        },
      },
    },
    sessions: {
      select: {
        id: true,
        expiresAt: true,
      },
    },
  } satisfies Prisma.UserSelect;
}

export type UserData = Prisma.UserGetPayload<{
  select: ReturnType<typeof getUserDataSelect>;
}>;
