"use server";

import prisma from "@/lib/prisma";
import { validateRequest } from "@/auth";
import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

interface CreateProductResult {
  success: boolean;
  data?: { id: string };
  message?: string;
  error?: string;
}

interface ImageUrls {
  thumbnail: string;
  medium: string;
  large: string;
}

// Define the complete product type with relations
type ProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    featuredImage: true;
    variations: true;
    dynamicPricing: true;
  };
}>;

// Define allowed image types
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

// Validate image file
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

function validateVariationData(formData: FormData, index: number) {
  const name = formData.get(`variations.${index}.name`);
  if (!name) throw new Error(`Variation ${index} is missing a name`);

  const sizesEntries = Array.from(formData.entries()).filter(([key]) =>
    key.startsWith(`variations.${index}.sizes.`)
  );
  if (sizesEntries.length === 0) {
    throw new Error(`Variation ${index} must have at least one size`);
  }
}

async function uploadImage(file: File, path: string): Promise<string> {
  try {
    validateImage(file);

    const blob = await put(path, file, {
      access: "public",
      addRandomSuffix: false,
    });

    if (!blob.url) {
      throw new Error("Failed to get URL from blob storage");
    }

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
      uploadImage(file, `products/featured/thumbnail_${timestamp}.${fileExt}`),
      uploadImage(file, `products/featured/medium_${timestamp}.${fileExt}`),
      uploadImage(file, `products/featured/large_${timestamp}.${fileExt}`),
    ]);

    return { thumbnail, medium, large };
  } catch (error) {
    throw new Error(
      `Failed to upload featured images: ${error instanceof Error ? error.message : "Unknown error"}`
    );
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

    let featuredImageUrls: ImageUrls = {
      thumbnail: "",
      medium: "",
      large: "",
    };

    const featuredImageFile = formData.get("featuredImage");
    if (featuredImageFile instanceof File && featuredImageFile.size > 0) {
      featuredImageUrls = await uploadFeaturedImages(featuredImageFile);

      if (
        !featuredImageUrls.thumbnail ||
        !featuredImageUrls.medium ||
        !featuredImageUrls.large
      ) {
        throw new Error("Failed to get featured image URLs from blob storage");
      }
    }

    const variationEntries = Array.from(formData.entries()).filter(([key]) =>
      key.startsWith("variations")
    );

    const variationCount = variationEntries.reduce((max, [key]) => {
      const match = key.match(/variations\.(\d+)\./);
      return match ? Math.max(max, parseInt(match[1]) + 1) : max;
    }, 0);

    const variationImages: string[] = [];
    for (let i = 0; i < variationCount; i++) {
      validateVariationData(formData, i);

      const variationImageFile = formData.get(`variations.${i}.image`);
      if (variationImageFile instanceof File && variationImageFile.size > 0) {
        try {
          const fileExt = variationImageFile.name.split(".").pop() || "jpg";
          const url = await uploadImage(
            variationImageFile,
            `products/variations/variation_${i}_${Date.now()}.${fileExt}`
          );
          if (!url)
            throw new Error(`Failed to get URL for variation image ${i}`);
          variationImages[i] = url;
        } catch (error) {
          throw error;
        }
      } else {
        variationImages[i] = "";
      }
    }

    const createData: Prisma.ProductCreateInput = {
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
      variations: {
        create: Array.from({ length: variationCount }, (_, i) => {
          const sizesEntries = Array.from(formData.entries()).filter(([key]) =>
            key.startsWith(`variations.${i}.sizes.`)
          );

          const sizesCount = new Set(
            sizesEntries
              .map(([key]) => key.match(/variations\.\d+\.sizes\.(\d+)\./)?.[1])
              .filter(Boolean)
          ).size;

          return {
            name: formData.get(`variations.${i}.name`) as string,
            color: (formData.get(`variations.${i}.color`) as string) || "",
            variationImageURL: variationImages[i] || "",
            size:
              (formData.get(`variations.${i}.sizes.0.size`) as string) || "",
            sku: (formData.get(`variations.${i}.sizes.0.sku`) as string) || "",
            sku2:
              (formData.get(`variations.${i}.sizes.0.sku2`) as string) || "",
            quantity:
              Number(formData.get(`variations.${i}.sizes.0.quantity`)) || 0,
            sizes: {
              create: Array.from({ length: sizesCount }, (_, j) => ({
                size: (
                  formData.get(`variations.${i}.sizes.${j}.size`) as string
                ).trim(),
                quantity:
                  Number(formData.get(`variations.${i}.sizes.${j}.quantity`)) ||
                  0,
                sku: (
                  formData.get(`variations.${i}.sizes.${j}.sku`) as string
                ).trim(),
                sku2: (
                  formData.get(`variations.${i}.sizes.${j}.sku2`) as string
                )?.trim(),
              })),
            },
          };
        }),
      },
      dynamicPricing: {
        create: Array.from(
          { length: formData.getAll("dynamicPricing.0.from").length },
          (_, i) => ({
            from: formData.get(`dynamicPricing.${i}.from`) as string,
            to: formData.get(`dynamicPricing.${i}.to`) as string,
            type: formData.get(`dynamicPricing.${i}.type`) as string,
            amount: formData.get(`dynamicPricing.${i}.amount`) as string,
          })
        ),
      },
    };

    const product = await prisma.product.create({
      data: createData,
      include: {
        featuredImage: true,
        variations: true,
        dynamicPricing: true,
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
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
