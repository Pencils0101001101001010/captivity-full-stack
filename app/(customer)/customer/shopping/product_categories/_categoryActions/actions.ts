"use server";

import {
  CategorizedProducts,
  CategoryType,
  SubCategory,
} from "@/app/(customer)/types";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

type FetchCategoryResult =
  | { success: true; data: CategorizedProducts }
  | { success: false; error: string };

export async function fetchCategoryProducts(
  category: CategoryType
): Promise<FetchCategoryResult> {
  try {
    const { user } = await validateRequest();
    if (!user) {
      throw new Error("Unauthorized. Please log in.");
    }

    const products = await prisma.product.findMany({
      where: {
        category: {
          has: `${category}-collection`,
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

    products.forEach(product => {
      const categories = product.category as string[];
      const primaryCategory =
        (categories.find(cat =>
          Object.keys(categorizedProducts).includes(cat)
        ) as SubCategory) || "uncategorised";
      categorizedProducts[primaryCategory].push(product);
    });

    revalidatePath(`/customer/shopping/${category}`);
    return { success: true, data: categorizedProducts };
  } catch (error) {
    console.error(`Error fetching ${category} collection:`, error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
