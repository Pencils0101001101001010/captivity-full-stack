"use server";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Product, Prisma } from "@prisma/client";

type FetchBottomsCollectionsResult =
  | { success: true; data: Product[] }
  | { success: false; error: string };

export async function fetchBottomsCollections(
  type?: string,
  searchQuery?: string
): Promise<FetchBottomsCollectionsResult> {
  try {
    // Validate user session
    const { user } = await validateRequest();
    if (!user) {
      throw new Error("Unauthorized. Please log in.");
    }

    // Check if the user has the ADMIN role
    if (user.role !== "ADMIN") {
      throw new Error("Only admins can fetch african collections.");
    }

    // Base query for leisure collections
    const baseWhereCondition: Prisma.ProductWhereInput = {
      OR: [
        {
          categories: { contains: "Apparel Collection > Bottoms" },
        },
        { categories: { contains: "Bottoms" } },
      ],
    };

    // If type is provided, add it to the query
    let whereCondition: Prisma.ProductWhereInput = type
      ? { AND: [baseWhereCondition, { type: type }] }
      : baseWhereCondition;

    // If searchQuery is provided, add it to the query
    if (searchQuery) {
      whereCondition = {
        AND: [
          whereCondition,
          {
            OR: [
              { name: { contains: searchQuery, mode: "insensitive" } },
              { sku: { contains: searchQuery, mode: "insensitive" } },
              { type: { contains: searchQuery, mode: "insensitive" } },
            ],
          },
        ],
      };
    }

    // Fetch leisure collection products from the database
    const bottomsProducts = await prisma.product.findMany({
      where: whereCondition,
      orderBy: {
        position: "asc",
      },
    });

    // Revalidate the correct admin path
    revalidatePath("/admin/products/apparel/bottoms-collection");

    return { success: true, data: bottomsProducts };
  } catch (error) {
    console.error("Error fetching leisure collections:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
