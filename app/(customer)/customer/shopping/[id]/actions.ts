"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { FetchProductByIdResult } from "./types";

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

    // Revalidate the product detail page
    revalidatePath(`/products/${productId}`);

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
