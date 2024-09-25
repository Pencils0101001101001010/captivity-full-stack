"use server";

import prisma from "@/lib/prisma"; // Prisma client instance

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
      productCategories.forEach((category) => categoriesSet.add(category));
    });

    const categories = Array.from(categoriesSet); // Convert Set to Array

    return { categories };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { error: "Failed to fetch categories. Please try again." };
  }
}
