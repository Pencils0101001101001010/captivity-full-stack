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
  attribute1Name: string;
  attribute1Values: string;
  attribute2Name: string;
  attribute2Values: string;
  attribute1Default?: string;
  attribute2Default?: string;
  sku?: string;
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
  attribute1Name?: string;
  attribute1Values?: string;
  attribute2Name?: string;
  attribute2Values?: string;
  attribute1Default?: string;
  attribute2Default?: string;
  sku?: string;
}

interface RelatedProduct {
  id: number;
  name: string;
  imageUrl: string;
  regularPrice: number | null;
}

export async function fetchProductById(id: string) {
  console.log("Fetching product with ID:", id);
  try {
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
      },
    });

    if (!product) {
      return { success: false, error: "Product not found" };
    }

    const baseProductName = getBaseProductName(product.name);

    // Fetch product variants (different colors and sizes)
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

    // Fetch related products
    const words = product.name.split(" ");
    const relatedProducts = await prisma.product.findMany({
      where: {
        OR: words.map(word => ({
          name: {
            contains: word,
            mode: 'insensitive',
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

    // Process images
    const mainImage = product.imageUrl.split(",")[0].trim();
    const thumbnails = productVariants.map(pv => ({
      id: pv.id,
      name: pv.name,
      imageUrl: pv.imageUrl.split(",")[0].trim(),
      stock: pv.stock,
      regularPrice: pv.regularPrice,
      attribute1Default: pv.attribute1Default,
      attribute2Default: pv.attribute2Default,
    }));

    return {
      success: true,
      data: {
        ...product,
        mainImage,
        thumbnails,
      },
      relatedProducts: relatedProducts.map(rp => ({
        ...rp,
        imageUrl: rp.imageUrl.split(",")[0].trim(),
      })),
    };
  } catch (error) {
    console.error("Error fetching product:", error);
    return { success: false, error: "Error fetching product" };
  }
}

function getBaseProductName(fullName: string): string {
  const cleanName = fullName.split(/[-–—,]/)[0].trim();
  const colorKeywords = [
    "black", "navy", "grey", "charcoal", "pink", "burgundy", "bottle",
    "olive", "tan", "mustard", "orange", "blue", "white", "red",
    "green", "yellow", "purple", "brown",
  ];
  let finalName = cleanName;
  for (const color of colorKeywords) {
    finalName = finalName.replace(new RegExp(`\\s+${color}\\s*$`, "i"), "");
  }
  return finalName.trim();
}