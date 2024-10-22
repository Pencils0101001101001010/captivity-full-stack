"use server";

import prisma from "@/lib/prisma";
import { Product } from "@prisma/client";

export type FeaturedImage = {
  id: string;
  thumbnail: string;
  medium: string;
  large: string;
  productId: string;
};

export type ProductWithFeaturedImage = Omit<Product, "featuredImage"> & {
  featuredImage: FeaturedImage | null;
};

type FetchNewHeadwearResult =
  | { success: true; data: ProductWithFeaturedImage[] }
  | { success: false; error: string };

export async function fetchNewHeadwear(): Promise<FetchNewHeadwearResult> {
  try {
    const newHeadwear = await prisma.product.findMany({
      where: {
        category: {
          hasSome: ["new-in-headwear"],
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
      data: newHeadwear.map(product => ({
        ...product,
        featuredImage: product.featuredImage || null,
      })) as ProductWithFeaturedImage[],
    };
  } catch (error: any) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";

    console.error(`Error fetching new headwear: ${errorMessage}`);

    return { success: false, error: errorMessage };
  }
}
