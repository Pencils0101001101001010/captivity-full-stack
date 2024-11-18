"use server";

import prisma from "@/lib/prisma";
import { validateRequest } from "@/auth";
import { cache } from "react";

interface OpeningHoursInfo {
  id: string;
  mondayToThursday: string;
  friday: string;
  saturdaySunday: string;
  publicHolidays: string;
  officeLocationId: string;
}

interface OpeningHoursFormData {
  mondayToThursday: string;
  friday: string;
  saturdaySunday?: string;
  publicHolidays?: string;
}

interface OpeningHoursActionResult {
  success: boolean;
  data?: OpeningHoursInfo[];
  error?: string;
}

const getCachedOpeningHours = cache(
  async (officeLocationId: string): Promise<OpeningHoursInfo | null> => {
    const hours = await prisma.openingHours.findUnique({
      where: { officeLocationId },
    });
    return hours;
  }
);

export async function getOpeningHours(
  officeLocationId: string
): Promise<OpeningHoursActionResult> {
  try {
    const hours = await getCachedOpeningHours(officeLocationId);
    return {
      success: true,
      data: hours ? [hours] : [],
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
  officeLocationId: string,
  data: OpeningHoursFormData
): Promise<OpeningHoursActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) throw new Error("Unauthorized access");
    if (user.role !== "VENDOR")
      throw new Error("Only vendors can manage opening hours");

    // Check if the office location belongs to the vendor
    const userSettings = await prisma.userSettings.findUnique({
      where: { userId: user.id },
      include: {
        OfficeLocation: {
          where: { id: officeLocationId },
        },
      },
    });

    if (!userSettings?.OfficeLocation.length) {
      throw new Error("Office location not found");
    }

    // Create opening hours with default values for optional fields
    const hours = await prisma.openingHours.create({
      data: {
        ...data,
        saturdaySunday: data.saturdaySunday || "Closed",
        publicHolidays: data.publicHolidays || "Closed",
        officeLocationId,
      },
    });

    return {
      success: true,
      data: [hours],
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

    // Verify ownership
    const openingHours = await prisma.openingHours.findUnique({
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
      !openingHours ||
      openingHours.officeLocation.userSettings.userId !== user.id
    ) {
      throw new Error("Opening hours not found or unauthorized");
    }

    const updated = await prisma.openingHours.update({
      where: { id },
      data: {
        ...data,
        saturdaySunday: data.saturdaySunday || openingHours.saturdaySunday,
        publicHolidays: data.publicHolidays || openingHours.publicHolidays,
      },
    });

    return {
      success: true,
      data: [updated],
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

    // Verify ownership
    const openingHours = await prisma.openingHours.findUnique({
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
      !openingHours ||
      openingHours.officeLocation.userSettings.userId !== user.id
    ) {
      throw new Error("Opening hours not found or unauthorized");
    }

    await prisma.openingHours.delete({
      where: { id },
    });

    return {
      success: true,
      data: [],
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

export const getVendorOpeningHoursBySlug = cache(
  async (officeLocationId: string): Promise<OpeningHoursActionResult> => {
    try {
      const hours = await getCachedOpeningHours(officeLocationId);
      return {
        success: true,
        data: hours ? [hours] : [],
      };
    } catch (error) {
      console.error("Error getting vendor opening hours:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      };
    }
  }
);
