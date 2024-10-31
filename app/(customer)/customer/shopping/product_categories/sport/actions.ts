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

type Category = "sport-collection";

type CategorizedProducts = {
  [key in Category]: ProductWithRelations[];
};

type FetchSportCollectionResult =
  | { success: true; data: CategorizedProducts }
  | { success: false; error: string };

export async function fetchSportCollection(): Promise<FetchSportCollectionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) {
      throw new Error("Unauthorized. Please log in.");
    }

    const products = await prisma.product.findMany({
      where: {
        category: {
          has: "sport-collection",
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
      "sport-collection": [],
    };

    const processedProductIds = new Set<string>();

    products.forEach(product => {
      if (!processedProductIds.has(product.id)) {
        categorizedProducts["sport-collection"].push(product);
        processedProductIds.add(product.id);
      }
    });

    revalidatePath("/customer/shopping/product_categories/sport");

    return { success: true, data: categorizedProducts };
  } catch (error) {
    console.error("Error fetching sport collection:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
