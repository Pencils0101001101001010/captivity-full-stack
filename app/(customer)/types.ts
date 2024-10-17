import { OrderStatus, Prisma } from "@prisma/client";

// Cart Types
export type CartItem = {
  productId: number;
  variationId: number;
  quantity: number;
};

export type ExtendedCartItem = CartItem & {
  productName: string;
  price: number;
  variationName: string;
  image: string;
};

export type CartData = {
  id: number;
  items: CartItem[];
  extendedItems: ExtendedCartItem[];
};

export type CartActionResult<T = void> =
  | { success: true; message: string; data?: T }
  | { success: false; error: string };

// User Types
export const userFields = {
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

export type UserData = Prisma.UserGetPayload<{
  select: typeof userFields;
}>;

// Product Types
export type ProductData = Prisma.ProductGetPayload<{
  include: {
    dynamicPricing: true;
    variations: true;
    featuredImage: true;
  };
}>;

// Order Types
export type OrderData = Prisma.OrderGetPayload<{
  include: {
    user: true;
    cart: {
      include: {
        cartItems: {
          include: {
            product: true;
            variation: true;
          };
        };
      };
    };
  };
}>;

// LoggedIn Customer Types
export type LoggedInUserData = Prisma.UserGetPayload<{
  include: ReturnType<typeof getLoggedInUserDataInclude>;
}>;

// Helper Functions

export async function getLoggedInUserData(
  userId: string,
  prisma: Prisma.TransactionClient
): Promise<LoggedInUserData | null> {
  return prisma.user.findUnique({
    where: { id: userId },
    include: getLoggedInUserDataInclude(),
  });
}

export async function getUserCartData(
  userId: string,
  prisma: Prisma.TransactionClient
): Promise<CartData | null> {
  const activeCart = await prisma.cart.findFirst({
    where: {
      userId,
      isActive: true,
    },
    include: {
      cartItems: {
        include: {
          product: {
            include: {
              featuredImage: true,
            },
          },
          variation: true,
        },
      },
    },
  });

  if (!activeCart) return null;

  const items: CartItem[] = activeCart.cartItems.map(item => ({
    productId: item.productId,
    variationId: item.variationId!,
    quantity: item.quantity,
  }));

  const extendedItems: ExtendedCartItem[] = activeCart.cartItems.map(item => ({
    productId: item.productId,
    variationId: item.variationId!,
    quantity: item.quantity,
    productName: item.product.productName,
    price: item.product.sellingPrice,
    variationName: item.variation
      ? `${item.variation.color} - ${item.variation.size}`
      : "Default",
    image:
      item.variation?.variationImageURL ||
      item.product.featuredImage?.medium ||
      "/placeholder-image.jpg",
  }));

  return {
    id: activeCart.id,
    items,
    extendedItems,
  };
}

export async function submitOrder(
  userId: string,
  cartId: number,
  orderData: Omit<Prisma.OrderCreateInput, "user" | "cart" | "id">,
  prisma: Prisma.TransactionClient
): Promise<Prisma.OrderGetPayload<{ include: { cart: true } }>> {
  // Create the order with the current cart
  const order = await prisma.order.create({
    data: {
      ...orderData,
      user: { connect: { id: userId } },
      cart: { connect: { id: cartId } },
    },
    include: { cart: true },
  });

  // Mark the current cart as inactive
  await prisma.cart.update({
    where: { id: cartId },
    data: { isActive: false },
  });

  // Create a new active cart for the user
  await prisma.cart.create({
    data: {
      userId,
      isActive: true,
    },
  });

  return order;
}

export async function createUserCart(
  userId: string,
  prisma: Prisma.TransactionClient
): Promise<CartData> {
  const newCart = await prisma.cart.create({
    data: { userId },
    include: { cartItems: true },
  });

  return {
    id: newCart.id,
    items: [],
    extendedItems: [],
  };
}

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

export async function getOrderData(
  orderId: string,
  prisma: Prisma.TransactionClient
): Promise<OrderData | null> {
  return prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: true,
      cart: {
        include: {
          cartItems: {
            include: {
              product: true,
              variation: true,
            },
          },
        },
      },
    },
  });
}

export async function createOrder(
  userId: string,
  cartId: number,
  orderData: Omit<Prisma.OrderCreateInput, "user" | "cart" | "id">,
  prisma: Prisma.TransactionClient
): Promise<OrderData> {
  return prisma.order.create({
    data: {
      ...orderData,
      user: { connect: { id: userId } },
      cart: { connect: { id: cartId } },
    },
    include: {
      user: true,
      cart: {
        include: {
          cartItems: {
            include: {
              product: true,
              variation: true,
            },
          },
        },
      },
    },
  });
}

// Complete Customer Session Storage based on model relations
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
    orders: {
      include: {
        cart: {
          include: {
            cartItems: {
              include: {
                product: true,
                variation: true,
              },
            },
          },
        },
      },
    },
  } satisfies Prisma.UserInclude;
}
