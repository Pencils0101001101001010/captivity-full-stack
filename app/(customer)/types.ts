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
      select: {
        id: true,
        productName: true,
        category: true,
        description: true,
        sellingPrice: true,
        isPublished: true,
        createdAt: true,
        updatedAt: true,
      },
    },
    carts: {
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        cartItems: {
          include: {
            product: {
              select: {
                id: true,
                productName: true,
                category: true,
                description: true,
                sellingPrice: true,
                isPublished: true,
                createdAt: true,
                updatedAt: true,
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

// Updated function to retrieve logged-in user data
export async function getLoggedInUserData(
  userId: string,
  prisma: Prisma.TransactionClient
) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: getLoggedInUserDataInclude(),
  });
}
