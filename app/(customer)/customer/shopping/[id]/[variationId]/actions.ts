"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import {
  FetchProductAndVariationResult,
  FetchVariationResult,
  FetchVariationsResult,
} from "./_types/response.types";
import { ProductAndVariation, VariationWithRelations } from "./_types/variation.types";

export async function fetchVariationById(
  variationId: string
): Promise<FetchVariationResult> {
  try {
    // Validate user session
    const { user } = await validateRequest();
    if (!user) {
      return {
        success: false,
        error: "Unauthorized. Please log in.",
      };
    }

    // Fetch the variation with its related product data
    const variation = await prisma.variation.findUnique({
      where: {
        id: variationId,
      },
      include: {
        product: {
          include: {
            dynamicPricing: {
              orderBy: {
                id: "desc",
              },
              take: 1, // Get most recent pricing
            },
            featuredImage: true,
          },
        },
      },
    });

    if (!variation) {
      return {
        success: false,
        error: "Variation not found",
      };
    }

    return {
      success: true,
      data: variation as VariationWithRelations,
    };
  } catch (error) {
    console.error("Error fetching variation:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return {
        success: false,
        error: `Database error: ${error.message}`,
      };
    }
    return {
      success: false,
      error: "An unexpected error occurred while fetching the variation",
    };
  }
}

export async function fetchProductAndVariation(
  productId: string,
  variationId: string
): Promise<FetchProductAndVariationResult> {
  try {
    // Validate user session
    const { user } = await validateRequest();
    if (!user) {
      return {
        success: false,
        error: "Unauthorized. Please log in.",
      };
    }

    // Fetch product and variation in parallel for better performance
    const [product, variation] = await Promise.all([
      prisma.product.findUnique({
        where: {
          id: productId,
        },
        include: {
          dynamicPricing: {
            orderBy: {
              id: "desc",
            },
            take: 1,
          },
          variations: {
            orderBy: {
              id: "asc",
            },
          },
          featuredImage: true,
        },
      }),
      prisma.variation.findUnique({
        where: {
          id: variationId,
        },
      }),
    ]);

    if (!product) {
      return {
        success: false,
        error: "Product not found",
      };
    }

    if (!variation) {
      return {
        success: false,
        error: "Variation not found",
      };
    }

    // Verify the variation belongs to the product
    if (variation.productId !== product.id) {
      return {
        success: false,
        error: "Variation does not belong to this product",
      };
    }

    const data: ProductAndVariation = {
      product,
      variation,
    };

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Error fetching product and variation:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return {
        success: false,
        error: `Database error: ${error.message}`,
      };
    }
    return {
      success: false,
      error:
        "An unexpected error occurred while fetching the product and variation",
    };
  }
}

export async function fetchVariationsForProduct(
  productId: string
): Promise<FetchVariationsResult> {
  try {
    // Validate user session
    const { user } = await validateRequest();
    if (!user) {
      return {
        success: false,
        error: "Unauthorized. Please log in.",
      };
    }

    // Fetch all variations for the product
    const variations = await prisma.variation.findMany({
      where: {
        productId: productId,
      },
      orderBy: {
        id: "asc",
      },
      include: {
        product: {
          include: {
            dynamicPricing: {
              orderBy: {
                id: "desc",
              },
              take: 1,
            },
          },
        },
      },
    });

    if (!variations.length) {
      return {
        success: false,
        error: "No variations found for this product",
      };
    }

    return {
      success: true,
      data: variations,
    };
  } catch (error) {
    console.error("Error fetching variations:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return {
        success: false,
        error: `Database error: ${error.message}`,
      };
    }
    return {
      success: false,
      error: "An unexpected error occurred while fetching variations",
    };
  }
}

// Helper function to validate variation exists and belongs to product
export async function validateVariationBelongsToProduct(
  productId: string,
  variationId: string
): Promise<boolean> {
  try {
    const variation = await prisma.variation.findFirst({
      where: {
        AND: [{ id: variationId }, { productId: productId }],
      },
    });

    return !!variation;
  } catch {
    return false;
  }
}
