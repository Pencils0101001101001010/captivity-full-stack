"use server";
import prisma from "@/lib/prisma";

export async function fetchPreCurvedPeaks() {
  try {
    const africanProducts = await prisma.product.findMany({
      where: {
        AND: [
          {
            published: true,
            OR: [
              {
                categories: {
                  contains: "Headwear Collection > Pre-Curved Peaks",
                },
              },
              { categories: { contains: "Pre-Curved Peaks" } },
            ],
          },
        ],
      },
      orderBy: {
        position: "asc",
      },
      select: {
        id: true,
        name: true,
        imageUrl: true,
        stock: true,
      },
    });
    return { success: true, data: africanProducts };
  } catch (error) {
    console.error("Error fetching Pre-CurvedPeaks:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function fetchProductById(id: string) {
  try {
    const numericId = parseInt(id, 10);
    const product = await prisma.product.findUnique({
      where: {
        id: numericId,
        published: true,
      },
      select: {
        id: true,
        name: true,
        imageUrl: true,
        shortDescription: true,
        stock: true,
      },
    });
    if (!product) {
      return { success: false, error: "Product not found" };
    }
    return { success: true, data: product };
  } catch (error) {
    console.error("Error fetching product:", error);
    return { success: false, error: "Error fetching product" };
  }
}
