"use server";

import prisma from "@/lib/prisma";
import { validateRequest } from "@/auth";
import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { ProductFormData, productFormSchema } from "./types";
import { Prisma } from "@prisma/client";

// Type Definitions
export type CreateProductResult =
  | { success: true; data: { id: string }; message: string }
  | { success: false; error: string };

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
  console.log("🔍 Validating image:", {
    name: file.name,
    type: file.type,
    size: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
  });

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    console.error("❌ Invalid image type:", {
      providedType: file.type,
      allowedTypes: ALLOWED_IMAGE_TYPES,
    });
    throw new Error(
      `Invalid image type. Allowed types: ${ALLOWED_IMAGE_TYPES.join(", ")}`
    );
  }

  if (file.size > MAX_IMAGE_SIZE) {
    console.error("❌ Image too large:", {
      size: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
      maxSize: `${MAX_IMAGE_SIZE / 1024 / 1024}MB`,
    });
    throw new Error(
      `Image size must be less than ${MAX_IMAGE_SIZE / (1024 * 1024)}MB`
    );
  }

  console.log("✅ Image validation passed");
}

function validateVariationData(
  formData: FormData,
  variationIndex: number
): void {
  const name = formData.get(`variations.${variationIndex}.name`);
  const color = formData.get(`variations.${variationIndex}.color`);

  // Get the number of sizes for this variation
  const sizesEntries = Array.from(formData.entries()).filter(([key]) =>
    key.startsWith(`variations.${variationIndex}.sizes.`)
  );

  const sizesCount = new Set(
    sizesEntries
      .map(([key]) => key.match(/variations\.\d+\.sizes\.(\d+)\./)?.[1])
      .filter(Boolean)
  ).size;

  console.log(`🔍 Validating variation ${variationIndex} data:`, {
    name,
    color,
    sizesCount,
  });

  if (!name || typeof name !== "string" || name.trim() === "") {
    console.error(`❌ Invalid name for variation ${variationIndex}`);
    throw new Error(`Name is required for variation ${variationIndex}`);
  }

  // Validate each size entry
  for (let sizeIndex = 0; sizeIndex < sizesCount; sizeIndex++) {
    const sku = formData.get(
      `variations.${variationIndex}.sizes.${sizeIndex}.sku`
    );
    const size = formData.get(
      `variations.${variationIndex}.sizes.${sizeIndex}.size`
    );
    const quantity = formData.get(
      `variations.${variationIndex}.sizes.${sizeIndex}.quantity`
    );

    console.log(
      `🔍 Validating size ${sizeIndex} for variation ${variationIndex}:`,
      {
        sku,
        size,
        quantity,
      }
    );

    if (!sku || typeof sku !== "string" || sku.trim() === "") {
      console.error(
        `❌ Invalid SKU for size ${sizeIndex} in variation ${variationIndex}`
      );
      throw new Error(
        `SKU is required for size ${sizeIndex} in variation ${variationIndex}`
      );
    }

    if (!size || typeof size !== "string" || size.trim() === "") {
      console.error(
        `❌ Invalid size for size ${sizeIndex} in variation ${variationIndex}`
      );
      throw new Error(
        `Size is required for size ${sizeIndex} in variation ${variationIndex}`
      );
    }
  }
}

