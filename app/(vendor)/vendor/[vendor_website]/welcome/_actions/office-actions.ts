"use server";

import prisma from "@/lib/prisma";
import { validateRequest } from "@/auth";

interface OfficeHours {
  mondayToThursday: string;
  friday: string;
  saturdaySunday: string;
  publicHolidays: string;
}

interface OfficeData {
  city: string;
  telephone: string;
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

function transformOfficeData(
  office: any & {
    openingHours: {
      mondayToThursday: string;
      friday: string;
      saturdaySunday: string;
      publicHolidays: string;
    } | null;
  }
): Office {
  return {
    id: office.id,
    city: office.city,
    telephone: office.telephone,
    openingHours: office.openingHours,
  };
}

export async function addOfficeLocation(
  officeData: OfficeData
): Promise<OfficeActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) throw new Error("Unauthorized access");
    if (user.role !== "VENDOR")
      throw new Error("Only vendors can manage office locations");

    const userSettings = await prisma.userSettings.findUnique({
      where: { userId: user.id },
      include: {
        OfficeLocation: {
          include: {
            openingHours: true,
          },
        },
      },
    });

    if (!userSettings) {
      throw new Error("User settings not found");
    }

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
      data: {
        city: officeData.city,
        telephone: officeData.telephone,
        userSettings: {
          connect: { id: userSettings.id },
        },
        openingHours: {
          create: {
            mondayToThursday: officeData.openingHours.mondayToThursday,
            friday: officeData.openingHours.friday,
            saturdaySunday: officeData.openingHours.saturdaySunday || "Closed",
            publicHolidays: officeData.openingHours.publicHolidays || "Closed",
          },
        },
      },
      include: {
        openingHours: true,
      },
    });

    const updatedOffices = await prisma.officeLocation.findMany({
      where: {
        userSettingsId: userSettings.id,
      },
      include: {
        openingHours: true,
      },
    });

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
        userSettings: {
          userId: user.id,
        },
      },
      include: {
        openingHours: true,
      },
    });

    if (!office) {
      throw new Error("Office location not found");
    }

    const updatedOffice = await prisma.officeLocation.update({
      where: { id: officeId },
      data: {
        city: officeData.city,
        telephone: officeData.telephone,
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
      include: {
        openingHours: true,
      },
    });

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

    if (!office) {
      throw new Error("Office location not found");
    }

    await prisma.officeLocation.delete({
      where: { id: officeId },
    });

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

export async function getOfficeLocations(): Promise<OfficeActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) throw new Error("Unauthorized access");

    const userSettings = await prisma.userSettings.findUnique({
      where: { userId: user.id },
      include: {
        OfficeLocation: {
          include: {
            openingHours: true,
          },
        },
      },
    });

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
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
