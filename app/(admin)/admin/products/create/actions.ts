"use server";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ProductFormValues } from "@/lib/validation";
import { Product } from "@prisma/client";

type CreateProductResult =
  | { success: true; data: Product }
  | { success: false; error: string };

export async function createProduct(
  productData: ProductFormValues
): Promise<CreateProductResult> {
  try {
    // Validate user session
    const { user } = await validateRequest();
    if (!user) {
      throw new Error("Unauthorized. Please log in.");
    }

    // Check if the user has the ADMIN role
    if (user.role !== "ADMIN") {
      throw new Error("Only admins can create products.");
    }

    // Create the new product in the database
    const newProduct = await prisma.product.create({
      data: {
        userId: user.id,
        name: productData.name,
        sku: productData.sku,
        type: productData.type,
        published: productData.published,
        isFeatured: productData.isFeatured,
        visibility: productData.visibility,
        shortDescription: productData.shortDescription,
        taxStatus: productData.taxStatus,
        inStock: productData.inStock,
        backordersAllowed: productData.backordersAllowed,
        soldIndividually: productData.soldIndividually,
        allowReviews: productData.allowReviews,
        categories: productData.categories.join(", "), // Assuming categories are stored as a comma-separated string
        tags: productData.tags.join(", "), // Assuming tags are stored as a comma-separated string
        imageUrl: productData.imageUrl,
        upsells: productData.upsells.join(", "), // Assuming upsells are stored as a comma-separated string
        position: productData.position,
        attribute1Name: productData.attribute1Name || null,
        attribute1Values: productData.attribute1Values?.join(", ") || null,
        attribute2Name: productData.attribute2Name || null,
        attribute2Values: productData.attribute2Values?.join(", ") || null,
        regularPrice: productData.regularPrice,
        stock: productData.stock,
      },
    });

    // Revalidate the path to ensure that new product data is reflected
    revalidatePath("/admin/products");

    return { success: true, data: newProduct };
  } catch (error) {
    console.error("Error creating product:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