async function uploadImage(file: File, path: string): Promise<string> {
  console.log("📤 Starting image upload:", {
    fileName: file.name,
    fileType: file.type,
    fileSize: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
    uploadPath: path,
  });

  try {
    validateImage(file);

    console.log("🚀 Initiating blob upload...");
    const blob = await put(path, file, {
      access: "public",
      addRandomSuffix: false,
    });

    console.log("📥 Blob upload response:", {
      url: blob.url,
      pathname: blob.pathname,
    });

    if (!blob.url) {
      console.error("❌ No URL in blob response");
      throw new Error("Failed to get URL from blob storage");
    }

    console.log("✅ Image upload successful:", blob.url);
    return blob.url;
  } catch (error) {
    console.error("❌ Error uploading image:", {
      path,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    throw error;
  }
}

async function uploadFeaturedImages(file: File): Promise<ImageUrls> {
  console.log("🎯 Starting featured images upload");
  const fileExt = file.name.split(".").pop() || "jpg";
  const timestamp = Date.now();

  try {
    console.log("📁 Uploading three versions of featured image");
    const [thumbnail, medium, large] = await Promise.all([
      uploadImage(file, `products/featured/thumbnail_${timestamp}.${fileExt}`),
      uploadImage(file, `products/featured/medium_${timestamp}.${fileExt}`),
      uploadImage(file, `products/featured/large_${timestamp}.${fileExt}`),
    ]);

    const urls = {
      thumbnail,
      medium,
      large,
    };

    console.log("✅ All featured images uploaded successfully:", urls);
    return urls;
  } catch (error) {
    console.error("❌ Featured images upload failed:", {
      error:
        error instanceof Error
          ? {
              message: error.message,
              stack: error.stack,
            }
          : "Unknown error",
    });
    throw new Error(
      `Failed to upload featured images: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

export async function createProduct(
  formData: FormData
): Promise<CreateProductResult> {
  console.log("🚀 Starting product creation process");

  try {
    // Log all form data entries
    console.log("📝 Received form data:", {
      entries: Array.from(formData.entries()).map(([key, value]) => ({
        key,
        type: value instanceof File ? "File" : typeof value,
        fileSize:
          value instanceof File
            ? `${(value.size / 1024 / 1024).toFixed(2)}MB`
            : null,
      })),
    });

    const { user } = await validateRequest();
    if (!user) {
      console.error("❌ No user found in request");
      throw new Error("Unauthorized access");
    }
    console.log("👤 User authorized:", { userId: user.id });

    // Handle featured image upload first
    let featuredImageUrls: ImageUrls = {
      thumbnail: "",
      medium: "",
      large: "",
    };

    const featuredImageFile = formData.get("featuredImage");
    console.log("🖼️ Featured image file:", {
      exists: !!featuredImageFile,
      isFile: featuredImageFile instanceof File,
      size:
        featuredImageFile instanceof File
          ? `${(featuredImageFile.size / 1024 / 1024).toFixed(2)}MB`
          : "N/A",
      type: featuredImageFile instanceof File ? featuredImageFile.type : "N/A",
    });

    if (featuredImageFile instanceof File && featuredImageFile.size > 0) {
      featuredImageUrls = await uploadFeaturedImages(featuredImageFile);

      if (
        !featuredImageUrls.thumbnail ||
        !featuredImageUrls.medium ||
        !featuredImageUrls.large
      ) {
        console.error(
          "❌ Missing URLs in featuredImageUrls:",
          featuredImageUrls
        );
        throw new Error("Failed to get featured image URLs from blob storage");
      }
      console.log("✅ Featured image URLs received:", featuredImageUrls);
    }

    // Get the number of variations
    const variationEntries = Array.from(formData.entries()).filter(([key]) =>
      key.startsWith("variations")
    );

    console.log(
      "📦 Found variation entries:",
      variationEntries.map(([key]) => key)
    );

    const variationCount = variationEntries.reduce((max, [key]) => {
      const match = key.match(/variations\.(\d+)\./);
      return match ? Math.max(max, parseInt(match[1]) + 1) : max;
    }, 0);

    console.log("📊 Processing variations:", { count: variationCount });

    // Handle variation images upload
    const variationImages: string[] = [];
    for (let i = 0; i < variationCount; i++) {
      console.log(`📎 Processing variation ${i}`);

      // Validate variation data first
      validateVariationData(formData, i);

      const variationImageFile = formData.get(`variations.${i}.image`);
      console.log(`🖼️ Variation image ${i}:`, {
        exists: !!variationImageFile,
        isFile: variationImageFile instanceof File,
        size:
          variationImageFile instanceof File
            ? `${(variationImageFile.size / 1024 / 1024).toFixed(2)}MB`
            : "N/A",
        type:
          variationImageFile instanceof File ? variationImageFile.type : "N/A",
      });

      if (variationImageFile instanceof File && variationImageFile.size > 0) {
        try {
          const fileExt = variationImageFile.name.split(".").pop() || "jpg";
          const url = await uploadImage(
            variationImageFile,
            `products/variations/variation_${i}_${Date.now()}.${fileExt}`
          );

          if (!url) {
            console.error(`❌ No URL received for variation ${i}`);
            throw new Error(`Failed to get URL for variation image ${i}`);
          }

          variationImages[i] = url;
          console.log(`✅ Variation ${i} image uploaded:`, url);
        } catch (error) {
          console.error(`❌ Error uploading variation ${i} image:`, error);
          throw error;
        }
      } else {
        variationImages[i] = "";
        console.log(`ℹ️ No image provided for variation ${i}`);
      }
    }

    // Create product in database
    console.log("💾 Creating product in database...");
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
                sku2:
                  (
                    formData.get(`variations.${i}.sizes.${j}.sku2`) as string
                  )?.trim() || undefined,
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
            type: formData.get(`dynamicPricing.${i}.type`) as
              | "fixed_price"
              | "percentage",
            amount: formData.get(`dynamicPricing.${i}.amount`) as string,
          })
        ),
      },
    };

    console.log("📦 Database create payload:", createData);

    const product = await prisma.product.create({
      data: createData,
      include: {
        featuredImage: true,
        variations: true,
        dynamicPricing: true,
      },
    });

    console.log("✅ Product created successfully:", {
      productId: product.id,
      hasFeaturedImage: !!product.featuredImage,
      variationsCount: product.variations.length,
      dynamicPricingCount: product.dynamicPricing.length,
    });

    revalidatePath("/products");
    revalidatePath("/admin/products");

    return {
      success: true,
      data: { id: product.id },
      message: "Product created successfully",
    };
  } catch (error) {
    console.error("❌ Error in createProduct:", {
      error:
        error instanceof Error
          ? {
              message: error.message,
              stack: error.stack,
            }
          : "Unknown error",
    });

    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
