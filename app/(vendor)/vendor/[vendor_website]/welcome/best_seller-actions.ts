"use server";

import { put, del } from "@vercel/blob";
import prisma from "@/lib/prisma";
import { validateRequest } from "@/auth";

interface BestSellerActionResult {
  success: boolean;
  urls?: string[];
  url?: string;
  error?: string;
}

export async function uploadBestSeller(
  formData: FormData
): Promise<BestSellerActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) throw new Error("Unauthorized access");
    if (user.role !== "VENDOR")
      throw new Error("Only vendors can manage best seller images");

    const file = formData.get("bestSeller") as File;
    if (!file || !file.size) throw new Error("No file provided");
    if (!file.type.startsWith("image/"))
      throw new Error("File must be an image");
    if (file.size > 5 * 1024 * 1024)
      throw new Error("File size must be less than 5MB");

    const bestSellerCount = await prisma.bestSellerImage.count({
      where: {
        userSettings: {
          userId: user.id,
        },
      },
    });

    if (bestSellerCount >= 4) {
      throw new Error("Maximum of 4 best seller images allowed");
    }

    const fileExt = file.name.split(".").pop() || "png";
    const timestamp = Date.now();
    const path = `bestsellers/bestseller_${user.id}_${timestamp}.${fileExt}`;

    const blob = await put(path, file, {
      access: "public",
      addRandomSuffix: false,
    });

    if (!blob.url) throw new Error("Failed to get URL from blob storage");

    const userSettings = await prisma.userSettings.upsert({
      where: { userId: user.id },
      update: {},
      create: { userId: user.id },
    });

    await prisma.bestSellerImage.create({
      data: {
        url: blob.url,
        userSettingsId: userSettings.id,
        order: bestSellerCount,
      },
    });

    const allBestSellers = await prisma.bestSellerImage.findMany({
      where: {
        userSettings: {
          userId: user.id,
        },
      },
      orderBy: {
        order: "asc",
      },
    });

    return {
      success: true,
      url: blob.url,
      urls: allBestSellers.map(bestSeller => bestSeller.url),
    };
  } catch (error) {
    console.error("Error uploading best seller image:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function removeBestSeller(
  url: string
): Promise<BestSellerActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) throw new Error("Unauthorized access");
    if (user.role !== "VENDOR")
      throw new Error("Only vendors can manage best seller images");

    const bestSeller = await prisma.bestSellerImage.findFirst({
      where: {
        url: url,
        userSettings: {
          userId: user.id,
        },
      },
    });

    if (!bestSeller) {
      throw new Error("Best seller image not found");
    }

    const path = new URL(url).pathname.slice(1);
    await del(path);

    await prisma.bestSellerImage.delete({
      where: { id: bestSeller.id },
    });

    const remainingBestSellers = await prisma.bestSellerImage.findMany({
      where: {
        userSettings: {
          userId: user.id,
        },
      },
      orderBy: { order: "asc" },
    });

    for (let i = 0; i < remainingBestSellers.length; i++) {
      await prisma.bestSellerImage.update({
        where: { id: remainingBestSellers[i].id },
        data: { order: i },
      });
    }

    return {
      success: true,
      urls: remainingBestSellers.map(bestSeller => bestSeller.url),
    };
  } catch (error) {
    console.error("Error removing best seller image:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function getBestSellers(): Promise<BestSellerActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) return { success: false, error: "Unauthorized access" };

    if (user.role === "VENDOR") {
      const userSettings = await prisma.userSettings.findUnique({
        where: { userId: user.id },
        include: {
          BestSellerImage: {
            orderBy: { order: "asc" },
          },
        },
      });

      return {
        success: true,
        urls:
          userSettings?.BestSellerImage.map(bestSeller => bestSeller.url) || [],
      };
    }

    if (user.role === "VENDORCUSTOMER") {
      const currentUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { companyName: true },
      });

      if (!currentUser) return { success: false, error: "User not found" };

      const userSettings = await prisma.userSettings.findFirst({
        where: {
          user: {
            role: "VENDOR",
            storeName: currentUser.companyName,
          },
        },
        include: {
          BestSellerImage: {
            orderBy: { order: "asc" },
          },
        },
      });

      return {
        success: true,
        urls:
          userSettings?.BestSellerImage.map(bestSeller => bestSeller.url) || [],
      };
    }

    return { success: true, urls: [] };
  } catch (error) {
    console.error("Error getting best seller images:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function getVendorBestSellersBySlug(
  storeSlug: string
): Promise<BestSellerActionResult> {
  try {
    const userSettings = await prisma.userSettings.findFirst({
      where: {
        user: {
          storeSlug: storeSlug,
          role: "VENDOR",
        },
      },
      include: {
        BestSellerImage: {
          orderBy: { order: "asc" },
        },
      },
    });

    return {
      success: true,
      urls:
        userSettings?.BestSellerImage.map(bestSeller => bestSeller.url) || [],
    };
  } catch (error) {
    console.error("Error getting vendor best seller images:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
