"use server";

import { put, del } from "@vercel/blob";
import prisma from "@/lib/prisma";
import { validateRequest } from "@/auth";

interface CategoryActionResult {
  success: boolean;
  categories?: Array<{ url: string; categoryName: string }>;
  url?: string;
  error?: string;
}

export async function uploadCategory(
  formData: FormData
): Promise<CategoryActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) throw new Error("Unauthorized access");
    if (user.role !== "VENDOR")
      throw new Error("Only vendors can manage categories");

    const file = formData.get("category") as File;
    const categoryName = formData.get("categoryName") as string;

    if (!file || !file.size) throw new Error("No file provided");
    if (!categoryName) throw new Error("Category name is required");
    if (!file.type.startsWith("image/"))
      throw new Error("File must be an image");
    if (file.size > 5 * 1024 * 1024)
      throw new Error("File size must be less than 5MB");

    const categoryCount = await prisma.categoryImage.count({
      where: {
        userSettings: {
          userId: user.id,
        },
      },
    });

    if (categoryCount >= 8) {
      throw new Error("Maximum of 8 category images allowed");
    }

    const fileExt = file.name.split(".").pop() || "png";
    const timestamp = Date.now();
    const path = `categories/category_${user.id}_${timestamp}.${fileExt}`;

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

    await prisma.categoryImage.create({
      data: {
        url: blob.url,
        categoryName,
        userSettingsId: userSettings.id,
        order: categoryCount,
      },
    });

    const allCategories = await prisma.categoryImage.findMany({
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
      categories: allCategories.map(item => ({
        url: item.url,
        categoryName: item.categoryName,
      })),
    };
  } catch (error) {
    console.error("Error uploading category:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function removeCategory(
  url: string
): Promise<CategoryActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) throw new Error("Unauthorized access");
    if (user.role !== "VENDOR")
      throw new Error("Only vendors can manage categories");

    const category = await prisma.categoryImage.findFirst({
      where: {
        url: url,
        userSettings: {
          userId: user.id,
        },
      },
    });

    if (!category) {
      throw new Error("Category image not found");
    }

    const path = new URL(url).pathname.slice(1);
    await del(path);

    await prisma.categoryImage.delete({
      where: { id: category.id },
    });

    const remainingCategories = await prisma.categoryImage.findMany({
      where: {
        userSettings: {
          userId: user.id,
        },
      },
      orderBy: { order: "asc" },
    });

    for (let i = 0; i < remainingCategories.length; i++) {
      await prisma.categoryImage.update({
        where: { id: remainingCategories[i].id },
        data: { order: i },
      });
    }

    return {
      success: true,
      categories: remainingCategories.map(item => ({
        url: item.url,
        categoryName: item.categoryName,
      })),
    };
  } catch (error) {
    console.error("Error removing category:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function getCategories(): Promise<CategoryActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) return { success: false, error: "Unauthorized access" };

    if (user.role === "VENDOR") {
      const userSettings = await prisma.userSettings.findUnique({
        where: { userId: user.id },
        include: {
          CategoryImage: {
            orderBy: { order: "asc" },
          },
        },
      });

      return {
        success: true,
        categories:
          userSettings?.CategoryImage.map(item => ({
            url: item.url,
            categoryName: item.categoryName,
          })) || [],
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
          CategoryImage: {
            orderBy: { order: "asc" },
          },
        },
      });

      return {
        success: true,
        categories:
          userSettings?.CategoryImage.map(item => ({
            url: item.url,
            categoryName: item.categoryName,
          })) || [],
      };
    }

    return { success: true, categories: [] };
  } catch (error) {
    console.error("Error getting categories:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function getVendorCategoriesBySlug(
  storeSlug: string
): Promise<CategoryActionResult> {
  try {
    const userSettings = await prisma.userSettings.findFirst({
      where: {
        user: {
          storeSlug: storeSlug,
          role: "VENDOR",
        },
      },
      include: {
        CategoryImage: {
          orderBy: { order: "asc" },
        },
      },
    });

    return {
      success: true,
      categories:
        userSettings?.CategoryImage.map(item => ({
          url: item.url,
          categoryName: item.categoryName,
        })) || [],
    };
  } catch (error) {
    console.error("Error getting vendor categories:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
