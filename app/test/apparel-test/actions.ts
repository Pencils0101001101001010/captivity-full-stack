"use server";

import prisma from "@/lib/prisma"; // Prisma client instance

export async function fetchApparelCategories() {
  try {
    // Query the database to fetch categories for the user's products
    const products = await prisma.product.findMany({
      select: { categories: true }, // Only select the categories field
    });

    // Extract unique apparel categories from the products
    const apparelCategoriesSet = new Set<string>();
    products.forEach((product) => {
      const productCategories = product.categories
        .split(",")
        .map((category) => category.trim());

      // Filter and add only apparel-related categories
      productCategories.forEach((category) => {
        if (category.toLowerCase().includes("apparel")) {
          apparelCategoriesSet.add(category);
        }
      });
    });

    const apparelCategories = Array.from(apparelCategoriesSet); // Convert Set to Array

    return { apparelCategories };
  } catch (error) {
    console.error("Error fetching apparel categories:", error);
    return { error: "Failed to fetch apparel categories. Please try again." };
  }
}
