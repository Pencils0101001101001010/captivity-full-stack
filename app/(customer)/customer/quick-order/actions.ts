"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { Product, Prisma } from "@prisma/client";

type GroupedProduct = {
  id: number;
  name: string;
  shortDescription: string;
  imageUrls: string[]; // Changed from imageUrl to imageUrls
  regularPrice: number | null;
  colors: string[];
  sizes: string[];
};

type FetchProductsResult =
  | { success: true; data: GroupedProduct[]; totalPages: number }
  | { success: false; error: string };

export async function fetchProducts(
  page: number = 1,
  pageSize: number = 10
): Promise<FetchProductsResult> {
  try {
    const { user } = await validateRequest();
    if (!user) {
      throw new Error("Unauthorized. Please log in.");
    }

    if (user.role !== "CUSTOMER") {
      throw new Error("Only customers can fetch african collections.");
    }
    const skip = (page - 1) * pageSize;

    const allProducts = await prisma.product.findMany({
      orderBy: { name: "asc" },
    });

    const groupedProducts = allProducts.reduce<Record<string, GroupedProduct>>(
      (acc, product) => {
        const baseName = product.name.split(" - ")[0];
        if (!acc[baseName]) {
          acc[baseName] = {
            id: product.id,
            name: baseName,
            shortDescription: product.shortDescription,
            imageUrls: [product.imageUrl], // Initialize with the first image
            regularPrice: product.regularPrice,
            colors: [],
            sizes: [],
          };
        } else {
          // Add additional images if they're different
          if (!acc[baseName].imageUrls.includes(product.imageUrl)) {
            acc[baseName].imageUrls.push(product.imageUrl);
          }
        }
        const color = product.name.split(" - ")[1]?.split(", ")[0];
        const size = product.name.split(" - ")[1]?.split(", ")[1];
        if (color && !acc[baseName].colors.includes(color)) {
          acc[baseName].colors.push(color);
        }
        if (size && !acc[baseName].sizes.includes(size)) {
          acc[baseName].sizes.push(size);
        }
        return acc;
      },
      {}
    );

    const paginatedProducts = Object.values(groupedProducts).slice(
      skip,
      skip + pageSize
    );
    const totalCount = Object.keys(groupedProducts).length;
    const totalPages = Math.ceil(totalCount / pageSize);

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
