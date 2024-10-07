"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { Product, Prisma } from "@prisma/client";

type GroupedProduct = {
  id: number;
  name: string;
  shortDescription: string;
  imageUrls: string[];
};

type FetchProductsResult =
  | { success: true; data: GroupedProduct[]; totalPages: number }
  | { success: false; error: string };

export async function fetchProducts(
  page: number = 1,
  pageSize: number = 8,
  query?: string
): Promise<FetchProductsResult> {
  try {
    const { user } = await validateRequest();
    if (!user) {
      throw new Error("Unauthorized. Please log in.");
    }

    if (user.role !== "CUSTOMER") {
      throw new Error("Only customers can fetch products.");
    }

    const skip = (page - 1) * pageSize;

    // Build the 'where' clause based on the search query
    const productWhere: Prisma.ProductWhereInput = {};
    if (query) {
      productWhere.name = {
        contains: query,
        mode: "insensitive",
      };
    }

    // Fetch products from the database with optional filtering
    const allProducts = await prisma.product.findMany({
      where: productWhere,
      orderBy: { name: "asc" },
    });

    // Group products by base name
    const groupedProducts = allProducts.reduce<Record<string, GroupedProduct>>(
      (acc, product) => {
        const baseName = product.name.split(" - ")[0];
        if (!acc[baseName]) {
          acc[baseName] = {
            id: product.id,
            name: baseName,
            shortDescription: product.shortDescription,
            imageUrls: [product.imageUrl],
          };
        } else {
          if (!acc[baseName].imageUrls.includes(product.imageUrl)) {
            acc[baseName].imageUrls.push(product.imageUrl);
          }
        }

        return acc;
      },
      {}
    );

    const groupedProductsArray = Object.values(groupedProducts);
    const totalCount = groupedProductsArray.length;
    const totalPages = Math.ceil(totalCount / pageSize);

    // Apply pagination
    const paginatedProducts = groupedProductsArray.slice(skip, skip + pageSize);

    return {
      success: true,
      data: paginatedProducts,
      totalPages,
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
