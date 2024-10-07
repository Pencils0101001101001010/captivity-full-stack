"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { Product } from "@prisma/client";

type FetchProductByIdResult =
  | { success: true; data: Product }
  | { success: false; error: string };

export async function fetchProductById(
  productId: number
): Promise<FetchProductByIdResult> {
  try {
    // Validate user
    const { user } = await validateRequest();
    if (!user) {
      throw new Error("Unauthorized. Please log in.");
    }

    if (user.role !== "CUSTOMER") {
      throw new Error("Only customers can view product details.");
    }

    // Fetch product by ID
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return {
        success: false,
        error: "Product not found.",
      };
    }

    return {
      success: true,
      data: product,
    };
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
