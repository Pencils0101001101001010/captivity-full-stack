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
      // Validate user session
      const { user } = await validateRequest();
      if (!user) {
        throw new Error("Unauthorized. Please log in.");
      }
  
      // Fetch signature collection products with all relations
      const products = await prisma.product.findMany({
        where: {
          category: {
            hasSome: ["signature-collection"], // Make sure this matches your database schema
          },
          isPublished: true,
        },
        include: {
          dynamicPricing: true,
          variations: true,
          featuredImage: true,
        },
      });
  
      // Initialize categorized products
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
  
      // Categorize products
      products.forEach(product => {
        let categorized = false;
        const productCategories = Array.isArray(product.category) 
          ? product.category 
          : [];
  
        productCategories.forEach(category => {
          const normalizedCategory = category.toLowerCase();
          if (normalizedCategory in categorizedProducts) {
            categorizedProducts[normalizedCategory as Category].push(product);
            categorized = true;
          }
        });
  
        // If product hasn't been categorized, add to uncategorised
        if (!categorized) {
          categorizedProducts.uncategorised.push(product);
        }
      });
  
      revalidatePath("/customer/shopping/product_categories/signature");
      return { success: true, data: categorizedProducts };
    } catch (error) {
      console.error("Error fetching signature collection:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      };
    }
  }