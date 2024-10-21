"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";

// Define the FetchProductByIdResult type
type FetchProductByIdResult = {
  success: boolean;
  data?: {
    id: number;
    productName: string;
    category: string[]; // Changed from string to string[]
    description: string;
    sellingPrice: number;
    isPublished: boolean;
    dynamicPricing: any; // Replace 'any' with the actual type if available
    variations: any[]; // Replace 'any[]' with the actual type if available
    featuredImage: any; // Replace 'any' with the actual type if available
  };
  error?: string;
};

export async function fetchProductById(
  productId: number
): Promise<FetchProductByIdResult> {
  try {
    // Validate user session
    const { user } = await validateRequest();
    if (!user) {
      throw new Error("Unauthorized. Please log in.");
    }

    // Fetch the product from the database
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        dynamicPricing: true,
        variations: true,
        featuredImage: true,
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    return {
      success: true,
      data: {
        id: product.id,
        productName: product.productName,
        category: product.category,
        description: product.description,
        sellingPrice: product.sellingPrice,
        isPublished: product.isPublished,
        dynamicPricing: product.dynamicPricing,
        variations: product.variations,
        featuredImage: product.featuredImage,
      },
    };
  } catch (error) {
    console.error("Error fetching product:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
