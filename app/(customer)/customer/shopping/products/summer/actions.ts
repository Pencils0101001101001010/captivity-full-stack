"use server";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { Product, Prisma } from "@prisma/client";

type SummerSubcategory = "Men" | "Women" | "Kids" | "New" | "T- Shirts";

type FetchSummerCollectionsResult =
  | { success: true; data: Product[] }
  | { success: false; error: string };

export async function fetchSummerCollections(
  type?: string,
  subcategories?: SummerSubcategory[]
): Promise<FetchSummerCollectionsResult> {
  console.log(
    `fetchSummerCollections called with type: ${type}, subcategories: ${subcategories?.join(", ")}`
  );

  try {
    const { user } = await validateRequest();
    if (!user || user.role !== "CUSTOMER") {
      throw new Error(
        "Unauthorized. Only customers can fetch summer collections."
      );
    }

    const baseWhereCondition: Prisma.ProductWhereInput = {
      categories: { contains: "Summer Collection" },
    };

    if (type) {
      baseWhereCondition.type = type;
    }

    if (subcategories && subcategories.length > 0) {
      baseWhereCondition.AND = [
        { categories: { contains: "Summer Collection" } },
        {
          OR: subcategories.map(subcat => ({
            categories: {
              contains: subcat === "New" ? "New Arrivals" : subcat,
            },
          })),
        },
      ];
    }

    const summerProducts = await prisma.product.findMany({
      where: baseWhereCondition,
      orderBy: { position: "asc" },
    });
    return { success: true, data: summerProducts };
  } catch (error) {
    console.error("Error fetching summer collections:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
