"use server";

import prisma from "@/lib/prisma";
import { validateRequest } from "@/auth";
import { revalidatePath } from "next/cache";
import { cache } from "react";
import { Prisma } from "@prisma/client";

// Types
interface OfficeHours {
  mondayToThursday: string;
  friday: string;
  saturdaySunday: string;
  publicHolidays: string;
}

interface OfficeData {
  city: string;
  telephone: string;
  general?: string;
  websiteQueries?: string;
  openingHours: {
    mondayToThursday: string;
    friday: string;
    saturdaySunday?: string;
    publicHolidays?: string;
  };
}

interface Office {
  id: string;
  city: string;
  telephone: string;
  openingHours: OfficeHours | null;
}

interface ContactInfo {
  generalEmail: string;
  websiteEmail: string;
  socialMedia: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
  };
}

interface OfficeActionResult {
  success: boolean;
  data?: {
    offices: Office[];
    contactInfo?: ContactInfo;
  };
  error?: string;
}

// Cached queries
const getCachedUserSettings = cache(async (userId: string) => {
  return prisma.userSettings.findUnique({
    where: { userId },
    include: {
      OfficeLocation: {
        include: {
          openingHours: true,
        },
      },
    },
  });
});

// Utility functions
function transformOfficeData(office: any): Office {
  return {
    id: office.id,
    city: office.city,
    telephone: office.telephone,
    openingHours: office.openingHours,
  };
}

const createOfficeData = (
  data: OfficeData,
  userSettingsId: string
): Prisma.OfficeLocationCreateInput => ({
  city: data.city,
  telephone: data.telephone,
  general: data.general || "",
  websiteQueries: data.websiteQueries || "",
  userSettings: {
    connect: { id: userSettingsId },
  },
  openingHours: {
    create: {
      mondayToThursday: data.openingHours.mondayToThursday,
      friday: data.openingHours.friday,
      saturdaySunday: data.openingHours.saturdaySunday || "Closed",
      publicHolidays: data.openingHours.publicHolidays || "Closed",
    },
  },
});

