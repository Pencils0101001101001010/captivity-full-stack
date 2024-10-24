"use server";
import prisma from "@/lib/prisma";

interface PaginatedResponse<T> {
  success: boolean;
  data?: T[];
  error?: string;
  metadata?: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export async function fetchIndustrialCollection(
  page: number = 1,
  itemsPerPage: number = 8
): Promise<PaginatedResponse<any>> {
  try {
    // Calculate skip value for pagination
    const skip = (page - 1) * itemsPerPage;

    // Get total count of products
    const totalItems = await prisma.product.count({
      where: {
        AND: [
          {
            isPublished: true,
            category: {
              hasSome: ["industrial-collection"],
            },
          },
        ],
      },
    });

    // Calculate total pages
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Fetch paginated products
    const IndustrialProducts = await prisma.product.findMany({
      where: {
        AND: [
          {
            isPublished: true,
            category: {
              hasSome: ["industrial-collection"],
            },
          },
        ],
      },
      select: {
        id: true,
        productName: true,
        featuredImage: {
          select: {
            medium: true,
            large: true,
          },
        },
        variations: {
          select: {
            quantity: true,
          },
        },
      },
      skip: skip,
      take: itemsPerPage,
      orderBy: {
        createdAt: "desc", // Optional: sort by creation date
      },
    });

    // Transform the data
    const transformedProducts = IndustrialProducts.map(product => ({
      id: product.id,
      name: product.productName,
      imageUrl: `${product.featuredImage?.medium || ""},${product.featuredImage?.large || ""}`,
      stock: product.variations.reduce(
        (total, variation) => total + variation.quantity,
        0
      ),
    }));

    // Prepare pagination metadata
    const metadata = {
      totalItems,
      totalPages,
      currentPage: page,
      itemsPerPage,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };

    return {
      success: true,
      data: transformedProducts,
      metadata,
    };
  } catch (error) {
    console.error("Error fetching Industrial-Collection:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
