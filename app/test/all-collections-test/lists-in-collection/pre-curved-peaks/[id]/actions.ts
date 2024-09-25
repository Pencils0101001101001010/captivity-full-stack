"use server";

import prisma from "@/lib/prisma"; // Prisma client instance

export async function fetchPreCurvedPeaksIds() {
  try {
    // Fetch products with categories containing "Pre-Curved Peaks" under Leisure Collection
    const products = await prisma.product.findMany({
      where: {
        categories: {
          contains: "Pre-Curved Peaks",
          mode: "insensitive",
        },
      },
      select: {
        id: true, // Only select the ID field
        categories: true,
      },
    });

    // Filter products under "Leisure Collection"
    const preCurvedPeaksUnderLeisureIds = products
      .filter((product) => product.categories.includes("Leisure Collection"))
      .map((product) => product.id); // Extract only the ID

    return {
      preCurvedPeaksUnderLeisureIds: preCurvedPeaksUnderLeisureIds || [],
    }; // Ensure it returns an array
  } catch (error) {
    console.error(
      "Error fetching Pre-Curved Peaks IDs under Leisure category:",
      error
    );
    return { error: "Failed to fetch Pre-Curved Peaks IDs. Please try again." };
  }
}
