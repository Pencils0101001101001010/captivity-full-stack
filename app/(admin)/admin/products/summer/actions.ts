"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { TableVariation } from "../_types/table";

// Types for table display
type TableProduct = {
  id: string;
  productName: string;
  sellingPrice: number;
  variations: {
    id: string; // New
    name: string; // New
    color: string;
    size: string;
    quantity: number;
    sku: string; // New
    sku2: string; // New
    variationImageURL: string; // This was already in your original query
    productId: string; // New
  }[];
  isPublished: boolean;
  createdAt: Date;
};

type TogglePublishResult =
  | { success: true; message: string }
  | { success: false; error: string };

// Fetch summer collection products for table
type FetchSummerCollectionResult =
  | {
      success: true;
      data: TableVariation[];
      totalCount: number;
      publishedCount: number;
      unpublishedCount: number;
    }
  | { success: false; error: string };

export async function fetchSummerCollectionTable(): Promise<FetchSummerCollectionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) {
      throw new Error("Unauthorized. Please log in.");
    }

    // Get products with their variations
    const products = await prisma.product.findMany({
      where: {
        category: {
          has: "summer-collection",
        },
      },
      select: {
        id: true,
        productName: true,
        sellingPrice: true,
        isPublished: true,
        createdAt: true,
        variations: {
          select: {
            id: true,
            name: true,
            color: true,
            size: true,
            quantity: true,
            sku: true,
            sku2: true,
            variationImageURL: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform products into flattened variations
    const tableVariations: TableVariation[] = products.flatMap(product =>
      product.variations.map(variation => ({
        id: variation.id,
        productId: product.id,
        productName: product.productName,
        name: variation.name,
        color: variation.color,
        size: variation.size,
        sku: variation.sku,
        sku2: variation.sku2,
        variationImageURL: variation.variationImageURL,
        quantity: variation.quantity,
        sellingPrice: product.sellingPrice,
        isPublished: product.isPublished,
        createdAt: product.createdAt,
      }))
    );

    // Get counts
    const totalCount = tableVariations.length;
    const publishedCount = tableVariations.filter(v => v.isPublished).length;
    const unpublishedCount = totalCount - publishedCount;

    return {
      success: true,
      data: tableVariations,
      totalCount,
      publishedCount,
      unpublishedCount,
    };
  } catch (error) {
    console.error("Error fetching summer collection for table:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

// Toggle publish status
export async function toggleProductPublish(
  productId: string
): Promise<TogglePublishResult> {
  try {
    const { user } = await validateRequest();
    if (!user) {
      throw new Error("Unauthorized. Please log in.");
    }

    // Get current publish status
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { isPublished: true },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    // Toggle the status
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: { isPublished: !product.isPublished },
    });

    // Revalidate both admin table view and frontend collection view
    revalidatePath("/admin/products/summer");
    revalidatePath("/customer/shopping/product_categories/summer");

    return {
      success: true,
      message: `Product ${updatedProduct.isPublished ? "published" : "unpublished"} successfully`,
    };
  } catch (error) {
    console.error("Error toggling product publish status:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

// Delete product
export async function deleteProduct(
  productId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const { user } = await validateRequest();
    if (!user) {
      throw new Error("Unauthorized. Please log in.");
    }

    await prisma.product.delete({
      where: { id: productId },
    });

    revalidatePath("/admin/products/summer");
    revalidatePath("/customer/shopping/product_categories/summer");

    return {
      success: true,
      message: "Product deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting product:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

// Helper function to get total inventory for a product
export async function calculateTotalInventory(
  variations: TableProduct["variations"]
): Promise<number> {
  return variations.reduce((total, variation) => total + variation.quantity, 0);
}

// Helper function to get unique colors for a product
export async function getUniqueColors(
  variations: TableProduct["variations"]
): Promise<string[]> {
  return Array.from(new Set(variations.map(v => v.color)));
}

// Helper function to get unique sizes for a product
export async function getUniqueSizes(
  variations: TableProduct["variations"]
): Promise<string[]> {
  return Array.from(new Set(variations.map(v => v.size)));
}
