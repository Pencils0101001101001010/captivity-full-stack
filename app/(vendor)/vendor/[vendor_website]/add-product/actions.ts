"use server";

import prisma from "@/lib/prisma";
import { validateRequest } from "@/auth";
import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

interface ImageUrls {
  thumbnail: string;
  medium: string;
  large: string;
}

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "image/bmp",
  "image/tiff",
];

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

function validateImage(file: File): void {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error(
      `Invalid image type. Allowed types: ${ALLOWED_IMAGE_TYPES.join(", ")}`
    );
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error(
      `Image size must be less than ${MAX_IMAGE_SIZE / (1024 * 1024)}MB`
    );
  }
}

async function uploadImage(file: File, path: string): Promise<string> {
  try {
    validateImage(file);
    const blob = await put(path, file, {
      access: "public",
      addRandomSuffix: false,
    });
    if (!blob.url) throw new Error("Failed to get URL from blob storage");
    return blob.url;
  } catch (error) {
    throw error;
  }
}

async function uploadFeaturedImages(file: File): Promise<ImageUrls> {
  const fileExt = file.name.split(".").pop() || "jpg";
  const timestamp = Date.now();

  try {
    const [thumbnail, medium, large] = await Promise.all([
      uploadImage(
        file,
        `vendor-products/featured/thumbnail_${timestamp}.${fileExt}`
      ),
      uploadImage(
        file,
        `vendor-products/featured/medium_${timestamp}.${fileExt}`
      ),
      uploadImage(
        file,
        `vendor-products/featured/large_${timestamp}.${fileExt}`
      ),
    ]);

    return { thumbnail, medium, large };
  } catch (error) {
    throw new Error(
      `Failed to upload featured images: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

export async function createVendorProduct(formData: FormData) {
  try {
    const { user } = await validateRequest();
    if (!user || user.role !== "VENDOR") {
      throw new Error("Unauthorized: Only vendors can create products");
    }

    // Handle featured image
    let featuredImageUrls: ImageUrls = {
      thumbnail: "",
      medium: "",
      large: "",
    };

    const featuredImageFile = formData.get("featuredImage");
    if (featuredImageFile instanceof File && featuredImageFile.size > 0) {
      featuredImageUrls = await uploadFeaturedImages(featuredImageFile);
    }

    // Process variations and their images
    const variationEntries = Array.from(formData.entries()).filter(([key]) =>
      key.startsWith("variations")
    );

    const variationCount = variationEntries.reduce((max, [key]) => {
      const match = key.match(/variations\.(\d+)\./);
      return match ? Math.max(max, parseInt(match[1]) + 1) : max;
    }, 0);

    // Upload variation images
    const variationImages: string[] = [];
    for (let i = 0; i < variationCount; i++) {
      const variationImageFile = formData.get(`variations.${i}.image`);
      if (variationImageFile instanceof File && variationImageFile.size > 0) {
        try {
          const fileExt = variationImageFile.name.split(".").pop() || "jpg";
          const url = await uploadImage(
            variationImageFile,
            `vendor-products/variations/variation_${i}_${Date.now()}.${fileExt}`
          );
          variationImages[i] = url;
        } catch (error) {
          console.error(`Error uploading variation image ${i}:`, error);
          throw error;
        }
      }
    }

    // Create product first
    const product = await prisma.vendorProduct.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
        productName: formData.get("productName") as string,
        category: formData.getAll("category[]").map(cat => cat.toString()),
        description: formData.get("description") as string,
        sellingPrice: Number(formData.get("sellingPrice")),
        isPublished: formData.get("isPublished") === "true",
        featuredImage: featuredImageUrls.thumbnail
          ? {
              create: {
                thumbnail: featuredImageUrls.thumbnail,
                medium: featuredImageUrls.medium,
                large: featuredImageUrls.large,
              },
            }
          : undefined,
      },
    });

    // Process and create variations
    for (let i = 0; i < variationCount; i++) {
      const sizesEntries = Array.from(formData.entries()).filter(([key]) =>
        key.startsWith(`variations.${i}.sizes.`)
      );

      const sizeIndices = new Set(
        sizesEntries
          .map(([key]) => {
            const match = key.match(/variations\.\d+\.sizes\.(\d+)\./);
            return match ? parseInt(match[1]) : null;
          })
          .filter((index): index is number => index !== null)
      );

      for (const sizeIndex of sizeIndices) {
        await prisma.vendorVariation.create({
          data: {
            name: formData.get(`variations.${i}.name`) as string,
            color: (formData.get(`variations.${i}.color`) as string) || "",
            variationImageURL: variationImages[i] || "",
            size:
              (
                formData.get(
                  `variations.${i}.sizes.${sizeIndex}.size`
                ) as string
              )?.trim() || "",
            quantity:
              Number(
                formData.get(`variations.${i}.sizes.${sizeIndex}.quantity`)
              ) || 0,
            sku:
              (
                formData.get(`variations.${i}.sizes.${sizeIndex}.sku`) as string
              )?.trim() || "",
            sku2:
              (
                formData.get(
                  `variations.${i}.sizes.${sizeIndex}.sku2`
                ) as string
              )?.trim() || "",
            vendorProduct: {
              connect: {
                id: product.id,
              },
            },
          },
        });
      }
    }

    // Create dynamic pricing
    for (let i = 0; i < formData.getAll("dynamicPricing.0.from").length; i++) {
      await prisma.vendorDynamicPricing.create({
        data: {
          from: formData.get(`dynamicPricing.${i}.from`) as string,
          to: formData.get(`dynamicPricing.${i}.to`) as string,
          type: formData.get(`dynamicPricing.${i}.type`) as string,
          amount: formData.get(`dynamicPricing.${i}.amount`) as string,
          vendorProduct: {
            connect: {
              id: product.id,
            },
          },
        },
      });
    }

    // Get the complete product with all relations
    const completeProduct = await prisma.vendorProduct.findUnique({
      where: { id: product.id },
      include: {
        featuredImage: true,
        variations: true,
        dynamicPricing: true,
      },
    });

    revalidatePath("/vendor/products");

    return {
      success: true,
      data: { id: product.id },
      message: "Product created successfully",
    };
  } catch (error) {
    console.error("Error creating vendor product:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
