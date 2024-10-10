"use server";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { Product, Prisma } from "@prisma/client";

type WinterSubcategory =
  | "Men"
  | "Women"
  | "Kids"
  | "New"
  | "Hoodies"
  | "Jackets"
  | "Hats"
  | "Bottoms";

type FetchWinterCollectionsResult =
  | { success: true; data: Product[] }
  | { success: false; error: string };

export async function fetchWinterCollections(
  type?: string,
  subcategories?: WinterSubcategory[]
): Promise<FetchWinterCollectionsResult> {
  try {
    const { user } = await validateRequest();
    if (!user || user.role !== "CUSTOMER") {
      throw new Error(
        "Unauthorized. Only customers can fetch winter collections."
      );
    }

    const baseWhereCondition: Prisma.ProductWhereInput = {
      categories: { contains: "Winter Collection" },
    };

    if (type) {
      baseWhereCondition.type = type;
    }

    if (subcategories && subcategories.length > 0) {
      baseWhereCondition.AND = [
        { categories: { contains: "Winter Collection" } },
        {
          OR: subcategories.map(subcat => ({
            categories: {
              contains: subcat === "New" ? "New Arrivals" : subcat,
            },
          })),
        },
      ];
    }

    const winterProducts = await prisma.product.findMany({
      where: baseWhereCondition,
      orderBy: { position: "asc" },
    });
    return { success: true, data: winterProducts };
  } catch (error) {
    console.error("Error fetching winter collections:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
