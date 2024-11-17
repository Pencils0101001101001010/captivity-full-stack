"use server";

import prisma from "@/lib/prisma";
import { validateRequest } from "@/auth";
import { revalidatePath } from "next/cache";

interface ContactInfo {
  city: string;
  telephone: string;
  general: string;
  websiteQueries: string;
}

interface ContactActionResult {
  success: boolean;
  data?: any;
  error?: string;
}

// Helper function to revalidate paths
const revalidateVendorPaths = (storeSlug: string | null | undefined) => {
  // Only revalidate specific vendor page if storeSlug exists and is not null
  if (storeSlug) {
    revalidatePath(`/vendor/${storeSlug}/welcome`, "page");
  }
  // Always revalidate the layout
  revalidatePath("/vendor/[vendor_website]/welcome", "layout");
};

// Rest of the code remains the same, just using the updated revalidateVendorPaths function
export async function createContactInfo(
  data: ContactInfo
): Promise<ContactActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) throw new Error("Unauthorized");
    if (user.role !== "VENDOR")
      throw new Error("Only vendors can create contact info");

    const userSettings = await prisma.userSettings.findUnique({
      where: { userId: user.id },
      include: {
        user: {
          select: {
            storeSlug: true,
          },
        },
      },
    });

    if (!userSettings) throw new Error("User settings not found");

    const newLocation = await prisma.officeLocation.create({
      data: {
        city: data.city,
        telephone: data.telephone,
        general: data.general,
        websiteQueries: data.websiteQueries,
        userSettings: {
          connect: { id: userSettings.id },
        },
      },
    });

    revalidateVendorPaths(userSettings.user?.storeSlug);

    return {
      success: true,
      data: [newLocation],
    };
  } catch (error) {
    console.error("Error creating contact info:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to create contact info",
    };
  }
}

export async function updateContactInfo(
  id: string,
  data: ContactInfo
): Promise<ContactActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) throw new Error("Unauthorized");
    if (user.role !== "VENDOR")
      throw new Error("Only vendors can update contact info");

    const userSettings = await prisma.userSettings.findUnique({
      where: { userId: user.id },
      include: {
        user: {
          select: {
            storeSlug: true,
          },
        },
      },
    });

    if (!userSettings) throw new Error("User settings not found");

    const updatedLocation = await prisma.officeLocation.update({
      where: {
        id: id,
        userSettingsId: userSettings.id,
      },
      data: {
        city: data.city,
        telephone: data.telephone,
        general: data.general,
        websiteQueries: data.websiteQueries,
      },
    });

    revalidateVendorPaths(userSettings.user?.storeSlug);

    return {
      success: true,
      data: [updatedLocation],
    };
  } catch (error) {
    console.error("Error updating contact info:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update contact info",
    };
  }
}

export async function deleteContactInfo(
  id: string
): Promise<ContactActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) throw new Error("Unauthorized");
    if (user.role !== "VENDOR")
      throw new Error("Only vendors can delete contact info");

    const userSettings = await prisma.userSettings.findUnique({
      where: { userId: user.id },
      include: {
        user: {
          select: {
            storeSlug: true,
          },
        },
      },
    });

    if (!userSettings) throw new Error("User settings not found");

    await prisma.officeLocation.delete({
      where: {
        id: id,
        userSettingsId: userSettings.id,
      },
    });

    revalidateVendorPaths(userSettings.user?.storeSlug);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error deleting contact info:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to delete contact info",
    };
  }
}

export async function getContactInfo(): Promise<ContactActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) throw new Error("Unauthorized");

    const userSettings = await prisma.userSettings.findUnique({
      where: { userId: user.id },
      include: {
        OfficeLocation: true,
        user: {
          select: {
            storeSlug: true,
          },
        },
      },
    });

    if (!userSettings) throw new Error("User settings not found");

    return {
      success: true,
      data: userSettings.OfficeLocation,
    };
  } catch (error) {
    console.error("Error getting contact info:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to get contact info",
    };
  }
}
