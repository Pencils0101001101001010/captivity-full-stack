"use server";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { Product, Prisma } from "@prisma/client";

type SportSubcategory =
  | "Men"
  | "Women"
  | "Kids"
  | "New"
  | "Hoodies"
  | "Jackets"
  | "Hats"
  | "Bottoms"
  | "Summer";

type FetchSportCollectionsResult =
  | { success: true; data: Product[] }
  | { success: false; error: string };

export async function fetchSportCollections(
  type?: string,
  subcategories?: SportSubcategory[]
): Promise<FetchSportCollectionsResult> {
  try {
    const { user } = await validateRequest();
    if (!user || user.role !== "CUSTOMER") {
      throw new Error(
        "Unauthorized. Only customers can fetch sport collections."
      );
    }

    const baseWhereCondition: Prisma.ProductWhereInput = {
      categories: { contains: "Sport Collection" },
    };

    if (type) {
      baseWhereCondition.type = type;
    }

    if (subcategories && subcategories.length > 0) {
      baseWhereCondition.AND = [
        { categories: { contains: "Sport Collection" } },
        {
          OR: subcategories.map(subcat => ({
            categories: {
              contains: subcat === "New" ? "New Arrivals" : subcat,
            },
          })),
        },
      ];
    }

    const sportProducts = await prisma.product.findMany({
      where: baseWhereCondition,
      orderBy: { position: "asc" },
    });

    return { success: true, data: sportProducts };
  } catch (error) {
    console.error("Error fetching sport collections:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
