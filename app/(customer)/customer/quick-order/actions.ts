"use server";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { CartData, getCartDataInclude } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/dist/server/api-utils";

const ITEMS_PER_PAGE = 10;

type GroupedProduct = {
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
type FetchProductsResult = {
  success: boolean;
  data?: {
    products: GroupedProduct[];
    totalPages: number;
  };
  error?: string;
};

export async function fetchProducts(
  page: number = 1
): Promise<FetchProductsResult> {
  try {
    const { user } = await validateRequest();
    if (!user) {
      throw new Error("Unauthorized. Please log in.");
    }

    const skip = (page - 1) * ITEMS_PER_PAGE;
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        select: {
          id: true,
          sku: true,
          name: true,
          shortDescription: true,
          imageUrl: true,
          regularPrice: true,
          stock: true,
        },
        skip,
        take: ITEMS_PER_PAGE,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count(),
    ]);

    const groupedProducts: { [key: string]: GroupedProduct } = {};

    products.forEach(product => {
      const nameParts = product.name.split(",");
      const baseProduct = nameParts[0].trim();
      const size = nameParts[1] ? nameParts[1].trim() : "One Size";

      if (!groupedProducts[baseProduct]) {
        groupedProducts[baseProduct] = {
          baseProduct,
          shortDescription: product.shortDescription || "",
          imageUrl: product.imageUrl || "",
          regularPrice: product.regularPrice,
          variants: [],
        };
      }

      groupedProducts[baseProduct].variants.push({
        size,
        stock: product.stock,
        sku: product.sku,
      });
    });

    return {
      success: true,
      data: {
        products: Object.values(groupedProducts),
        totalPages: Math.ceil(totalCount / ITEMS_PER_PAGE),
      },
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

////////////////////////////////////////////////////////////
("use server");

type AddToCartResult = {
  success: boolean;
  data?: CartData;
  error?: string;
};

export async function addToCart(
  productId: number,
  quantity: number
): Promise<AddToCartResult | undefined> {
  try {
    const { user } = await validateRequest();
    if (!user) {
      throw new Error("Unauthorized. Please log in.");
    }

    // Find the product
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    // Check if the product is already in the user's cart
    let cartItem = await prisma.cart.findFirst({
      where: {
        userId: user.id,
        productId: product.id,
      },
    });

    if (cartItem) {
      // Update quantity if the item is already in the cart
      cartItem = await prisma.cart.update({
        where: { id: cartItem.id },
        data: { quanity: cartItem.quanity + quantity },
        include: getCartDataInclude(),
      });
    } else {
      // Add new item to the cart
      cartItem = await prisma.cart.create({
        data: {
          userId: user.id,
          productId: product.id,
          quanity: quantity,
        },
        include: getCartDataInclude(),
      });
    }

    revalidatePath("/customer/quick-order");
    revalidatePath("/customer/cart");
  } catch (error) {
    console.error("Error adding to cart:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
