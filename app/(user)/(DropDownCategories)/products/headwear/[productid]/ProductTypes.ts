import prisma from "@/lib/prisma";
import { Product, Variation, DynamicPricing } from "@prisma/client";

export type FeaturedImage = {
  id: number;
  thumbnail: string;
  medium: string;
  large: string;
  productId: number;
};

export type ProductWithFeaturedImage = Omit<Product, "featuredImage"> & {
  featuredImage: FeaturedImage | null;
  variations: Variation[];
  dynamicPricing: DynamicPricing[];
};

export type FetchNewHeadwearResult =
  | { success: true; data: ProductWithFeaturedImage[] }
  | { success: false; error: string };

export type FetchProductByIdResult =
  | { success: true; data: ProductWithFeaturedImage }
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
        variations: true,
        dynamicPricing: true,
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

export async function fetchProductById(
  id: number
): Promise<FetchProductByIdResult> {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        featuredImage: true,
        variations: true,
        dynamicPricing: true,
      },
    });

    if (!product) {
      return { success: false, error: "Product not found" };
    }

    return {
      success: true,
      data: {
        ...product,
        featuredImage: product.featuredImage || null,
      } as ProductWithFeaturedImage,
    };
  } catch (error: any) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    console.error(`Error fetching product by ID: ${errorMessage}`);
    return { success: false, error: errorMessage };
  }
}
