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

type Category =
  | "men"
  | "women"
  | "kids"
  | "hats"
  | "golfers"
  | "bottoms"
  | "caps"
  | "uncategorised";

type CategorizedProducts = {
  [key in Category]: ProductWithRelations[];
};

type FetchSignatureCollectionResult =
  | { success: true; data: CategorizedProducts }
  | { success: false; error: string };

export async function fetchSignatureCollection(): Promise<FetchSignatureCollectionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) {
      throw new Error("Unauthorized. Please log in.");
    }

    const products = await prisma.product.findMany({
      where: {
        category: {
          has: "signature-collection",
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
      men: [],
      women: [],
      kids: [],
      hats: [],
      golfers: [],
      bottoms: [],
      caps: [],
      uncategorised: [],
    };

    const processedProductIds = new Set<string>();

    products.forEach(product => {
      if (processedProductIds.has(product.id)) return;

      const categories = product.category as string[];
      const primaryCategory =
        (categories.find(
          category => category in categorizedProducts
        ) as Category) || "uncategorised";

      categorizedProducts[primaryCategory].push(product);
      processedProductIds.add(product.id);
    });

    revalidatePath("/customer/shopping/product_categories/signature");

    return { success: true, data: categorizedProducts };
  } catch (error) {
    console.error("Error fetching signature collection:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
