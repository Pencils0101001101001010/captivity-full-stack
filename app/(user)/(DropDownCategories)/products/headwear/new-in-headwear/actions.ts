"use server";

import prisma from "@/lib/prisma";

import { Prisma } from "@prisma/client";

type Product = {
  id: number;
  userId: string;
  productName: string;
  category: string[];
  description: string;
  sellingPrice: number;
  featuredImage?: {
    id: number;
    thumbnail: string;
    medium: string;
    large: string;
  } | null;
  variations?: Variation[];
  dynamicPricing?: DynamicPricing[];
};

type Variation = {
  id: number;
  name: string;
  color: string;
  size: string;
  sku: string;
  sku2: string;
  variationImageURL: string;
  quantity: number;
};

type DynamicPricing = {
  id: number;
  from: string;
  to: string;
  type: string;
  amount: string;
};

// Use this type when working with Prisma query results
type PrismaProduct = Prisma.ProductGetPayload<{
  include: {
    featuredImage: true;
    variations: true;
    dynamicPricing: true;
  };
}>;

type FetchProductsResult =
  | { success: true; data: PrismaProduct[]; totalCount: number }
  | { success: false; error: string };

type HeroImageResult =
  | { success: true; imageUrl: string }
  | { success: false; error: string };

// export async function fetchHeroImage(): Promise<HeroImageResult> {
//   try {
//     const heroProduct = await prisma.product.findFirst({
//       where: {
//         category: {
//           has: "Headwear Collection",
//         },
//       },
//       select: {
//         featuredImage: {
//           select: {
//             large: true,
//           },
//         },
//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//     });
//     if (heroProduct && heroProduct.featuredImage) {
//       return { success: true, imageUrl: heroProduct.featuredImage.large };
//     }
//     return { success: false, error: "No suitable hero image found" };
//   } catch (error) {
//     console.error("Error fetching hero image:", error);
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : "An unexpected error occurred",
//     };
//   }
// }

export async function fetchProducts(
  category?: string,
  searchQuery?: string,
  page: number = 1,
  pageSize: number = 9
): Promise<FetchProductsResult> {
  try {
    const whereCondition: Prisma.ProductWhereInput = {
      category: category ? { has: category } : undefined,
      OR: searchQuery
        ? [
            { productName: { contains: searchQuery, mode: "insensitive" } },
            { description: { contains: searchQuery, mode: "insensitive" } },
          ]
        : undefined,
    };

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where: whereCondition,
        include: {
          featuredImage: true,
          variations: true,
          dynamicPricing: true,
        },
        // orderBy: {
        //   createdAt: "desc",
        // },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.product.count({ where: whereCondition }),
    ]);

    return {
      success: true,
      data: products as PrismaProduct[],
      totalCount,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function fetchProductById(id: string) {
  try {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      console.error("Invalid product ID:", id);
      return { success: false, error: "Invalid product ID" };
    }

    const product = await prisma.product.findUnique({
      where: { id: numericId },
      include: {
        featuredImage: true,
        variations: true,
        dynamicPricing: true,
      },
    });

    if (!product) {
      return { success: false, error: "Product not found" };
    }

    const relatedProducts = await prisma.product.findMany({
      where: {
        OR: [
          { category: { hasSome: product.category } },
          {
            productName: { contains: product.productName, mode: "insensitive" },
          },
        ],
        NOT: { id: product.id },
      },
      include: {
        featuredImage: true,
      },
      take: 5,
    });

    return {
      success: true,
      data: product,
      relatedProducts,
    };
  } catch (error) {
    console.error("Error fetching product:", error);
    return { success: false, error: "Error fetching product" };
  }
}
