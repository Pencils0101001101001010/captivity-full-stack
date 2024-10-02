"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ProductFormValues } from "@/lib/validation";
import { redirect } from "next/navigation";

export async function createProduct(productData: ProductFormValues) {
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
    await prisma.product.create({
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
        categories: productData.categories.join(", "),
        tags: productData.tags.join(", "),
        imageUrl: productData.imageUrl,
        upsells: productData.upsells.join(", "),
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
    revalidatePath("/admin/products/create");

    // Redirect to the products page
    redirect("/admin");
  } catch (error) {
    // Log the error
    console.error("Error creating product:", error);

    // Rethrow the error to be handled by the client
    throw error;
  }
}
