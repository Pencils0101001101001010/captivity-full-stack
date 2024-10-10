"use server";
//!Stop here
import prisma from "@/lib/prisma";

export async function fetchProductById(id: string) {
  console.log("Fetching product with ID:", id); // Debugging log

  try {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      console.error("Invalid product ID:", id); // Debugging log
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
      },
    });

    console.log("Fetched product:", product); // Debugging log

    if (!product) {
      return { success: false, error: "Product not found" };
    }

    return { success: true, data: product };
  } catch (error) {
    console.error("Error fetching product:", error);
    return { success: false, error: "Error fetching product" };
  }
}
