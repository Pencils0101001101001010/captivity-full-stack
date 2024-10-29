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

type FetchLeisureCollectionResult =
  | { success: true; data: CategorizedProducts }
  | { success: false; error: string };

export async function fetchLeisureCollection(): Promise<FetchLeisureCollectionResult> {
  try {
    // Validate user session
    const { user } = await validateRequest();
    if (!user) {
      throw new Error("Unauthorized. Please log in.");
    }

    // Fetch leisure collection products with all relations
    const products = await prisma.product.findMany({
      where: {
        category: {
          has: "leisure-collection", // Changed from summer to leisure
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
      men: [],
      women: [],
      kids: [],
      hats: [],
      golfers: [],
      bottoms: [],
      caps: [],
      uncategorised: [],
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
    revalidatePath("/customer/shopping/leisure"); // Changed from summer to winter

    return { success: true, data: categorizedProducts };
  } catch (error) {
    console.error("Error fetching leisure collection:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
