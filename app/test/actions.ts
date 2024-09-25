"use server";

import prisma from "@/lib/prisma"; // Prisma client instance
import { validateCategories } from "@/lib/validation"; // Category validation logic

export async function fetchCategories() {
  try {
    // Query the database to fetch categories for the user's products
    const products = await prisma.product.findMany({
      select: { categories: true }, // Only select the categories field
    });

    // Extract unique categories from the products
    const categoriesSet = new Set<string>();
    products.forEach((product) => {
      const productCategories = product.categories
        .split(",")
        .map((category) => category.trim());

      // Only add "Pre-Curved Peaks" to the categories set if it exists in the category string
      productCategories.forEach((category) => {
        if (category.includes("Pre-Curved Peaks")) {
          categoriesSet.add("Pre-Curved Peaks");
        }
      });
    });

    const categories = Array.from(categoriesSet); // Convert Set to Array

    // Validate the categories array
    const validatedCategories = validateCategories(categories);

    return { categories: validatedCategories };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { error: "Failed to fetch categories. Please try again." };
  }
}
