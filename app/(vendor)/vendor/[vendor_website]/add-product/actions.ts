"use server";

import prisma from "@/lib/prisma";
import { validateRequest } from "@/auth";
import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";

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

    // Create the main product first
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

    // Process variations and their images
    const variationEntries = Array.from(formData.entries()).filter(([key]) =>
      key.startsWith("variations")
    );

    const variationCount = variationEntries.reduce((max, [key]) => {
      const match = key.match(/variations\.(\d+)\./);
      return match ? Math.max(max, parseInt(match[1]) + 1) : max;
    }, 0);

    // Process dynamic pricing entries
    const dynamicPricingEntries = Array.from(formData.entries()).filter(
      ([key]) => key.startsWith("dynamicPricing")
    );

    const dynamicPricingCount = dynamicPricingEntries.reduce((max, [key]) => {
      const match = key.match(/dynamicPricing\.(\d+)\./);
      return match ? Math.max(max, parseInt(match[1]) + 1) : max;
    }, 0);

    // Create dynamic pricing entries
    const dynamicPricingPromises = [];
    for (let i = 0; i < dynamicPricingCount; i++) {
      const from = formData.get(`dynamicPricing.${i}.from`);
      const to = formData.get(`dynamicPricing.${i}.to`);
      const type = formData.get(`dynamicPricing.${i}.type`);
      const amount = formData.get(`dynamicPricing.${i}.amount`);

      if (from && to && type && amount) {
        dynamicPricingPromises.push(
          prisma.vendorDynamicPricing.create({
            data: {
              from: from.toString(),
              to: to.toString(),
              type: type.toString(),
              amount: amount.toString(),
              vendorProduct: {
                connect: {
                  id: product.id,
                },
              },
            },
          })
        );
      }
    }

    // Wait for all dynamic pricing entries to be created
    await Promise.all(dynamicPricingPromises);

    // Upload variation images and create variations
    const variationImages: string[] = [];
    const variationPromises = [];

    for (let i = 0; i < variationCount; i++) {
      const variationImageFile = formData.get(`variations.${i}.image`);
      let imageUrl = "";

      if (variationImageFile instanceof File && variationImageFile.size > 0) {
        try {
          const fileExt = variationImageFile.name.split(".").pop() || "jpg";
          imageUrl = await uploadImage(
            variationImageFile,
            `vendor-products/variations/variation_${i}_${Date.now()}.${fileExt}`
          );
          variationImages[i] = imageUrl;
        } catch (error) {
          console.error(`Error uploading variation image ${i}:`, error);
          throw error;
        }
      }

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
        variationPromises.push(
          prisma.vendorVariation.create({
            data: {
              name: formData.get(`variations.${i}.name`) as string,
              color: (formData.get(`variations.${i}.color`) as string) || "",
              variationImageURL: imageUrl,
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
                  formData.get(
                    `variations.${i}.sizes.${sizeIndex}.sku`
                  ) as string
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
          })
        );
      }
    }

    // Wait for all variations to be created
    await Promise.all(variationPromises);

    // Get the complete product with all relations
    const completeProduct = await prisma.vendorProduct.findUnique({
      where: { id: product.id },
      include: {
        featuredImage: true,
        variations: true,
        dynamicPricing: true,
      },
    });

    revalidatePath("/vendor");

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
