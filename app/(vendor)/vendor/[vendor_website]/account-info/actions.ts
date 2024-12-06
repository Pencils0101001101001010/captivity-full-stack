"use server";

import { put, del } from "@vercel/blob";
import prisma from "@/lib/prisma";
import { validateRequest } from "@/auth";
import { cache } from "react";
import { User as DbUser, UserRole, Prisma } from "@prisma/client";
import {
  ProfileActionResult,
  ProfileImageType,
  UserProfileData,
  profileUpdateSchema,
  ProfileUpdateData,
  userProfileSelect,
  IMAGE_CONFIG,
  ALLOWED_MIME_TYPES,
  AllowedMimeType,
  fileValidationSchema,
  VendorRoles,
} from "./profile";

interface AuthUser {
  id: string;
  role: UserRole;
}

function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substring(7)}`;
}

function isVendorUser(user: AuthUser): boolean {
  return ["VENDOR", "VENDORCUSTOMER"].includes(user.role);
}

function isAllowedMimeType(type: string): type is AllowedMimeType {
  return ALLOWED_MIME_TYPES.includes(type as AllowedMimeType);
}

const getCachedUserProfile = cache(async (userId: string) => {
  const requestId = generateRequestId();
  console.log("Fetching cached user profile:", {
    requestId,
    userId,
    timestamp: new Date().toISOString(),
  });

  const profile = await prisma.user.findUnique({
    where: { id: userId },
    select: userProfileSelect,
  });

  if (profile) {
    console.log("Profile image details:", {
      requestId,
      avatarUrl: profile.avatarUrl,
      urlStructure: profile.avatarUrl
        ? new URL(profile.avatarUrl).toString()
        : null,
      timestamp: new Date().toISOString(),
    });
  }

  console.log("Cached profile result:", {
    requestId,
    found: !!profile,
    hasAvatar: !!profile?.avatarUrl,
    hasBackground: !!profile?.backgroundUrl,
    timestamp: new Date().toISOString(),
  });

  return profile;
});

export async function getUserProfile(
  userId?: string
): Promise<ProfileActionResult> {
  const startTime = Date.now();
  const requestId = generateRequestId();

  console.log("getUserProfile initiated:", {
    requestId,
    requestedUserId: userId,
    timestamp: new Date().toISOString(),
  });

  try {
    const session = await validateRequest();
    if (!session.user) {
      console.log("getUserProfile unauthorized access attempt:", {
        requestId,
        timestamp: new Date().toISOString(),
      });
      return {
        success: false,
        avatarUrl: null,
        backgroundUrl: null,
        error: "Unauthorized access",
      };
    }

    const targetUserId = userId || session.user.id;
    console.log("Fetching profile for:", {
      requestId,
      targetUserId,
      requestingUserId: session.user.id,
      requestingUserRole: session.user.role,
      timestamp: new Date().toISOString(),
    });

    if (
      userId &&
      session.user.id !== userId &&
      !["VENDOR", "ADMIN"].includes(session.user.role)
    ) {
      console.log("Insufficient permissions:", {
        requestId,
        targetUserId,
        requestingRole: session.user.role,
        timestamp: new Date().toISOString(),
      });
      return {
        success: false,
        avatarUrl: null,
        backgroundUrl: null,
        error: "Insufficient permissions to view this profile",
      };
    }

    const profile = await getCachedUserProfile(targetUserId);

    if (!profile) {
      console.log("Profile not found:", {
        requestId,
        targetUserId,
        timestamp: new Date().toISOString(),
      });
      return {
        success: false,
        avatarUrl: null,
        backgroundUrl: null,
        error: "Profile not found",
      };
    }

    if (profile.avatarUrl || profile.backgroundUrl) {
      console.log("Profile image URLs:", {
        requestId,
        avatarUrl: profile.avatarUrl,
        avatarUrlStructure: profile.avatarUrl
          ? new URL(profile.avatarUrl).toString()
          : null,
        backgroundUrl: profile.backgroundUrl,
        backgroundUrlStructure: profile.backgroundUrl
          ? new URL(profile.backgroundUrl).toString()
          : null,
        timestamp: new Date().toISOString(),
      });
    }

    const duration = Date.now() - startTime;
    console.log("getUserProfile completed:", {
      requestId,
      success: true,
      duration: `${duration}ms`,
      hasAvatar: !!profile.avatarUrl,
      hasBackground: !!profile.backgroundUrl,
      role: profile.role,
      storeSlug: profile.storeSlug,
      timestamp: new Date().toISOString(),
    });

    return {
      success: true,
      avatarUrl: profile.avatarUrl,
      backgroundUrl: profile.backgroundUrl,
      userData: profile as UserProfileData,
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error("getUserProfile error:", {
      requestId,
      error:
        error instanceof Error
          ? {
              message: error.message,
              stack: error.stack,
            }
          : "Unknown error",
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
    });

    return {
      success: false,
      avatarUrl: null,
      backgroundUrl: null,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function updateUserProfile(
  data: ProfileUpdateData
): Promise<ProfileActionResult> {
  const startTime = Date.now();
  const requestId = generateRequestId();

  console.log("updateUserProfile initiated:", {
    requestId,
    timestamp: new Date().toISOString(),
  });

  try {
    const session = await validateRequest();
    if (!session.user) {
      console.log("updateUserProfile unauthorized access attempt:", {
        requestId,
        timestamp: new Date().toISOString(),
      });
      throw new Error("Unauthorized access");
    }

    console.log("Validating profile update data:", {
      requestId,
      userId: session.user.id,
      timestamp: new Date().toISOString(),
    });

    const validatedData = profileUpdateSchema.parse(data);

    const updatedProfile = await prisma.user.update({
      where: { id: session.user.id },
      data: validatedData,
      select: userProfileSelect,
    });

    const duration = Date.now() - startTime;
    console.log("updateUserProfile completed:", {
      requestId,
      success: true,
      duration: `${duration}ms`,
      userId: session.user.id,
      timestamp: new Date().toISOString(),
    });

    return {
      success: true,
      avatarUrl: updatedProfile.avatarUrl,
      backgroundUrl: updatedProfile.backgroundUrl,
      userData: updatedProfile as UserProfileData,
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error("updateUserProfile error:", {
      requestId,
      error:
        error instanceof Error
          ? {
              message: error.message,
              stack: error.stack,
            }
          : "Unknown error",
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
    });

    return {
      success: false,
      avatarUrl: null,
      backgroundUrl: null,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function uploadProfileImage(
  formData: FormData,
  imageType: ProfileImageType
): Promise<ProfileActionResult> {
  const startTime = Date.now();
  const requestId = generateRequestId();

  console.log("uploadProfileImage initiated:", {
    requestId,
    imageType,
    timestamp: new Date().toISOString(),
  });

  try {
    const session = await validateRequest();
    if (!session.user) {
      console.log("uploadProfileImage unauthorized access attempt:", {
        requestId,
        timestamp: new Date().toISOString(),
      });
      throw new Error("Unauthorized access");
    }

    if (!isVendorUser(session.user)) {
      console.log("uploadProfileImage unauthorized role:", {
        requestId,
        role: session.user.role,
        timestamp: new Date().toISOString(),
      });
      throw new Error("Unauthorized role");
    }

    const file = formData.get(imageType) as File;
    if (!file) {
      console.log("uploadProfileImage no file provided:", {
        requestId,
        timestamp: new Date().toISOString(),
      });
      throw new Error("No file provided");
    }

    console.log("Processing upload:", {
      requestId,
      imageType,
      fileName: file.name,
      fileSize: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
      fileType: file.type,
      timestamp: new Date().toISOString(),
    });

    if (!isAllowedMimeType(file.type)) {
      console.log("Invalid file type:", {
        requestId,
        providedType: file.type,
        timestamp: new Date().toISOString(),
      });
      throw new Error(
        "Invalid file type. Only JPEG, PNG, and WebP images are allowed"
      );
    }

    const validation = fileValidationSchema.safeParse({
      size: file.size,
      type: file.type,
    });

    if (!validation.success) {
      console.log("File validation failed:", {
        requestId,
        errors: validation.error.errors,
        timestamp: new Date().toISOString(),
      });
      throw new Error(validation.error.errors[0].message);
    }

    const maxSize = IMAGE_CONFIG.maxSizes[imageType];
    if (file.size > maxSize * 1024 * 1024) {
      console.log("File size exceeds limit:", {
        requestId,
        fileSize: file.size,
        maxSize: maxSize * 1024 * 1024,
        timestamp: new Date().toISOString(),
      });
      throw new Error(`File size must be less than ${maxSize}MB`);
    }

    const currentProfile = await getCachedUserProfile(session.user.id);
    const currentUrl =
      imageType === "avatar"
        ? currentProfile?.avatarUrl
        : currentProfile?.backgroundUrl;

    if (currentUrl) {
      console.log("Deleting existing image:", {
        requestId,
        currentUrl,
        timestamp: new Date().toISOString(),
      });
      const oldPath = new URL(currentUrl).pathname.slice(1);
      await del(oldPath);
    }

    const fileExt = file.name.split(".").pop() || "png";
    const timestamp = Date.now();
    const path = `${IMAGE_CONFIG.paths[imageType]}/${session.user.id}_${timestamp}.${fileExt}`;

    console.log("Uploading to blob storage:", {
      requestId,
      path,
      timestamp: new Date().toISOString(),
    });

    const blob = await put(path, file, {
      access: "public",
      addRandomSuffix: false,
    });

    if (!blob.url) {
      console.log("Failed to get URL from blob storage:", {
        requestId,
        timestamp: new Date().toISOString(),
      });
      throw new Error("Failed to get URL from blob storage");
    }

    console.log("Image uploaded successfully:", {
      requestId,
      blobUrl: blob.url,
      timestamp: new Date().toISOString(),
    });

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        [imageType === "avatar" ? "avatarUrl" : "backgroundUrl"]: blob.url,
      },
      select: userProfileSelect,
    });

    const duration = Date.now() - startTime;
    console.log("uploadProfileImage completed:", {
      requestId,
      success: true,
      duration: `${duration}ms`,
      imageType,
      newUrl: blob.url,
      timestamp: new Date().toISOString(),
    });

    return {
      success: true,
      avatarUrl: updatedUser.avatarUrl,
      backgroundUrl: updatedUser.backgroundUrl,
      userData: updatedUser as UserProfileData,
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error("uploadProfileImage error:", {
      requestId,
      error:
        error instanceof Error
          ? {
              message: error.message,
              stack: error.stack,
            }
          : "Unknown error",
      imageType,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
    });

    return {
      success: false,
      avatarUrl: null,
      backgroundUrl: null,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

// Image removal operation
export async function removeProfileImage(
  imageType: ProfileImageType
): Promise<ProfileActionResult> {
  const startTime = Date.now();
  console.log("removeProfileImage initiated:", {
    imageType,
    timestamp: new Date().toISOString(),
  });

  try {
    const session = await validateRequest();
    if (!session.user) throw new Error("Unauthorized access");
    if (!isVendorUser(session.user)) throw new Error("Unauthorized role");

    const currentProfile = await getCachedUserProfile(session.user.id);
    const currentUrl =
      imageType === "avatar"
        ? currentProfile?.avatarUrl
        : currentProfile?.backgroundUrl;

    if (!currentUrl) {
      throw new Error(`No ${imageType} image found`);
    }

    const path = new URL(currentUrl).pathname.slice(1);
    await del(path);

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        [imageType === "avatar" ? "avatarUrl" : "backgroundUrl"]: null,
      },
      select: userProfileSelect,
    });

    const duration = Date.now() - startTime;
    console.log("removeProfileImage completed:", {
      success: true,
      duration: `${duration}ms`,
      imageType,
      timestamp: new Date().toISOString(),
    });

    return {
      success: true,
      avatarUrl: updatedUser.avatarUrl,
      backgroundUrl: updatedUser.backgroundUrl,
      userData: updatedUser as UserProfileData,
    };
  } catch (error) {
    console.error("removeProfileImage error:", {
      error: error instanceof Error ? error.message : "Unknown error",
      imageType,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    });
    return {
      success: false,
      avatarUrl: null,
      backgroundUrl: null,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

// Vendor customer operations
export async function getVendorCustomers(): Promise<ProfileActionResult[]> {
  const startTime = Date.now();
  console.log("getVendorCustomers initiated", {
    timestamp: new Date().toISOString(),
  });

  try {
    const session = await validateRequest();
    if (!session.user) throw new Error("Unauthorized access");

    const vendorProfile = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true, storeSlug: true },
    });

    if (
      !vendorProfile ||
      vendorProfile.role !== "VENDOR" ||
      !vendorProfile.storeSlug
    ) {
      throw new Error("Unauthorized role or invalid vendor configuration");
    }

    const storePrefix = vendorProfile.storeSlug.split("-customer-")[0];
    const customers = await prisma.user.findMany({
      where: {
        role: "VENDORCUSTOMER",
        storeSlug: {
          startsWith: storePrefix,
        },
      },
      select: userProfileSelect,
    });

    const duration = Date.now() - startTime;
    console.log("getVendorCustomers completed:", {
      success: true,
      duration: `${duration}ms`,
      customerCount: customers.length,
      timestamp: new Date().toISOString(),
    });

    return customers.map(customer => ({
      success: true,
      avatarUrl: customer.avatarUrl,
      backgroundUrl: customer.backgroundUrl,
      userData: customer as UserProfileData,
    }));
  } catch (error) {
    console.error("getVendorCustomers error:", {
      error: error instanceof Error ? error.message : "Unknown error",
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    });
    return [
      {
        success: false,
        avatarUrl: null,
        backgroundUrl: null,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
    ];
  }
}
