"use server";
import prisma from "@/lib/prisma";

export async function fetchKidsApparel() {
  try {
    const kidsProducts = await prisma.product.findMany({
      where: {
        AND: [
          {
            isPublished: true,
            category: {
              hasSome: ["kids"],
            },
          },
        ],
      },
      select: {
        id: true,
        productName: true,
        featuredImage: {
          select: {
            medium: true,
            large: true,
          },
        },
        variations: {
          select: {
            quantity: true,
          },
        },
      },
    });

    // Transform the data to match the expected format
    const transformedProducts = kidsProducts.map(product => ({
      id: product.id,
      name: product.productName,
      imageUrl: `${product.featuredImage?.medium || ""},${product.featuredImage?.large || ""}`,
      stock: product.variations.reduce(
        (total, variation) => total + variation.quantity,
        0
      ),
    }));

    return { success: true, data: transformedProducts };
  } catch (error) {
    console.error("Error fetching Kid's apparel:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function fetchProductById(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: id,
        isPublished: true,
      },
      select: {
        id: true,
        productName: true,
        featuredImage: {
          select: {
            medium: true,
            large: true,
          },
        },
        description: true,
        variations: {
          select: {
            quantity: true,
          },
        },
      },
    });

    if (!product) {
      return { success: false, error: "Product not found" };
    }

    // Transform the data to match the expected format
    const transformedProduct = {
      id: product.id,
      name: product.productName,
      imageUrl: `${product.featuredImage?.medium || ""},${product.featuredImage?.large || ""}`,
      shortDescription: product.description,
      stock: product.variations.reduce(
        (total, variation) => total + variation.quantity,
        0
      ),
    };

    return { success: true, data: transformedProduct };
  } catch (error) {
    console.error("Error fetching product:", error);
    return { success: false, error: "Error fetching product" };
  }
}
