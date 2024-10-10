"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface DatabaseProduct {
  id: number;
  name: string;
  shortDescription: string;
  inStock: boolean;
  regularPrice: number | null;
  stock: number | null;
  imageUrl: string;
  attribute1Name: string | null;
  attribute1Values: string | null;
  attribute2Name: string | null;
  attribute2Values: string | null;
  attribute1Default?: string | null;
  attribute2Default?: string | null;
  sku: string;
  categories: string; // Add this line
}

interface Product {
  id: number;
  name: string;
  shortDescription: string;
  mainImage: string;
  thumbnails: Array<{
    id: number;
    name: string;
    imageUrl: string;
    stock: number | null;
    regularPrice: number | null;
    attribute1Default?: string;
    attribute2Default?: string;
  }>;
  stock: number | null;
  inStock: boolean;
  regularPrice: number | null;
  attribute1Name?: string | null;
  attribute1Values?: string | null;
  attribute2Name?: string | null;
  attribute2Values?: string | null;
  attribute1Default?: string | null;
  attribute2Default?: string | null;
  sku: string;
  categories: string; // Add this line
  categoryProducts?: Array<{
    id: number;
    name: string;
    sku: string;
    stock: number | null;
    regularPrice: number | null;
    attribute1Default?: string | null;
    attribute2Default?: string | null;
    inStock: boolean;
  }>;
}

interface RelatedProduct {
  id: number;
  name: string;
  imageUrl: string;
  regularPrice: number | null;
}

export async function fetchProductById(id: string) {
  try {
    //?    First, the function attempts to convert the id (which is a string) into a number.
    //? If the id is invalid (i.e., it's not a number), the function logs an error and returns an error message.
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      console.error("Invalid product ID:", id);
      return { success: false, error: "Invalid product ID" };
    }
    const product = await prisma.product.findUnique({
      where: { id: numericId },
      select: {
        id: true,
        name: true,
        imageUrl: true,
        shortDescription: true,
        stock: true,
        inStock: true,
        regularPrice: true,
        attribute1Name: true,
        attribute1Values: true,
        attribute2Name: true,
        attribute2Values: true,
        attribute1Default: true,
        attribute2Default: true,
        sku: true,
        categories: true,
      },
    });
    //? This query finds all other products in the same category as the current product and ensures they are published (available).

    const categoryProducts = await prisma.product.findMany({
      where: {
        categories: product?.categories,
        published: true,
      },
      select: {
        id: true,
        name: true,
        sku: true,
        stock: true,
        regularPrice: true,
        attribute1Default: true,
        attribute2Default: true,
        inStock: true,
      },
    });

    if (!product) {
      return { success: false, error: "Product not found" };
    }

    const baseProductName = getBaseProductName(product.name);

    // ?    The function fetches product variants that share the same base name (e.g., different sizes or colors of the same product)    using the startsWith condition.
    //* The not: product.name ensures that the current product is excluded from the variants.
    const productVariants = await prisma.product.findMany({
      where: {
        name: {
          startsWith: baseProductName,
          not: product.name, // Exclude the current product
        },
      },
      select: {
        id: true,
        name: true,
        imageUrl: true,
        stock: true,
        regularPrice: true,
        attribute1Default: true,
        attribute2Default: true,
      },
    });

    //?     The product name is split into individual words, and products that contain any of these words in their name are fetched (this is a keyword search).
    //? OR allows the query to match any of the words, while NOT ensures the current product is excluded.
    const words = product.name.split(" ");
    const relatedProducts = await prisma.product.findMany({
      where: {
        OR: words.map(word => ({
          name: {
            contains: word,
            mode: "insensitive",
          },
        })),
        NOT: {
          id: product.id, // Exclude the current product
        },
      },
      select: {
        id: true,
        name: true,
        imageUrl: true,
        regularPrice: true,
      },
      take: 5, // Limit to 5 related products
    });

    //?     The imageUrl field contains a comma-separated list of URLs, so the function splits them into an array.
    //?     filter removes any image URLs that contain the word "model" (likely to exclude non-product images).
    //?     mainImage is the first product image or the first available image.
    const allImages = product.imageUrl.split(",").map(url => url.trim());
    const productImages = allImages.filter(
      url => !url.toLowerCase().includes("model")
    );
    const mainImage = productImages[0] || allImages[0]; // Fallback to first image if no product images

    const thumbnails = productVariants.map(pv => {
      const variantImages = pv.imageUrl.split(",").map(url => url.trim());
      const variantProductImages = variantImages.filter(
        url => !url.toLowerCase().includes("model")
      );
      return {
        id: pv.id,
        name: pv.name,
        imageUrl: variantProductImages[0] || variantImages[0], // Fallback to first image if no product images
        stock: pv.stock,
        regularPrice: pv.regularPrice,
        attribute1Default: pv.attribute1Default,
        attribute2Default: pv.attribute2Default,
      };
    });

    return {
      success: true,
      data: {
        ...product,
        mainImage,
        thumbnails,
        productImages, // Add this to include all product images
        categoryProducts,
      },
      relatedProducts: relatedProducts.map(rp => {
        const rpImages = rp.imageUrl.split(",").map(url => url.trim());
        const rpProductImages = rpImages.filter(
          url => !url.toLowerCase().includes("model")
        );
        return {
          ...rp,
          imageUrl: rpProductImages[0] || rpImages[0], // Fallback to first image if no product images
        };
      }),
    };
  } catch (error) {
    console.error("Error fetching product:", error);
    return { success: false, error: "Error fetching product" };
  }
}

function getBaseProductName(fullName: string): string {
  const cleanName = fullName.split(/[-–—,]/)[0].trim();
  const colorKeywords = [
    "black",
    "navy",
    "grey",
    "charcoal",
    "pink",
    "burgundy",
    "bottle",
    "olive",
    "tan",
    "mustard",
    "orange",
    "blue",
    "white",
    "red",
    "green",
    "yellow",
    "purple",
    "brown",
  ];
  let finalName = cleanName;
  for (const color of colorKeywords) {
    finalName = finalName.replace(new RegExp(`\\s+${color}\\s*$`, "i"), "");
  }
  return finalName.trim();
}
