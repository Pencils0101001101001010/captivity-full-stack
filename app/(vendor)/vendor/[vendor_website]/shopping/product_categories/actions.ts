"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";

type Product = {
  id: string;
  productName: string;
  category: string[];
  description: string;
  sellingPrice: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  featuredImage?: {
    id: string;
    thumbnail: string;
    medium: string;
    large: string;
    vendorProductId: string;
  } | null;
};

export type FetchVendorCollectionsResult =
  | {
      success: true;
      collections: {
        african: Product[];
        baseball: Product[];
        camo: Product[];
        fashion: Product[];
        industrial: Product[];
        kids: Product[];
        leisure: Product[];
        signature: Product[];
        sport: Product[];
        summer: Product[];
        winter: Product[];
      };
      counts: {
        african: number;
        baseball: number;
        camo: number;
        fashion: number;
        industrial: number;
        kids: number;
        leisure: number;
        signature: number;
        sport: number;
        summer: number;
        winter: number;
      };
    }
  | { success: false; error: string };

export async function fetchVendorCollections(): Promise<FetchVendorCollectionsResult> {
  try {
    const { user } = await validateRequest();

    if (!user) {
      throw new Error("Authentication required");
    }

    const [
      african,
      baseball,
      camo,
      fashion,
      industrial,
      kids,
      leisure,
      signature,
      sport,
      summer,
      winter,
    ] = await Promise.all([
      prisma.vendorProduct.findMany({
        where: {
          userId: user.id,
          category: { has: "african-collection" },
        },
        include: { featuredImage: true },
      }),
      prisma.vendorProduct.findMany({
        where: {
          userId: user.id,
          category: { has: "baseball-collection" },
        },
        include: { featuredImage: true },
      }),
      prisma.vendorProduct.findMany({
        where: {
          userId: user.id,
          category: { has: "camo-collection" },
        },
        include: { featuredImage: true },
      }),
      prisma.vendorProduct.findMany({
        where: {
          userId: user.id,
          category: { has: "fashion-collection" },
        },
        include: { featuredImage: true },
      }),
      prisma.vendorProduct.findMany({
        where: {
          userId: user.id,
          category: { has: "industrial-collection" },
        },
        include: { featuredImage: true },
      }),
      prisma.vendorProduct.findMany({
        where: {
          userId: user.id,
          category: { has: "kids-collection" },
        },
        include: { featuredImage: true },
      }),
      prisma.vendorProduct.findMany({
        where: {
          userId: user.id,
          category: { has: "leisure-collection" },
        },
        include: { featuredImage: true },
      }),
      prisma.vendorProduct.findMany({
        where: {
          userId: user.id,
          category: { has: "signature-collection" },
        },
        include: { featuredImage: true },
      }),
      prisma.vendorProduct.findMany({
        where: {
          userId: user.id,
          category: { has: "sport-collection" },
        },
        include: { featuredImage: true },
      }),
      prisma.vendorProduct.findMany({
        where: {
          userId: user.id,
          category: { has: "summer-collection" },
        },
        include: { featuredImage: true },
      }),
      prisma.vendorProduct.findMany({
        where: {
          userId: user.id,
          category: { has: "winter-collection" },
        },
        include: { featuredImage: true },
      }),
    ]);

    return {
      success: true,
      collections: {
        african,
        baseball,
        camo,
        fashion,
        industrial,
        kids,
        leisure,
        signature,
        sport,
        summer,
        winter,
      },
      counts: {
        african: african.length,
        baseball: baseball.length,
        camo: camo.length,
        fashion: fashion.length,
        industrial: industrial.length,
        kids: kids.length,
        leisure: leisure.length,
        signature: signature.length,
        sport: sport.length,
        summer: summer.length,
        winter: winter.length,
      },
    };
  } catch (error) {
    console.error("Error fetching vendor collections:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
