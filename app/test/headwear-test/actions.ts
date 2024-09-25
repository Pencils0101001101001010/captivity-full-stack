"use server";

import prisma from "@/lib/prisma"; // Prisma client instance

export async function fetchHeadwearCategories() {
  try {
    // Query the database to fetch categories for the user's products
    const products = await prisma.product.findMany({
      select: { categories: true }, // Only select the categories field
    });

    // Extract unique headwear categories from the products
    const headwearCategoriesSet = new Set<string>();
    products.forEach((product) => {
      const productCategories = product.categories
        .split(",")
        .map((category) => category.trim());

      // Filter and add only headwear-related categories
      productCategories.forEach((category) => {
        if (category.toLowerCase().includes("headwear")) {
          headwearCategoriesSet.add(category);
        }
      });
    });

    const headwearCategories = Array.from(headwearCategoriesSet); // Convert Set to Array

    return { headwearCategories };
  } catch (error) {
    console.error("Error fetching headwear categories:", error);
    return { error: "Failed to fetch headwear categories. Please try again." };
  }
}
