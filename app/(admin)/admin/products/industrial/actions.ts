"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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

type FetchIndustrialCollectionResult =
  | {
      success: true;
      data: TableProduct[];
      totalCount: number;
      publishedCount: number;
      unpublishedCount: number;
    }
  | { success: false; error: string };

type TogglePublishResult =
  | { success: true; message: string }
  | { success: false; error: string };

// Fetch summer collection products for table
export async function fetchIndustrialCollectionTable(): Promise<FetchIndustrialCollectionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) {
      throw new Error("Unauthorized. Please log in.");
    }

    // Get total counts
    const totalCount = await prisma.product.count({
      where: {
        category: {
          has: "industrial-collection",
        },
      },
    });

    const publishedCount = await prisma.product.count({
      where: {
        category: {
          has: "industrial-collection",
        },
        isPublished: true,
      },
    });

    const unpublishedCount = await prisma.product.count({
      where: {
        category: {
          has: "industrial-collection",
        },
        isPublished: false,
      },
    });

    // Only fetch necessary fields for table display
    const products = await prisma.product.findMany({
      where: {
        category: {
          has: "industrial-collection",
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
            color: true,
            size: true,
            quantity: true,
            variationImageURL: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const tableProducts: TableProduct[] = products.map(product => ({
      id: product.id,
      productName: product.productName,
      sellingPrice: product.sellingPrice,
      variations: product.variations.map(variation => ({
        id: `${product.id}-${variation.color}-${variation.size}`, // Generate a unique ID
        name: `${product.productName} - ${variation.color} ${variation.size}`, // Generate a name
        color: variation.color,
        size: variation.size,
        quantity: variation.quantity,
        sku: `${product.id}-${variation.color}-${variation.size}`, // Example SKU generation
        sku2: `V-${product.id}-${variation.color}-${variation.size}`, // Another SKU variant
        variationImageURL: variation.variationImageURL,
        productId: product.id,
      })),
      isPublished: product.isPublished,
      createdAt: product.createdAt,
    }));

    return {
      success: true,
      data: tableProducts,
      totalCount,
      publishedCount,
      unpublishedCount,
    };
  } catch (error) {
    console.error("Error fetching industrial collection for table:", error);
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
    revalidatePath("/admin/products/industrial");
    revalidatePath("/customer/shopping/product_categories/industrial");

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

    revalidatePath("/admin/products/industrial");
    revalidatePath("/customer/shopping/product_categories/industrial");

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
