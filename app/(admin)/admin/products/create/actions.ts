"use server";

import prisma from "@/lib/prisma";
import { validateRequest } from "@/auth";
import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { ProductFormData, productFormSchema } from "./types";

export type CreateProductResult =
  | { success: true; data: { id: string }; message: string }
  | { success: false; error: string };

async function uploadImage(file: File, path: string) {
  try {
    const blob = await put(path, file, {
      access: "public",
      addRandomSuffix: false,
    });
    return blob.url;
  } catch (error) {
    console.error(`Error uploading image to ${path}:`, error);
    throw error;
  }
}

export async function createProduct(
  formData: FormData
): Promise<CreateProductResult> {
  try {
    const { user } = await validateRequest();
    if (!user) {
      throw new Error("Unauthorized access");
    }

    // Handle featured image upload first
    let featuredImageUrls = {
      thumbnail: "",
      medium: "",
      large: "",
    };

    const featuredImageFile = formData.get("featuredImage");
    if (featuredImageFile instanceof File && featuredImageFile.size > 0) {
      const fileExt = featuredImageFile.name.split(".").pop() || "jpg";
      const timestamp = Date.now();

      const [thumbnail, medium, large] = await Promise.all([
        put(
          `products/featured/thumbnail_${timestamp}.${fileExt}`,
          featuredImageFile,
          {
            access: "public",
            addRandomSuffix: false,
          }
        ),
        put(
          `products/featured/medium_${timestamp}.${fileExt}`,
          featuredImageFile,
          {
            access: "public",
            addRandomSuffix: false,
          }
        ),
        put(
          `products/featured/large_${timestamp}.${fileExt}`,
          featuredImageFile,
          {
            access: "public",
            addRandomSuffix: false,
          }
        ),
      ]);

      featuredImageUrls = {
        thumbnail: thumbnail.url,
        medium: medium.url,
        large: large.url,
      };
    }

    // Get the number of variations
    const variationCount = Array.from(formData.entries())
      .filter(([key]) => key.startsWith("variations"))
      .reduce((max, [key]) => {
        const match = key.match(/variations\.(\d+)\./);
        return match ? Math.max(max, parseInt(match[1]) + 1) : max;
      }, 0);

    // Handle variation images upload
    const variationImages: string[] = [];
    for (let i = 0; i < variationCount; i++) {
      const variationImageFile = formData.get(`variations.${i}.image`);
      if (variationImageFile instanceof File && variationImageFile.size > 0) {
        const fileExt = variationImageFile.name.split(".").pop() || "jpg";
        const blob = await put(
          `products/variations/variation_${i}_${Date.now()}.${fileExt}`,
          variationImageFile,
          { access: "public", addRandomSuffix: false }
        );
        variationImages[i] = blob.url;
      } else {
        variationImages[i] = "";
      }
    }

    // Process other form data
    const processedData = {
      productName: formData.get("productName") as string,
      category: formData.getAll("category[]").map(cat => cat.toString()),
      description: formData.get("description") as string,
      sellingPrice: Number(formData.get("sellingPrice")),
      isPublished: formData.get("isPublished") === "true",

      variations: Array.from({ length: variationCount }, (_, i) => ({
        name: formData.get(`variations.${i}.name`) as string,
        color: (formData.get(`variations.${i}.color`) as string) || "",
        size: (formData.get(`variations.${i}.size`) as string) || "",
        sku: formData.get(`variations.${i}.sku`) as string,
        sku2: (formData.get(`variations.${i}.sku2`) as string) || "",
        variationImageURL: variationImages[i] || "",
        quantity: Number(formData.get(`variations.${i}.quantity`)) || 0,
      })),

      dynamicPricing: Array.from(
        { length: formData.getAll("dynamicPricing.0.from").length },
        (_, i) => ({
          from: formData.get(`dynamicPricing.${i}.from`) as string,
          to: formData.get(`dynamicPricing.${i}.to`) as string,
          type: formData.get(`dynamicPricing.${i}.type`) as
            | "fixed_price"
            | "percentage",
          amount: formData.get(`dynamicPricing.${i}.amount`) as string,
        })
      ),
    };

    // Create product in database
    const product = await prisma.product.create({
      data: {
        userId: user.id,
        productName: processedData.productName,
        category: processedData.category,
        description: processedData.description,
        sellingPrice: processedData.sellingPrice,
        isPublished: processedData.isPublished,
        featuredImage: featuredImageUrls.thumbnail
          ? {
              create: {
                thumbnail: featuredImageUrls.thumbnail,
                medium: featuredImageUrls.medium,
                large: featuredImageUrls.large,
              },
            }
          : undefined,
        variations: {
          create: processedData.variations.map(variation => ({
            name: variation.name,
            color: variation.color,
            size: variation.size,
            sku: variation.sku,
            sku2: variation.sku2,
            variationImageURL: variation.variationImageURL,
            quantity: variation.quantity,
          })),
        },
        dynamicPricing: {
          create: processedData.dynamicPricing.map(pricing => ({
            from: pricing.from,
            to: pricing.to,
            type: pricing.type,
            amount: pricing.amount,
          })),
        },
      },
    });

    revalidatePath("/products");
    revalidatePath("/admin/products");

    return {
      success: true,
      data: { id: product.id },
      message: "Product created successfully",
    };
  } catch (error) {
    console.error("Error creating product:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
