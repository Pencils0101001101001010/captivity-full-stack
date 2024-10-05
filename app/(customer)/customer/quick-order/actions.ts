"use server"
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";


const ITEMS_PER_PAGE = 10;

type FetchProductsResult = {
  success: boolean;
  data?: {
    products: Array<{
      id: number;
      sku: string;
      shortDescription: string;
      attribute1Values: string[] | null;
      attribute2Values: string[] | null;
      imageUrl: string;
      regularPrice: number | null;
      stock: number | null;
    }>;
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
          shortDescription: true,
          attribute1Values: true,
          attribute2Values: true,
          imageUrl: true,
          regularPrice: true,
          stock: true,
        },
        skip,
        take: ITEMS_PER_PAGE,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count(),
    ]);

    const parsedProducts = products.map(product => ({
      ...product,
      attribute1Values: product.attribute1Values ? product.attribute1Values.split(',').map(s => s.trim()) : null,
      attribute2Values: product.attribute2Values ? product.attribute2Values.split(',').map(s => s.trim()) : null,
    }));

    return {
      success: true,
      data: {
        products: parsedProducts,
        totalPages: Math.ceil(totalCount / ITEMS_PER_PAGE),
      },
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}