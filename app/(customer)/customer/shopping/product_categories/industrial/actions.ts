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

type Category = "industrial-collection";

type CategorizedProducts = {
  [key in Category]: ProductWithRelations[];
};

type FetchIndustrialCollectionResult =
  | { success: true; data: CategorizedProducts }
  | { success: false; error: string };

export async function fetchIndustrialCollection(): Promise<FetchIndustrialCollectionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) {
      throw new Error("Unauthorized. Please log in.");
    }

    const products = await prisma.product.findMany({
      where: {
        category: {
          has: "industrial-collection",
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
      "industrial-collection": [],
    };

    const processedProductIds = new Set<string>();

    products.forEach(product => {
      if (!processedProductIds.has(product.id)) {
        categorizedProducts["industrial-collection"].push(product);
        processedProductIds.add(product.id);
      }
    });

    revalidatePath("/customer/shopping/product_categories/industrial");

    return {
      success: true,
      data: categorizedProducts,
    };
  } catch (error) {
    console.error("Error fetching industrial collection:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
