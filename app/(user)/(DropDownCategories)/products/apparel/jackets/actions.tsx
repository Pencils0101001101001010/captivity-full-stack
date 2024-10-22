"use server";
import prisma from "@/lib/prisma";

export async function fetchJacketsApparel() {
  try {
    const jacketsProducts = await prisma.product.findMany({
      where: {
        AND: [
          {
            isPublished: true,
            category: {
              hasSome: ["jackets"],
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
    const transformedProducts = jacketsProducts.map(product => ({
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
    console.error("Error fetching Jacket's apparel:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
