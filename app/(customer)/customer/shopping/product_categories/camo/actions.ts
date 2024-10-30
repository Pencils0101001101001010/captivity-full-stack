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

type Category = "camo-collection" | "uncategorised";

type CategorizedProducts = {
  [key in Category]: ProductWithRelations[];
};

type FetchCamoCollectionResult =
  | { success: true; data: CategorizedProducts }
  | { success: false; error: string };

export async function fetchCamoCollection(): Promise<FetchCamoCollectionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) {
      throw new Error("Unauthorized. Please log in.");
    }

    const products = await prisma.product.findMany({
      where: {
        category: {
          has: "camo-collection",
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
      "camo-collection": [],
      uncategorised: [],
    };

    const processedProductIds = new Set<string>();

    products.forEach(product => {
      if (processedProductIds.has(product.id)) return;

      const categories = product.category as string[];
      if (categories.includes("camo-collection")) {
        categorizedProducts["camo-collection"].push(product);
      } else {
        categorizedProducts.uncategorised.push(product);
      }
      processedProductIds.add(product.id);
    });

    revalidatePath("/customer/shopping/camo");

    return { success: true, data: categorizedProducts };
  } catch (error) {
    console.error("Error fetching camo collection:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
