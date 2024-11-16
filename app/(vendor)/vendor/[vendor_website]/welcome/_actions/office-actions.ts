"use server";

import prisma from "@/lib/prisma";
import { validateRequest } from "@/auth";
import { revalidatePath } from "next/cache";
import { cache } from "react";
import { Prisma } from "@prisma/client";
import { put } from "@vercel/blob";

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
  logo?: File;
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
  general: string;
  websiteQueries: string;
  logoUrl?: string;
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

function transformOfficeData(office: any): Office {
  return {
    id: office.id,
    city: office.city,
    telephone: office.telephone,
    general: office.general || "",
    websiteQueries: office.websiteQueries || "",
    logoUrl: office.logoUrl,
    openingHours: office.openingHours,
  };
}

async function uploadLogoToBlob(file: File, userId: string): Promise<string> {
  try {
    const blob = await put(`office-logos/${userId}/${file.name}`, file, {
      access: "public",
      addRandomSuffix: true,
    });
    return blob.url;
  } catch (error) {
    console.error("Error uploading to blob:", error);
    throw new Error("Failed to upload logo");
  }
}

export async function addOfficeLocation(
  formData: FormData
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

    const city = formData.get("city") as string;
    const telephone = formData.get("telephone") as string;
    const general = formData.get("general") as string;
    const websiteQueries = formData.get("websiteQueries") as string;
    const logo = formData.get("logo") as File;

    let logoUrl = "";
    if (logo && logo.size > 0) {
      logoUrl = await uploadLogoToBlob(logo, user.id);
    }

    const openingHours = {
      mondayToThursday: formData.get("mondayToThursday") as string,
      friday: formData.get("friday") as string,
      saturdaySunday: (formData.get("saturdaySunday") as string) || "Closed",
      publicHolidays: (formData.get("publicHolidays") as string) || "Closed",
    };

    const newOffice = await prisma.officeLocation.create({
      data: {
        city,
        telephone,
        general,
        websiteQueries,
        logoUrl,
        userSettings: {
          connect: { id: userSettings.id },
        },
        openingHours: {
          create: openingHours,
        },
      },
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
  formData: FormData
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

    const city = formData.get("city") as string;
    const telephone = formData.get("telephone") as string;
    const general = formData.get("general") as string;
    const websiteQueries = formData.get("websiteQueries") as string;
    const logo = formData.get("logo") as File;

    let logoUrl = office.logoUrl;
    if (logo && logo.size > 0) {
      logoUrl = await uploadLogoToBlob(logo, user.id);
    }

    const openingHours = {
      mondayToThursday: formData.get("mondayToThursday") as string,
      friday: formData.get("friday") as string,
      saturdaySunday: (formData.get("saturdaySunday") as string) || "Closed",
      publicHolidays: (formData.get("publicHolidays") as string) || "Closed",
    };

    const updatedOffice = await prisma.officeLocation.update({
      where: { id: officeId },
      data: {
        city,
        telephone,
        general,
        websiteQueries,
        logoUrl,
        openingHours: {
          update: openingHours,
        },
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
