"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  Product,
  DynamicPricing,
  Variation,
  FeaturedImage,
} from "@prisma/client";

type ProductWithRelations = Product & {
  dynamicPricing: DynamicPricing[];
  variations: Variation[];
  featuredImage: FeaturedImage | null;
};

type Category = "fashion-collection";

type CategorizedProducts = {
  [key in Category]: ProductWithRelations[];
};

type FetchFashionCollectionResult =
  | { success: true; data: CategorizedProducts }
  | { success: false; error: string };

export async function fetchFashionCollection(): Promise<FetchFashionCollectionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) {
      throw new Error("Unauthorized. Please log in.");
    }

    const products = await prisma.product.findMany({
      where: {
        category: {
          has: "fashion-collection",
        },
        isPublished: true,
      },
      include: {
        dynamicPricing: true,
        variations: true,
        featuredImage: true,
      },
    });

    const categorizedProducts: CategorizedProducts = {
      "fashion-collection": [],
    };

    const processedProductIds = new Set<string>();

    products.forEach(product => {
      if (!processedProductIds.has(product.id)) {
        categorizedProducts["fashion-collection"].push(product);
        processedProductIds.add(product.id);
      }
    });

    revalidatePath("/customer/shopping/product_categories/fashion");

    return { success: true, data: categorizedProducts };
  } catch (error) {
    console.error("Error fetching fashion collection:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
