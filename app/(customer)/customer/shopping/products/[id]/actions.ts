"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { Product } from "@prisma/client";

type FetchProductByIdResult =
  | { success: true; data: Product | null }
  | { success: false; error: string };

export async function fetchProductById(
  productId: number
): Promise<FetchProductByIdResult> {
  try {
    const { user } = await validateRequest();
    if (!user || user.role !== "CUSTOMER") {
      throw new Error(
        "Unauthorized. Only customers can fetch product details."
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    return { success: true, data: product };
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
