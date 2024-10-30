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
    // Validate user session
    const { user } = await validateRequest();
    if (!user) {
      throw new Error("Unauthorized. Please log in.");
    }

    // Fetch industrial collection products with all relations
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

    // Categorize products
    const categorizedProducts: CategorizedProducts = {
      "industrial-collection": [],
    };

    products.forEach(product => {
      const categories = product.category as string[];
      categories.forEach(category => {
        if (category in categorizedProducts) {
          categorizedProducts[category as Category].push(product);
        }
      });
    });

    // Revalidate the products page
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
