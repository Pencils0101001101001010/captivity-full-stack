"use server";

import prisma from "@/lib/prisma"; // Prisma client instance

export async function fetchPreCurvedPeaks() {
  try {
    // Query the database to fetch products with categories containing "Pre-Curved Peaks" under Leisure Collection
    const products = await prisma.product.findMany({
      where: {
        categories: {
          contains: "Pre-Curved Peaks", // Ensuring we only get the products with "Pre-Curved Peaks" in their category
          mode: "insensitive", // Case-insensitive search
        },
      },
    });

    // Filter out the products with categories under Leisure Collection
    const preCurvedPeaksUnderLeisure = products.filter((product) =>
      product.categories.includes("Leisure Collection")
    );

    return { preCurvedPeaksUnderLeisure };
  } catch (error) {
    console.error(
      "Error fetching Pre-Curved Peaks under Leisure category:",
      error
    );
    return { error: "Failed to fetch Pre-Curved Peaks. Please try again." };
  }
}
