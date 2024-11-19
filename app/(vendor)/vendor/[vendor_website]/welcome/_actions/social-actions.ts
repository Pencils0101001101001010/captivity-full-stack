"use server";

import prisma from "@/lib/prisma";
import { validateRequest } from "@/auth";
import { cache } from "react";

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  userSettingsId: string;
}

interface SocialLinkFormData {
  platform: string;
  url: string;
}

interface SocialLinkActionResult {
  success: boolean;
  data?: SocialLink[];
  error?: string;
}

const getCachedSocialLinks = cache(async (userId: string) => {
  const settings = await prisma.userSettings.findUnique({
    where: { userId },
    include: {
      SocialMediaLink: {
        orderBy: { platform: "asc" },
      },
    },
  });
  return settings;
});

const getVendorSettings = cache(async (websiteAddress: string) => {
  const settings = await prisma.userSettings.findFirst({
    where: {
      user: {
        OR: [{ website: websiteAddress }, { storeSlug: websiteAddress }],
        role: "VENDOR",
      },
    },
    include: {
      SocialMediaLink: {
        orderBy: { platform: "asc" },
      },
    },
  });
  return settings;
});

export async function getSocialLinks(): Promise<SocialLinkActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) return { success: false, error: "Unauthorized access" };

    const userSettings = await getCachedSocialLinks(user.id);
    return {
      success: true,
      data: userSettings?.SocialMediaLink || [],
    };
  } catch (error) {
    console.error("Error getting social links:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function getVendorSocialLinks(
  websiteAddress: string
): Promise<SocialLinkActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) return { success: false, error: "Unauthorized access" };

    const vendorSettings = await getVendorSettings(websiteAddress);
    if (!vendorSettings) {
      return { success: false, error: "Vendor not found" };
    }

    return {
      success: true,
      data: vendorSettings.SocialMediaLink || [],
    };
  } catch (error) {
    console.error("Error getting vendor social links:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function createSocialLink(
  data: SocialLinkFormData
): Promise<SocialLinkActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) throw new Error("Unauthorized access");

    const userSettings = await getCachedSocialLinks(user.id);
    if (!userSettings) {
      await prisma.userSettings.create({
        data: {
          userId: user.id,
          SocialMediaLink: { create: data },
        },
      });
    } else {
      await prisma.socialMediaLink.create({
        data: {
          ...data,
          userSettingsId: userSettings.id,
        },
      });
    }

    const updatedSettings = await getCachedSocialLinks(user.id);
    return {
      success: true,
      data: updatedSettings?.SocialMediaLink || [],
    };
  } catch (error) {
    console.error("Error creating social link:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function updateSocialLink(
  id: string,
  data: SocialLinkFormData
): Promise<SocialLinkActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) throw new Error("Unauthorized access");

    const userSettings = await getCachedSocialLinks(user.id);
    if (!userSettings) throw new Error("User settings not found");

    await prisma.socialMediaLink.update({
      where: { id, userSettingsId: userSettings.id },
      data,
    });

    const updatedSettings = await getCachedSocialLinks(user.id);
    return {
      success: true,
      data: updatedSettings?.SocialMediaLink || [],
    };
  } catch (error) {
    console.error("Error updating social link:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function deleteSocialLink(
  id: string
): Promise<SocialLinkActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) throw new Error("Unauthorized access");

    const userSettings = await getCachedSocialLinks(user.id);
    if (!userSettings) throw new Error("User settings not found");

    await prisma.socialMediaLink.delete({
      where: { id, userSettingsId: userSettings.id },
    });

    const updatedSettings = await getCachedSocialLinks(user.id);
    return {
      success: true,
      data: updatedSettings?.SocialMediaLink || [],
    };
  } catch (error) {
    console.error("Error deleting social link:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
