"use server";

import { put, del } from "@vercel/blob";
import prisma from "@/lib/prisma";
import { validateRequest } from "@/auth";

export async function uploadLogo(formData: FormData) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      throw new Error("Unauthorized access");
    }

    // Check if user is a VENDOR
    if (user.role !== "VENDOR") {
      throw new Error("Only vendors can manage logos");
    }

    const file = formData.get("logo") as File;
    if (!file || !file.size) {
      throw new Error("No file provided");
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      throw new Error("File must be an image");
    }

    // Validate file size (e.g., 5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("File size must be less than 5MB");
    }

    const fileExt = file.name.split(".").pop() || "png";
    const timestamp = Date.now();
    const path = `logos/logo_${user.id}_${timestamp}.${fileExt}`;

    // Upload to blob storage
    const blob = await put(path, file, {
      access: "public",
      addRandomSuffix: false,
    });

    if (!blob.url) {
      throw new Error("Failed to get URL from blob storage");
    }

    // Get the old logo URL before updating
    const oldSettings = await prisma.userSettings.findUnique({
      where: { userId: user.id },
      select: { logoUrl: true },
    });

    // Update or create user settings with new logo URL
    await prisma.userSettings.upsert({
      where: { userId: user.id },
      update: { logoUrl: blob.url },
      create: {
        userId: user.id,
        logoUrl: blob.url,
      },
    });

    // If there was an old logo, delete it from blob storage
    if (oldSettings?.logoUrl) {
      try {
        // Extract the path from the old URL
        const oldPath = new URL(oldSettings.logoUrl).pathname.slice(1);
        await del(oldPath);
      } catch (error) {
        console.error("Error deleting old logo:", error);
        // Don't throw error here as the upload was successful
      }
    }

    return { success: true, url: blob.url };
  } catch (error) {
    console.error("Error uploading logo:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function removeLogo() {
  try {
    const { user } = await validateRequest();
    if (!user) {
      throw new Error("Unauthorized access");
    }

    // Check if user is a VENDOR
    if (user.role !== "VENDOR") {
      throw new Error("Only vendors can manage logos");
    }

    // Get the current logo URL
    const settings = await prisma.userSettings.findUnique({
      where: { userId: user.id },
      select: { logoUrl: true },
    });

    if (settings?.logoUrl) {
      // Extract the path from the URL
      const path = new URL(settings.logoUrl).pathname.slice(1);

      // Delete from blob storage
      await del(path);

      // Update database to remove logo URL
      await prisma.userSettings.update({
        where: { userId: user.id },
        data: { logoUrl: null },
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Error removing logo:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function getLogo() {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return { success: false, error: "Unauthorized access" };
    }

    // For getLogo, we want to allow both VENDOR and VENDORCUSTOMER to fetch the logo
    const settings = await prisma.userSettings.findUnique({
      where: { userId: user.id },
      select: { logoUrl: true },
    });

    return {
      success: true,
      url: settings?.logoUrl,
    };
  } catch (error) {
    console.error("Error getting logo:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

// Helper type for the return values
export interface LogoActionResult {
  success: boolean;
  url?: string;
  error?: string;
}
