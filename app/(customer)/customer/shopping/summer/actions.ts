"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";

export async function fetchSummerCollection(): Promise<FetchSummerCollectionResult> {
  try {
    // Validate user session
    const { user } = await validateRequest();
    if (!user || user.role !== "CUSTOMER") {
      throw new Error("Unauthorized. Please log in.");
    }

    // Fetch products from the summer collection
    const products = await prisma.product.findMany({
      where: {
        category: {
          has: "summer-collection",
        },
        isPublished: true,
      },
      include: {
        dynamicPricing: true,
        variations: true,
        featuredImage: true,
      },
    });

    return {
      success: true,
      data: products.map(product => ({
        id: product.id,
        productName: product.productName,
        category: product.category,
        description: product.description,
        sellingPrice: product.sellingPrice,
        isPublished: product.isPublished,
        dynamicPricing: product.dynamicPricing,
        variations: product.variations,
        featuredImage: product.featuredImage,
      })),
    };
  } catch (error) {
    console.error("Error fetching summer collection:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
