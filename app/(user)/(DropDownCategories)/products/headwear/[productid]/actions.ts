"use server";

import prisma from "@/lib/prisma";
import { Product } from "@prisma/client";
import { ProductWithFeaturedImage } from "./ProductTypes";

export async function fetchProductById(id: number): Promise<{ success: boolean; data?: ProductWithFeaturedImage; error?: string }> {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        featuredImage: true,
        variations: true,
        dynamicPricing: true,
      },
    });

    if (!product) {
      return { success: false, error: "Product not found" };
    }

    return {
      success: true,
      data: {
        ...product,
        featuredImage: product.featuredImage || null,
      } as ProductWithFeaturedImage,
    };
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    console.error(`Error fetching product by ID: ${errorMessage}`);
    return { success: false, error: errorMessage };
  }
}