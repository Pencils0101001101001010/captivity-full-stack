"use server";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Product, Prisma } from "@prisma/client";

type FetchNewCollectionsResult =
  | { success: true; data: Product[] }
  | { success: false; error: string };

export async function fetchNewCollections(
  type?: string
): Promise<FetchNewCollectionsResult> {
  try {
    // Validate user session
    const { user } = await validateRequest();
    if (!user) {
      throw new Error("Unauthorized. Please log in.");
    }

    // Check if the user has the ADMIN role
    if (user.role !== "CUSTOMER") {
      throw new Error("Only customer can fetch new in headwear collections.");
    }

    // Base query for new collections
    const baseWhereCondition: Prisma.ProductWhereInput = {
      OR: [{ categories: { contains: "New" } }],
    };

    // If type is provided, add it to the query
    let whereCondition: Prisma.ProductWhereInput = type
      ? { AND: [baseWhereCondition, { type: type }] }
      : baseWhereCondition;

    // Fetch new collection products from the database
    const newProducts = await prisma.product.findMany({
      where: whereCondition,
      orderBy: {
        position: "asc",
      },
    });

    return { success: true, data: newProducts };
  } catch (error) {
    console.error("Error fetching new collections:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
