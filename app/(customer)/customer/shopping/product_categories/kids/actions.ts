"use server";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Product, DynamicPricing, Variation } from "@prisma/client";

export type FeaturedImage = {
  id: string;
  thumbnail: string;
  medium: string;
  large: string;
  productId: string;
};

type ProductWithRelations = Product & {
  dynamicPricing: DynamicPricing[];
  variations: Variation[];
  featuredImage: FeaturedImage | null;
};

type Category = "kids-collection";

type CategorizedProducts = {
  [key in Category]: ProductWithRelations[];
};

type FetchKidsCollectionResult =
  | { success: true; data: CategorizedProducts }
  | { success: false; error: string };

export async function fetchKidsCollection(): Promise<FetchKidsCollectionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) {
      throw new Error("Unauthorized. Please log in.");
    }

    const products = await prisma.product.findMany({
      where: {
        category: {
          has: "kids-collection",
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
      "kids-collection": [],
    };

    const processedProductIds = new Set<string>();

    products.forEach(product => {
      if (!processedProductIds.has(product.id)) {
        categorizedProducts["kids-collection"].push(product);
        processedProductIds.add(product.id);
      }
    });

    revalidatePath("/customer/shopping/product_categories/kids");

    return {
      success: true,
      data: categorizedProducts,
    };
  } catch (error) {
    console.error("Error fetching kids collection:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
