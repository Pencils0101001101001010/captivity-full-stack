"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { Product } from "@prisma/client";

type ProductWithFeaturedImage = Product & {
  featuredImage?: {
    id: number;
    thumbnail: string;
    medium: string;
    large: string;
    productId: number;
  } | null;
};

type FetchSummerCollectionsResult =
  | { success: true; data: ProductWithFeaturedImage[] }
  | { success: false; error: string };

export async function fetchSummerCollections(): Promise<FetchSummerCollectionsResult> {
  try {
    // Validate user session
    const { user } = await validateRequest();
    if (!user) {
      return { success: false, error: "Unauthorized. Please log in." };
    }

    // Check if the user has the CUSTOMER role
    if (user.role !== "CUSTOMER") {
      return {
        success: false,
        error: "Only customers can fetch summer collections.",
      };
    }

    // Fetch summer collections from the database
    const summerCollections = await prisma.product.findMany({
      where: {
        category: {
          hasSome: ["summer-collection"],
        },
        isPublished: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        featuredImage: true,
      },
    });

    return {
      success: true,
      data: summerCollections as ProductWithFeaturedImage[],
    };
  } catch (error: any) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";

    console.log(`Error fetching summer collections: ${errorMessage}`);

    return { success: false, error: errorMessage };
  }
}