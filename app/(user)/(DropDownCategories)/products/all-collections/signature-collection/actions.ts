"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Product, Prisma } from "@prisma/client";

type FetchLeisureCollectionsResult =
  | { success: true; data: Product[] }
  | { success: false; error: string };

export async function fetchSignatureCollections(
  type?: string
): Promise<FetchLeisureCollectionsResult> {
  try {
    // Validate user session
    const { user } = await validateRequest();
    if (!user) {
      throw new Error("Unauthorized. Please log in.");
    }

    // Check if the user has the ADMIN role
    if (user.role !== "ADMIN") {
      throw new Error("Only admins can fetch leisure collections.");
    }

    // Base query for leisure collections
    const baseWhereCondition: Prisma.ProductWhereInput = {
      OR: [
        {
          categories: {
            contains: "Headwear Collection > Signature Collection",
          },
        },
        { categories: { contains: "Signature Collection" } },
      ],
    };

    // If type is provided, add it to the query
    const whereCondition: Prisma.ProductWhereInput = type
      ? {
          AND: [baseWhereCondition, { type: type }],
        }
      : baseWhereCondition;

    // Fetch leisure collection products from the database
    const leisureProducts = await prisma.product.findMany({
      where: whereCondition,
      orderBy: {
        position: "asc",
      },
    });

    // Revalidate the correct admin path
    revalidatePath("/admin/products/headwear/signature-collection");

    return { success: true, data: leisureProducts };
  } catch (error) {
    console.error("Error fetching leisure collections:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}