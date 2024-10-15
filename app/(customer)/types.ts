import { Prisma } from "@prisma/client";

// Define the user fields to be included (excluding password)
const userFields = {
  id: true,
  username: true,
  firstName: true,
  lastName: true,
  displayName: true,
  email: true,
  phoneNumber: true,
  streetAddress: true,
  addressLine2: true,
  suburb: true,
  townCity: true,
  postcode: true,
  country: true,
  position: true,
  natureOfBusiness: true,
  currentSupplier: true,
  otherSupplier: true,
  resellingTo: true,
  salesRep: true,
  website: true,
  companyName: true,
  ckNumber: true,
  avatarUrl: true,
  bio: true,
  role: true,
  createdAt: true,
  updatedAt: true,
} as const;

// Define the include object for user data and related models
export function getLoggedInUserDataInclude() {
  return {
    sessions: {
      include: {
        user: {
          select: userFields,
        },
      },
    },
    products: {
      include: {
        dynamicPricing: true,
        variations: true,
        featuredImage: true,
      },
    },
    carts: {
      include: {
        cartItems: {
          include: {
            product: {
              include: {
                dynamicPricing: true,
                variations: true,
                featuredImage: true,
              },
            },
            variation: true,
          },
        },
      },
    },
  } satisfies Prisma.UserInclude;
}

// Updated type for logged-in User data
export type LoggedInUserData = Prisma.UserGetPayload<{
  include: ReturnType<typeof getLoggedInUserDataInclude>;
}>;

// Types for individual models
export type UserData = Prisma.UserGetPayload<{
  select: typeof userFields;
}>;

export type ProductData = Prisma.ProductGetPayload<{
  include: {
    dynamicPricing: true;
    variations: true;
    featuredImage: true;
  };
}>;

export type CartData = Prisma.CartGetPayload<{
  include: {
    cartItems: {
      include: {
        product: {
          include: {
            dynamicPricing: true;
            variations: true;
            featuredImage: true;
          };
        };
        variation: true;
      };
    };
  };
}>;

export type CartItemData = Prisma.CartItemGetPayload<{
  include: {
    product: {
      include: {
        dynamicPricing: true;
        variations: true;
        featuredImage: true;
      };
    };
    variation: true;
  };
}>;

// Updated function to retrieve logged-in user data
export async function getLoggedInUserData(
  userId: string,
  prisma: Prisma.TransactionClient
): Promise<LoggedInUserData | null> {
  return prisma.user.findUnique({
    where: { id: userId },
    include: getLoggedInUserDataInclude(),
  });
}

// Helper function to get cart data for a user
export async function getUserCartData(
  userId: string,
  prisma: Prisma.TransactionClient
): Promise<CartData | null> {
  return prisma.cart.findFirst({
    where: { userId },
    include: {
      cartItems: {
        include: {
          product: {
            include: {
              dynamicPricing: true,
              variations: true,
              featuredImage: true,
            },
          },
          variation: true,
        },
      },
    },
  });
}

// Helper function to get product data
export async function getProductData(
  productId: number,
  prisma: Prisma.TransactionClient
): Promise<ProductData | null> {
  return prisma.product.findUnique({
    where: { id: productId },
    include: {
      dynamicPricing: true,
      variations: true,
      featuredImage: true,
    },
  });
}
