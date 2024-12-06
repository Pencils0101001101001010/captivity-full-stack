// types/profile.ts

import { z } from "zod";
import { User, UserRole } from "@prisma/client";

// Image Types and Configuration
export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export type AllowedMimeType = (typeof ALLOWED_MIME_TYPES)[number];

// Role Types for Type Safety
export type VendorRoles = Extract<UserRole, "VENDOR" | "VENDORCUSTOMER">;

// Base User Profile Data Interface remains the same
export interface BaseUserProfile {
  username: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  phoneNumber: string;
  streetAddress: string;
  addressLine2: string | null;
  suburb: string | null;
  townCity: string;
  postcode: string;
  country: string;
  position: string | null;
  natureOfBusiness: string;
  currentSupplier: string;
  otherSupplier: string | null;
  resellingTo: string | null;
  salesRep: string;
  website: string | null;
  companyName: string;
  ckNumber: string | null;
  bio: string | null;
  role: UserRole;
  storeSlug: string | null;
}

// Extended User Profile with Image URLs
export interface UserProfileData extends BaseUserProfile {
  avatarUrl: string | null;
  backgroundUrl: string | null;
}

// Action Response Types
export interface ProfileActionResult {
  success: boolean;
  avatarUrl: string | null;
  backgroundUrl: string | null;
  userData?: UserProfileData | null;
  error?: string;
}

export type ProfileImageType = "avatar" | "background";

// Enhanced file validation schema with more specific error messages
export const fileValidationSchema = z.object({
  size: z.number().max(5 * 1024 * 1024, "File size must be less than 5MB"),
  type: z.enum(ALLOWED_MIME_TYPES, {
    errorMap: () => ({
      message: "Only JPEG, PNG, and WebP images are allowed",
    }),
  }),
});

// Profile update schema remains the same
export const profileUpdateSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  displayName: z.string().min(1, "Display name is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  streetAddress: z.string().min(1, "Street address is required"),
  addressLine2: z.string().nullable(),
  suburb: z.string().nullable(),
  townCity: z.string().min(1, "Town/City is required"),
  postcode: z.string().min(1, "Postcode is required"),
  country: z.string().min(1, "Country is required"),
  position: z.string().nullable(),
  natureOfBusiness: z.string().min(1, "Nature of business is required"),
  currentSupplier: z.string().min(1, "Current supplier is required"),
  otherSupplier: z.string().nullable(),
  resellingTo: z.string().nullable(),
  salesRep: z.string().min(1, "Sales representative is required"),
  website: z.string().url().nullable(),
  companyName: z.string().min(1, "Company name is required"),
  ckNumber: z.string().nullable(),
  bio: z.string().nullable(),
});

export type ProfileUpdateData = z.infer<typeof profileUpdateSchema>;
export type FileValidation = z.infer<typeof fileValidationSchema>;

// Prisma select remains the same
export const userProfileSelect = {
  username: true,
  firstName: true,
  lastName: true,
  displayName: true,
  email: true,
  phoneNumber: true,
  streetAddress: true,
  addressLine2: true,
  suburb: true,
  townCity: true,
  postcode: true,
  country: true,
  position: true,
  natureOfBusiness: true,
  currentSupplier: true,
  otherSupplier: true,
  resellingTo: true,
  salesRep: true,
  website: true,
  companyName: true,
  ckNumber: true,
  avatarUrl: true,
  backgroundUrl: true,
  bio: true,
  role: true,
  storeSlug: true,
} as const;

// Updated image configuration with environment-aware paths
export const IMAGE_CONFIG = {
  maxSizes: {
    avatar: 2, // 2MB
    background: 5, // 5MB
  },
  allowedTypes: ALLOWED_MIME_TYPES,
  paths: {
    avatar: "profile/avatars",
    background: "profile/backgrounds",
  },
  getPath: (type: ProfileImageType, userId: string, fileExt: string) => {
    const environment = process.env.NODE_ENV || "development";
    const timestamp = Date.now();
    return `${environment}/${IMAGE_CONFIG.paths[type]}/${userId}_${timestamp}.${fileExt}`;
  },
} as const;
