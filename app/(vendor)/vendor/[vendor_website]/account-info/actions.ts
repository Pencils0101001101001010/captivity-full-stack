"use server";

import { put, del } from "@vercel/blob";
import prisma from "@/lib/prisma";
import { validateRequest } from "@/auth";
import { cache } from "react";

interface ProfileImageActionResult {
  success: boolean;
  avatarUrl: string | null;
  backgroundUrl: string | null;
  error?: string;
}

// Cache the fetch function for profile images
const getCachedUserProfile = cache(async (userId: string) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      avatarUrl: true,
      backgroundUrl: true,
      role: true,
    },
  });
});

export async function uploadProfileImage(
  formData: FormData,
  imageType: "avatar" | "background"
): Promise<ProfileImageActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) throw new Error("Unauthorized access");
    if (!["VENDOR", "VENDORCUSTOMER"].includes(user.role)) {
      throw new Error("Unauthorized role");
    }

    const file = formData.get(imageType) as File;
    if (!file || !file.size) throw new Error("No file provided");
    if (!file.type.startsWith("image/")) {
      throw new Error("File must be an image");
    }

    // Set different size limits for avatar and background
    const maxSize = imageType === "avatar" ? 2 : 5; // 2MB for avatar, 5MB for background
    if (file.size > maxSize * 1024 * 1024) {
      throw new Error(`File size must be less than ${maxSize}MB`);
    }

    // Delete existing image if present
    const currentProfile = await getCachedUserProfile(user.id);
    const currentUrl =
      imageType === "avatar"
        ? currentProfile?.avatarUrl
        : currentProfile?.backgroundUrl;

    if (currentUrl) {
      const oldPath = new URL(currentUrl).pathname.slice(1);
      await del(oldPath);
    }

    // Upload new image
    const fileExt = file.name.split(".").pop() || "png";
    const timestamp = Date.now();
    const path = `profile/${imageType}s/${user.id}_${timestamp}.${fileExt}`;

    const blob = await put(path, file, {
      access: "public",
      addRandomSuffix: false,
    });

    if (!blob.url) throw new Error("Failed to get URL from blob storage");

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        [imageType === "avatar" ? "avatarUrl" : "backgroundUrl"]: blob.url,
      },
      select: {
        avatarUrl: true,
        backgroundUrl: true,
      },
    });

    return {
      success: true,
      avatarUrl: updatedUser.avatarUrl,
      backgroundUrl: updatedUser.backgroundUrl,
    };
  } catch (error) {
    console.error(`Error uploading ${imageType}:`, error);
    return {
      success: false,
      avatarUrl: null,
      backgroundUrl: null,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function removeProfileImage(
  imageType: "avatar" | "background"
): Promise<ProfileImageActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) throw new Error("Unauthorized access");
    if (!["VENDOR", "VENDORCUSTOMER"].includes(user.role)) {
      throw new Error("Unauthorized role");
    }

    const currentProfile = await getCachedUserProfile(user.id);
    const currentUrl =
      imageType === "avatar"
        ? currentProfile?.avatarUrl
        : currentProfile?.backgroundUrl;

    if (!currentUrl) {
      throw new Error(`No ${imageType} image found`);
    }

    // Delete from blob storage
    const path = new URL(currentUrl).pathname.slice(1);
    await del(path);

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        [imageType === "avatar" ? "avatarUrl" : "backgroundUrl"]: null,
      },
      select: {
        avatarUrl: true,
        backgroundUrl: true,
      },
    });

    return {
      success: true,
      avatarUrl: updatedUser.avatarUrl,
      backgroundUrl: updatedUser.backgroundUrl,
    };
  } catch (error) {
    console.error(`Error removing ${imageType}:`, error);
    return {
      success: false,
      avatarUrl: null,
      backgroundUrl: null,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export const getProfileImages = cache(
  async (userId?: string): Promise<ProfileImageActionResult> => {
    try {
      const { user } = await validateRequest();
      if (!user) {
        return {
          success: false,
          avatarUrl: null,
          backgroundUrl: null,
          error: "Unauthorized access",
        };
      }

      // If userId is provided, get that user's profile (for viewing other profiles)
      const targetUserId = userId || user.id;

      const profile = await prisma.user.findUnique({
        where: { id: targetUserId },
        select: {
          avatarUrl: true,
          backgroundUrl: true,
          role: true,
        },
      });

      if (!profile) {
        return {
          success: false,
          avatarUrl: null,
          backgroundUrl: null,
          error: "Profile not found",
        };
      }

      // Only allow viewing profiles of vendors and vendor customers
      if (!["VENDOR", "VENDORCUSTOMER"].includes(profile.role)) {
        return {
          success: false,
          avatarUrl: null,
          backgroundUrl: null,
          error: "Unauthorized access",
        };
      }

      return {
        success: true,
        avatarUrl: profile.avatarUrl,
        backgroundUrl: profile.backgroundUrl,
      };
    } catch (error) {
      console.error("Error getting profile images:", error);
      return {
        success: false,
        avatarUrl: null,
        backgroundUrl: null,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      };
    }
  }
);
