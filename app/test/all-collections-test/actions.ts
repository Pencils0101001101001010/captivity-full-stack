"use server";

import prisma from "@/lib/prisma"; // Prisma client instance

export async function fetchGroupedCategories() {
  try {
    // Query the database to fetch categories for the user's products
    const products = await prisma.product.findMany({
      select: { categories: true }, // Only select the categories field
    });

    // Group categories by collection
    const collections = {
      headwear: new Set<string>(),
      apparel: new Set<string>(),
      other: new Set<string>(),
    };

    products.forEach((product) => {
      const productCategories = product.categories
        .split(",")
        .map((category) => category.trim());

      // Assign categories to specific collections based on keywords
      productCategories.forEach((category) => {
        const lowerCaseCategory = category.toLowerCase();

        if (lowerCaseCategory.includes("headwear")) {
          collections.headwear.add(category);
        } else if (lowerCaseCategory.includes("apparel")) {
          collections.apparel.add(category);
        } else {
          collections.other.add(category); // For uncategorized or other collections
        }
      });
    });

    // Convert Sets to Arrays for easier handling
    const groupedCategories = {
      headwear: Array.from(collections.headwear),
      apparel: Array.from(collections.apparel),
      other: Array.from(collections.other),
    };

    return { groupedCategories };
  } catch (error) {
    console.error("Error fetching grouped categories:", error);
    return { error: "Failed to fetch grouped categories. Please try again." };
  }
}
