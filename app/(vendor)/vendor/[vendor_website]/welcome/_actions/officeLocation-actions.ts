"use server";

import prisma from "@/lib/prisma";
import { validateRequest } from "@/auth";

export interface OpeningHoursInfo {
  id: string;
  mondayToThursday: string;
  friday: string;
  saturdaySunday: string;
  publicHolidays: string;
  officeLocationId: string;
  officeLocation: {
    id: string;
    city: string;
  };
}

export interface OpeningHoursFormData {
  city: string;
  mondayToThursday: string;
  friday: string;
  saturdaySunday?: string;
  publicHolidays?: string;
}

export interface OpeningHoursActionResult {
  success: boolean;
  data?: OpeningHoursInfo[];
  error?: string;
}

export async function getOpeningHours(
  vendorWebsite: string
): Promise<OpeningHoursActionResult> {
  try {
    const hours = await prisma.openingHours.findMany({
      where: {
        officeLocation: {
          userSettings: {
            user: {
              storeSlug: vendorWebsite,
            },
          },
        },
      },
      include: {
        officeLocation: {
          select: {
            id: true,
            city: true,
          },
        },
      },
      orderBy: {
        officeLocation: {
          city: "asc",
        },
      },
    });

    return {
      success: true,
      data: hours,
    };
  } catch (error) {
    console.error("Error getting opening hours:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function createOpeningHours(
  vendorWebsite: string,
  data: OpeningHoursFormData
): Promise<OpeningHoursActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) throw new Error("Unauthorized access");
    if (user.role !== "VENDOR")
      throw new Error("Only vendors can manage opening hours");

    // First find the vendor and their settings
    const vendor = await prisma.user.findFirst({
      where: {
        AND: [{ storeSlug: vendorWebsite }, { role: "VENDOR" }],
      },
      include: {
        UserSettings: true,
      },
    });

    if (!vendor || !vendor.UserSettings) {
      throw new Error("Vendor settings not found");
    }

    // Create hours office location
    const hoursOfficeLocation = await prisma.hoursOfficeLocation.create({
      data: {
        city: data.city,
        userSettings: {
          connect: {
            id: vendor.UserSettings.id,
          },
        },
      },
    });

    // Create opening hours
    const hours = await prisma.openingHours.create({
      data: {
        mondayToThursday: data.mondayToThursday,
        friday: data.friday,
        saturdaySunday: data.saturdaySunday || "Closed",
        publicHolidays: data.publicHolidays || "Closed",
        officeLocationId: hoursOfficeLocation.id,
      },
      include: {
        officeLocation: {
          select: {
            id: true,
            city: true,
          },
        },
      },
    });

    // Get all hours for this vendor
    const allHours = await prisma.openingHours.findMany({
      where: {
        officeLocation: {
          userSettings: {
            id: vendor.UserSettings.id,
          },
        },
      },
      include: {
        officeLocation: {
          select: {
            id: true,
            city: true,
          },
        },
      },
      orderBy: {
        officeLocation: {
          city: "asc",
        },
      },
    });

    return {
      success: true,
      data: allHours,
    };
  } catch (error) {
    console.error("Error creating opening hours:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function updateOpeningHours(
  id: string,
  data: OpeningHoursFormData
): Promise<OpeningHoursActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) throw new Error("Unauthorized access");
    if (user.role !== "VENDOR")
      throw new Error("Only vendors can manage opening hours");

    const currentHours = await prisma.openingHours.findUnique({
      where: { id },
      include: {
        officeLocation: {
          include: {
            userSettings: {
              select: { userId: true },
            },
          },
        },
      },
    });

    if (
      !currentHours ||
      currentHours.officeLocation.userSettings.userId !== user.id
    ) {
      throw new Error("Opening hours not found or unauthorized");
    }

    // Update hours office location
    await prisma.hoursOfficeLocation.update({
      where: { id: currentHours.officeLocationId },
      data: { city: data.city },
    });

    // Update opening hours
    await prisma.openingHours.update({
      where: { id },
      data: {
        mondayToThursday: data.mondayToThursday,
        friday: data.friday,
        saturdaySunday: data.saturdaySunday || currentHours.saturdaySunday,
        publicHolidays: data.publicHolidays || currentHours.publicHolidays,
      },
    });

    // Get updated list
    const allHours = await prisma.openingHours.findMany({
      where: {
        officeLocation: {
          userSettings: {
            userId: user.id,
          },
        },
      },
      include: {
        officeLocation: {
          select: {
            id: true,
            city: true,
          },
        },
      },
      orderBy: {
        officeLocation: {
          city: "asc",
        },
      },
    });

    return {
      success: true,
      data: allHours,
    };
  } catch (error) {
    console.error("Error updating opening hours:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function deleteOpeningHours(
  id: string
): Promise<OpeningHoursActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) throw new Error("Unauthorized access");
    if (user.role !== "VENDOR")
      throw new Error("Only vendors can manage opening hours");

    const currentHours = await prisma.openingHours.findUnique({
      where: { id },
      include: {
        officeLocation: {
          include: {
            userSettings: {
              select: { userId: true },
            },
          },
        },
      },
    });

    if (
      !currentHours ||
      currentHours.officeLocation.userSettings.userId !== user.id
    ) {
      throw new Error("Opening hours not found or unauthorized");
    }

    // Delete opening hours first (due to foreign key constraints)
    await prisma.openingHours.delete({
      where: { id },
    });

    // Delete the associated hours office location
    await prisma.hoursOfficeLocation.delete({
      where: { id: currentHours.officeLocationId },
    });

    // Get remaining hours
    const remainingHours = await prisma.openingHours.findMany({
      where: {
        officeLocation: {
          userSettings: {
            userId: user.id,
          },
        },
      },
      include: {
        officeLocation: {
          select: {
            id: true,
            city: true,
          },
        },
      },
      orderBy: {
        officeLocation: {
          city: "asc",
        },
      },
    });

    return {
      success: true,
      data: remainingHours,
    };
  } catch (error) {
    console.error("Error deleting opening hours:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
