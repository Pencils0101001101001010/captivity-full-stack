// app/actions/productActions.ts
"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import {
  FetchProductByIdResult,
  Product,
  Variation,
  DynamicPricing,
} from "../types";

export async function fetchProductById(
  id: string
): Promise<FetchProductByIdResult> {
  try {
    // Validate user session
    const { user } = await validateRequest();
    if (!user) {
      throw new Error("Unauthorized. Please log in.");
    }

    // Convert id to number, as your schema likely uses integer IDs
    const productId = parseInt(id, 10);

    if (isNaN(productId)) {
      throw new Error("Invalid product ID");
    }

    // Fetch the product from the database
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        featuredImage: true,
        variations: true,
        dynamicPricing: true,
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    // Convert the Prisma product to the Product type
    const productData: Product = {
      id: product.id,
      productName: product.productName,
      category: product.category,
      description: product.description,
      sellingPrice: product.sellingPrice,
      isPublished: product.isPublished, // Include the isPublished property
      featuredImage: product.featuredImage
        ? {
            thumbnail: product.featuredImage.thumbnail,
            medium: product.featuredImage.medium,
            large: product.featuredImage.large,
          }
        : null,
      variations: product.variations.map(
        (v): Variation => ({
          id: v.id,
          name: v.name,
          color: v.color,
          size: v.size,
          sku: v.sku,
          sku2: v.sku2,
          variationImageURL: v.variationImageURL,
          quantity: v.quantity,
        })
      ),
      dynamicPricing: product.dynamicPricing.map(
        (dp): DynamicPricing => ({
          id: dp.id,
          from: dp.from,
          to: dp.to,
          type: dp.type,
          amount: dp.amount,
        })
      ),
    };

    return { success: true, data: productData };
  } catch (error) {
    console.error("Error fetching product:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
