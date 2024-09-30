"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Product, Prisma } from "@prisma/client";

type FetchIndustrialCollectionsResult =
  | { success: true; data: Product[] }
  | { success: false; error: string };

export async function fetchIndustrialCollections(
  type?: string,
  query?: string
): Promise<FetchIndustrialCollectionsResult> {
  try {
    // Validate user session
    const { user } = await validateRequest();
    if (!user) {
      throw new Error("Unauthorized. Please log in.");
    }

    // Check if the user has the ADMIN role
    if (user.role !== "ADMIN") {
      throw new Error("Only admins can fetch industrial collections.");
    }

    // Base query for industrial collections
    const baseWhereCondition: Prisma.ProductWhereInput = {
      OR: [
        {
          categories: {
            contains: "Headwear Collection > Industrial Collection",
          },
        },
        { categories: { contains: "Industrial Collection" } },
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

    // Fetch industrial collection products from the database
    const industrialProducts = await prisma.product.findMany({
      where: whereCondition,
      orderBy: {
        position: "asc",
      },
    });

    // Revalidate the correct admin path
    revalidatePath("/admin/products/headwear/industrial-collection");

    return { success: true, data: industrialProducts };
  } catch (error) {
    console.error("Error fetching industrial collections:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
