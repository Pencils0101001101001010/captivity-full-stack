"use server";
import prisma from "@/lib/prisma";
import { Prisma, Product } from "@prisma/client";

type FetchPreCurvedPeaksResult =
  | { success: true; data: Product[]; totalCount: number }
  | { success: false; error: string };

type HeroImageResult =
  | { success: true; imageUrl: string }
  | { success: false; error: string };

export async function fetchHeroImage(): Promise<HeroImageResult> {
  try {
    const heroProduct = await prisma.product.findFirst({
      where: {
        categories: {
          contains: "Headwear Collection",
        },
        imageUrl: {
          contains: "model",
        },
      },
      select: {
        imageUrl: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (heroProduct && heroProduct.imageUrl) {
      const images = heroProduct.imageUrl.split(",").map(url => url.trim());
      const heroImage = images.find(
        url =>
          url.includes("model") ||
          url.includes("header") ||
          url.includes("New in Headwear")
      );

      if (heroImage) {
        return { success: true, imageUrl: heroImage };
      }
    }

    // If no suitable hero image is found
    return { success: false, error: "No suitable hero image found" };
  } catch (error) {
    console.error("Error fetching hero image:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function fetchNewInHeadwear(
  type?: string,
  searchQuery?: string,
  page: number = 1,
  pageSize: number = 9
): Promise<FetchPreCurvedPeaksResult> {
  try {
    const baseWhereCondition: Prisma.ProductWhereInput = {
      published: true,
      OR: [
        { categories: { contains: "Headwear Collection > New in Headwear" } },
        { categories: { contains: "New in Headwear" } },
      ],
    };
    const conditions: Prisma.ProductWhereInput[] = [baseWhereCondition];
    if (type) {
      conditions.push({ type });
    }
    if (searchQuery) {
      conditions.push({
        OR: [
          { name: { contains: searchQuery, mode: "insensitive" } },
          { sku: { contains: searchQuery, mode: "insensitive" } },
          { type: { contains: searchQuery, mode: "insensitive" } },
        ],
      });
    }
    const whereCondition: Prisma.ProductWhereInput = {
      AND: conditions,
    };

    const [NewInHeadwearProducts, totalCount] = await Promise.all([
      prisma.product.findMany({
        where: whereCondition,
        orderBy: {
          position: "asc",
        },
        select: {
          id: true,
          userId: true,
          type: true,
          sku: true,
          name: true,
          published: true,
          isFeatured: true,
          visibility: true,
          shortDescription: true,
          taxStatus: true,
          inStock: true,
          backordersAllowed: true,
          soldIndividually: true,
          allowReviews: true,
          categories: true,
          tags: true,
          imageUrl: true,
          upsells: true,
          position: true,
          attribute1Name: true,
          attribute1Values: true,
          attribute2Name: true,
          attribute2Values: true,
          regularPrice: true,
          stock: true,
          createdAt: true,
          attribute1Default: true,
          attribute2Default: true,
          updatedAt: true,
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.product.count({ where: whereCondition }),
    ]);

    return { success: true, data: NewInHeadwearProducts, totalCount };
  } catch (error) {
    console.error("Error fetching New in Headwear:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function fetchProductById(id: string) {
  console.log("Fetching product with ID:", id);
  try {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      console.error("Invalid product ID:", id);
      return { success: false, error: "Invalid product ID" };
    }
    const product = await prisma.product.findUnique({
      where: { id: numericId },
      select: {
        id: true,
        name: true,
        imageUrl: true,
        shortDescription: true,
        stock: true,
      },
    });
    console.log("Fetched product:", product);
    if (!product) {
      return { success: false, error: "Product not found" };
    }
    // Split the imageUrl into an array and process thumbnails
    const images = product.imageUrl.split(",").map(url => url.trim());
    const mainImage = images[0];
    const thumbnails = images.filter(
      url =>
        url.includes("Foc") ||
        url.includes("Boc") ||
        url.includes("Soc") ||
        url.includes("Boc1") ||
        url.includes("Soc1") ||
        url.includes("Foc1") ||
        url.includes("foc1") ||
        url.includes("soc1") ||
        url.includes("boc1") ||
        url.includes("foc") ||
        url.includes("soc") ||
        url.includes("boc") ||
        url.includes(product.name)
    );
    return {
      success: true,
      data: {
        id: product.id,
        name: product.name,
        shortDescription: product.shortDescription,
        stock: product.stock,
        mainImage,
        thumbnails,
      },
    };
  } catch (error) {
    console.error("Error fetching product:", error);
    return { success: false, error: "Error fetching product" };
  }
}
