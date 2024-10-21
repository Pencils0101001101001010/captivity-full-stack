// app/actions/products.ts
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

type FetchSummerCollectionResult =
  | { success: true; data: ProductWithRelations[] }
  | { success: false; error: string };

export async function fetchSummerCollection(): Promise<FetchSummerCollectionResult> {
  try {
    // Validate user session
    const { user } = await validateRequest();
    if (!user) {
      throw new Error("Unauthorized. Please log in.");
    }

    // Fetch summer collection products with all relations
    const products = await prisma.product.findMany({
      where: {
        category: {
          has: "summer-collection",
        },
        isPublished: true,
      },
      include: {
        dynamicPricing: true,
        variations: true,
        featuredImage: true,
      },
    });

    // Revalidate the products page
    revalidatePath("/customer/shopping/summer");

    return { success: true, data: products };
  } catch (error) {
    console.error("Error fetching summer collection:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
