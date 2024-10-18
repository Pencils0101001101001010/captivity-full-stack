"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { FetchSummerCollectionResult, ValidatedUser } from "./types";

export async function fetchSummerCollection(): Promise<FetchSummerCollectionResult> {
  try {
    // Validate user session
    const { user } = (await validateRequest()) as {
      user: ValidatedUser | null;
    };
    if (!user) {
      throw new Error("Unauthorized. Please log in.");
    }

    // Check if the user has the CUSTOMER role
    if (user.role !== UserRole.CUSTOMER) {
      throw new Error("Only customers can access the summer collection.");
    }

    // Fetch summer collection products from the database
    const summerProducts = await prisma.product.findMany({
      where: {
        category: {
          has: "summer-collection",
        },
        isPublished: true,
      },
      select: {
        id: true,
        productName: true,
        category: true,
        description: true,
        sellingPrice: true,
        featuredImage: {
          select: {
            thumbnail: true,
            medium: true,
            large: true,
          },
        },
      },
    });

    return { success: true, data: summerProducts };
  } catch (error) {
    console.error("Error fetching summer collection:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
