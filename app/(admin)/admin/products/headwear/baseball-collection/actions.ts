"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Product, Prisma } from "@prisma/client";

type FetchBaseballCollectionsResult =
  | { success: true; data: Product[] }
  | { success: false; error: string };

export async function fetchBaseballCollections(
  type?: string,
  query?: string
): Promise<FetchBaseballCollectionsResult> {
  try {
    // Validate user session
    const { user } = await validateRequest();
    if (!user) {
      throw new Error("Unauthorized. Please log in.");
    }

    // Check if the user has the ADMIN role
    if (user.role !== "ADMIN") {
      throw new Error("Only admins can fetch baseball collections.");
    }

    // Base query for baseball collections
    const baseWhereCondition: Prisma.ProductWhereInput = {
      OR: [
        {
          categories: { contains: "Headwear Collection > Baseball Collection" },
        },
        { categories: { contains: "Baseball Collection" } },
      ],
    };

    // If type is provided, add it to the query
    let whereCondition: Prisma.ProductWhereInput = type
      ? {
          AND: [baseWhereCondition, { type: type }],
        }
      : baseWhereCondition;

    // If query is provided, add it to the search conditions
    if (query) {
      whereCondition = {
        AND: [
          whereCondition,
          {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { sku: { contains: query, mode: "insensitive" } },
              { type: { contains: query, mode: "insensitive" } },
            ],
          },
        ],
      };
    }

    // Fetch baseball collection products from the database
    const baseballProducts = await prisma.product.findMany({
      where: whereCondition,
      orderBy: {
        position: "asc",
      },
    });

    // Revalidate the correct admin path
    revalidatePath("/admin/products/headwear/baseball-collection");

    return { success: true, data: baseballProducts };
  } catch (error) {
    console.error("Error fetching baseball collections:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