// Actions
export async function addOfficeLocation(
  officeData: OfficeData
): Promise<OfficeActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) throw new Error("Unauthorized access");
    if (user.role !== "VENDOR")
      throw new Error("Only vendors can manage office locations");

    const userSettings = await getCachedUserSettings(user.id);
    if (!userSettings) throw new Error("User settings not found");

    if (userSettings.OfficeLocation.length >= 2) {
      throw new Error("Maximum of 2 office locations allowed");
    }

    const existingOffice = userSettings.OfficeLocation.find(
      office => office.city.toLowerCase() === officeData.city.toLowerCase()
    );

    if (existingOffice) {
      throw new Error(`Office location in ${officeData.city} already exists`);
    }

    const newOffice = await prisma.officeLocation.create({
      data: createOfficeData(officeData, userSettings.id),
      include: {
        openingHours: true,
      },
    });

    const updatedOffices = await prisma.officeLocation.findMany({
      where: { userSettingsId: userSettings.id },
      include: { openingHours: true },
    });

    revalidatePath("/vendor/[vendor_website]/contact");

    return {
      success: true,
      data: {
        offices: updatedOffices.map(transformOfficeData),
      },
    };
  } catch (error) {
    console.error("Error adding office location:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function updateOfficeLocation(
  officeId: string,
  officeData: Partial<OfficeData>
): Promise<OfficeActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) throw new Error("Unauthorized access");
    if (user.role !== "VENDOR")
      throw new Error("Only vendors can manage office locations");

    const office = await prisma.officeLocation.findFirst({
      where: {
        id: officeId,
        userSettings: { userId: user.id },
      },
      include: { openingHours: true },
    });

    if (!office) throw new Error("Office location not found");

    const updatedOffice = await prisma.officeLocation.update({
      where: { id: officeId },
      data: {
        city: officeData.city,
        telephone: officeData.telephone,
        general: officeData.general,
        websiteQueries: officeData.websiteQueries,
        openingHours: officeData.openingHours
          ? {
              update: {
                mondayToThursday: officeData.openingHours.mondayToThursday,
                friday: officeData.openingHours.friday,
                saturdaySunday:
                  officeData.openingHours.saturdaySunday || "Closed",
                publicHolidays:
                  officeData.openingHours.publicHolidays || "Closed",
              },
            }
          : undefined,
      },
      include: { openingHours: true },
    });

    revalidatePath("/vendor/[vendor_website]/contact");

    return {
      success: true,
      data: {
        offices: [transformOfficeData(updatedOffice)],
      },
    };
  } catch (error) {
    console.error("Error updating office location:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function removeOfficeLocation(
  officeId: string
): Promise<OfficeActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) throw new Error("Unauthorized access");
    if (user.role !== "VENDOR")
      throw new Error("Only vendors can manage office locations");

    const office = await prisma.officeLocation.findFirst({
      where: {
        id: officeId,
        userSettings: {
          userId: user.id,
        },
      },
    });

    if (!office) throw new Error("Office location not found");

    // Delete the office and its associated openingHours
    await prisma.$transaction([
      prisma.openingHours.deleteMany({
        where: { officeLocationId: officeId },
      }),
      prisma.officeLocation.delete({
        where: { id: officeId },
      }),
    ]);

    const remainingOffices = await prisma.officeLocation.findMany({
      where: {
        userSettings: {
          userId: user.id,
        },
      },
      include: {
        openingHours: true,
      },
    });

    revalidatePath("/vendor/[vendor_website]/contact");

    return {
      success: true,
      data: {
        offices: remainingOffices.map(transformOfficeData),
      },
    };
  } catch (error) {
    console.error("Error removing office location:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function updateContactInfo(
  contactInfo: ContactInfo
): Promise<OfficeActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) throw new Error("Unauthorized access");
    if (user.role !== "VENDOR")
      throw new Error("Only vendors can manage contact information");

    const updatedSettings = await prisma.userSettings.update({
      where: { userId: user.id },
      data: {
        generalEmail: contactInfo.generalEmail,
        websiteEmail: contactInfo.websiteEmail,
        socialMedia: contactInfo.socialMedia,
      },
      include: {
        OfficeLocation: {
          include: {
            openingHours: true,
          },
        },
      },
    });

    revalidatePath("/vendor/[vendor_website]/contact");

    return {
      success: true,
      data: {
        offices: updatedSettings.OfficeLocation.map(transformOfficeData),
        contactInfo: {
          generalEmail: updatedSettings.generalEmail || "",
          websiteEmail: updatedSettings.websiteEmail || "",
          socialMedia: updatedSettings.socialMedia as {
            facebook?: string;
            instagram?: string;
            youtube?: string;
          },
        },
      },
    };
  } catch (error) {
    console.error("Error updating contact information:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export const getOfficeLocations = cache(
  async (): Promise<OfficeActionResult> => {
    try {
      const { user } = await validateRequest();
      if (!user) throw new Error("Unauthorized access");

      const userSettings = await getCachedUserSettings(user.id);

      if (!userSettings) {
        return {
          success: true,
          data: {
            offices: [],
            contactInfo: {
              generalEmail: "",
              websiteEmail: "",
              socialMedia: {},
            },
          },
        };
      }

      return {
        success: true,
        data: {
          offices: userSettings.OfficeLocation.map(transformOfficeData),
          contactInfo: {
            generalEmail: userSettings.generalEmail || "",
            websiteEmail: userSettings.websiteEmail || "",
            socialMedia: userSettings.socialMedia as {
              facebook?: string;
              instagram?: string;
              youtube?: string;
            },
          },
        },
      };
    } catch (error) {
      console.error("Error fetching office locations:", error);
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
