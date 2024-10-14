"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import {
  Product,
  Variation,
  DynamicPricing,
  FeaturedImage,
} from "@prisma/client";

type ProductWithRelations = Product & {
  variations: Variation[];
  dynamicPricing: DynamicPricing[];
  featuredImage: FeaturedImage | null;
};

type GetProductByIdResult =
  | { success: true; data: ProductWithRelations }
  | { success: false; error: string };

export async function getProductById(
  productId: number
): Promise<GetProductByIdResult> {
  try {
    // Validate user session
    const { user } = await validateRequest();
    if (!user) {
      return { success: false, error: "Unauthorized. Please log in." };
    }

    // Fetch the product with its relations
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        variations: true,
        dynamicPricing: true,
        featuredImage: true,
      },
    });

    if (!product) {
      return { success: false, error: "Product not found" };
    }

    return {
      success: true,
      data: product,
    };
  } catch (error: any) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";

    console.error(`Error fetching product by ID: ${errorMessage}`);
    return { success: false, error: errorMessage };
  }
}
