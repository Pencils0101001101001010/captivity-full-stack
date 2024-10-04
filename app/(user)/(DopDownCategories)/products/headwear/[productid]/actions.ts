"use server";
import prisma from "@/lib/prisma";

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
}

interface Product {
  id: number;
  name: string;
  shortDescription: string;
  mainImage: string;
  thumbnails: string[];
  stock: number | null;
  inStock: boolean;
  regularPrice: number | null;
  attribute1Name?: string;
  attribute1Values?: string;
  attribute2Name?: string;
  attribute2Values?: string;
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

    const selectedProduct = await prisma.product.findUnique({
      where: { id: numericId },
      select: {
        id: true,
        name: true,
        shortDescription: true,
        inStock: true,
        regularPrice: true,
        stock: true,
        imageUrl: true,
        attribute1Name: true,
        attribute1Values: true,
        attribute2Name: true,
        attribute2Values: true,
      },
    });

    if (!selectedProduct) {
      return { success: false, error: "Product not found" };
    }

    const selectedBaseProductName = getBaseProductName(selectedProduct.name);

    const productVariants = await prisma.product.findMany({
      where: {
        AND: [
          {
            name: {
              startsWith: selectedBaseProductName,
              mode: "insensitive",
            },
          },
          {
            name: {
              not: {
                contains: "other",
              },
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        imageUrl: true,
      },
    });

    const allProductImages = productVariants
      .map((variant) => variant.imageUrl.split(","))
      .flat()
      .map((url) => url.trim())
      .filter((url) => url && url.length > 0);

    const uniqueImages = Array.from(new Set(allProductImages));

    const sortedImages = uniqueImages.sort((a, b) => {
      const isFromMainProduct = (url: string) =>
        selectedProduct.imageUrl.includes(url);

      const getPriority = (url: string) => {
        let score = 0;
        if (isFromMainProduct(url)) score -= 1000;
        if (url.includes("-Foc") || url.includes("Foc1")) score += 1;
        else if (url.includes("-Boc") || url.includes("Boc1")) score += 2;
        else if (url.includes("-Soc") || url.includes("Soc1")) score += 3;
        else score += 4;
        return score;
      };

      return getPriority(a) - getPriority(b);
    });

    const transformedProduct: Product = {
      id: selectedProduct.id,
      name: selectedProduct.name,
      shortDescription: selectedProduct.shortDescription,
      mainImage: sortedImages[0] || "",
      thumbnails: sortedImages.slice(1),
      stock: selectedProduct.stock,
      inStock: selectedProduct.inStock,
      regularPrice: selectedProduct.regularPrice,
      attribute1Name: selectedProduct.attribute1Name ?? undefined,
      attribute1Values: selectedProduct.attribute1Values ?? undefined,
      attribute2Name: selectedProduct.attribute2Name ?? undefined,
      attribute2Values: selectedProduct.attribute2Values ?? undefined,
    };

    // Fetch related products
    const relatedProducts = await prisma.product.findMany({
      where: {
        AND: [
          { id: { not: numericId } },
          {
            OR: [
              {
                name: {
                  contains: selectedBaseProductName,
                  mode: "insensitive",
                },
              },
              { attribute1Name: selectedProduct.attribute1Name },
              { attribute2Name: selectedProduct.attribute2Name },
            ],
          },
        ],
      },
      select: {
        id: true,
        name: true,
        imageUrl: true,
        regularPrice: true,
      },
      take: 4,
    });

    const transformedRelatedProducts: RelatedProduct[] = relatedProducts.map(
      (product) => {
        const images = product.imageUrl
          .split(",")
          .map((url) => url.trim())
          .filter((url) => url);
        return {
          id: product.id,
          name: product.name,
          imageUrl: images[0] || "", // Use the first image, or an empty string if no images
          regularPrice: product.regularPrice,
        };
      }
    );

    return {
      success: true,
      data: transformedProduct,
      relatedProducts: transformedRelatedProducts,
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
