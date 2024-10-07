"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Product } from "@prisma/client";

type FetchProductByIdResult =
  | { success: true; data: Product | null }
  | { success: false; error: string };

export async function fetchProductById(
  id: number
): Promise<FetchProductByIdResult> {
  try {
    // Validate user session
    const { user } = await validateRequest();
    if (!user) {
      throw new Error("Unauthorized. Please log in.");
    }

    // Check if the user has the ADMIN role
    if (user.role !== "CUSTOMER") {
      throw new Error("Only customers can fetch product details.");
    }

    // Fetch the product from the database
    const product = await prisma.product.findUnique({
      where: { id },
    });

    // Revalidate the product detail page
    revalidatePath(`/customer/quick-order/${id}`);

    return { success: true, data: product };
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
