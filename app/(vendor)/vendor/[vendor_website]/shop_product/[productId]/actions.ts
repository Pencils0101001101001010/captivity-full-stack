"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import {
  VendorProduct,
  VendorDynamicPricing,
  VendorVariation,
  VendorFeaturedImage,
} from "@prisma/client";

type VendorProductWithRelations = VendorProduct & {
  dynamicPricing: VendorDynamicPricing[];
  variations: VendorVariation[];
  featuredImage: VendorFeaturedImage | null;
};

type FetchVendorProductResult =
  | { success: true; data: VendorProductWithRelations }
  | { success: false; error: string };

export async function fetchVendorProductById(
  productId: string
): Promise<FetchVendorProductResult> {
  try {
    // Validate user session
    const { user } = await validateRequest();
    if (!user) {
      throw new Error("Unauthorized. Please log in.");
    }

    // Fetch the vendor product with all relations
    const product = await prisma.vendorProduct.findUnique({
      where: {
        id: productId,
      },
      include: {
        dynamicPricing: true,
        variations: true,
        featuredImage: true,
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    // Verify the product belongs to the vendor
    if (product.userId !== user.id) {
      throw new Error("Unauthorized. This product belongs to another vendor.");
    }

    return { success: true, data: product };
  } catch (error) {
    console.error("Error fetching vendor product:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
