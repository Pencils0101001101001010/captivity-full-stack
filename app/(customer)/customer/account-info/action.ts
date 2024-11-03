"use server";

import { z } from "zod";
import prisma from "@/lib/prisma";
import * as argon2 from "argon2";
import { revalidatePath } from "next/cache";
import { accountFormSchema } from "./types";
import { checkDatabaseConnection } from "@/lib/db-utils";

type ActionResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  debugInfo?: any; // Only included in development
};

export async function updateAccountInfo(
  userId: string,
  formData: z.infer<typeof accountFormSchema>
): Promise<ActionResponse<any>> {
  try {
    // Add detailed logging for debugging
    console.log("Starting updateAccountInfo", { userId });

    // First check database connection with timeout
    const connectionCheck = await Promise.race([
      checkDatabaseConnection(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Database connection timeout")), 5000)
      ),
    ]);

    if (connectionCheck !== true) {
      console.error("Database connection failed:", connectionCheck);
      return {
        success: false,
        error: "Unable to connect to database. Please try again later.",
        debugInfo:
          process.env.NODE_ENV === "development" ? connectionCheck : undefined,
      };
    }

    // Validate input data
    let validatedData;
    try {
      validatedData = accountFormSchema.parse(formData);
    } catch (validationError) {
      console.error("Validation error:", validationError);
      return {
        success: false,
        error: "Invalid form data. Please check your inputs and try again.",
        debugInfo:
          process.env.NODE_ENV === "development" ? validationError : undefined,
      };
    }

    // Get current user with full details
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        passwordHash: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      console.error("User not found:", userId);
      return {
        success: false,
        error: "User not found. Please log in again.",
      };
    }

    // Prepare update data with null checks
    const updateData: any = {
      username: validatedData.username?.trim(),
      firstName: validatedData.firstName?.trim(),
      lastName: validatedData.lastName?.trim(),
      displayName: validatedData.displayName?.trim(),
      phoneNumber: validatedData.phoneNumber,
      streetAddress: validatedData.streetAddress?.trim(),
      addressLine2: validatedData.addressLine2?.trim() || null,
      suburb: validatedData.suburb?.trim() || null,
      townCity: validatedData.townCity?.trim(),
      postcode: validatedData.postcode?.trim(),
      country: validatedData.country?.trim(),
      position: validatedData.position?.trim() || null,
      natureOfBusiness: validatedData.natureOfBusiness?.trim(),
      currentSupplier: validatedData.currentSupplier?.trim(),
      otherSupplier: validatedData.otherSupplier?.trim() || null,
      resellingTo: validatedData.resellingTo?.trim() || null,
      salesRep: validatedData.salesRep?.trim(),
      website: validatedData.website?.trim() || null,
      companyName: validatedData.companyName?.trim(),
      ckNumber: validatedData.ckNumber?.trim() || null,
      vatNumber: validatedData.vatNumber?.trim() || null,
    };

    // Handle email update with explicit error handling
    if (validatedData.email !== user.email) {
      const existingUser = await prisma.user.findUnique({
        where: {
          email: validatedData.email,
          NOT: { id: user.id },
        },
      });

      if (existingUser) {
        return {
          success: false,
          error: "This email is already in use by another account.",
        };
      }
      updateData.email = validatedData.email?.trim();
    }

    // Handle password update with better error messages
    if (validatedData.newPassword && validatedData.currentPassword) {
      if (!user.passwordHash) {
        return {
          success: false,
          error: "Password authentication is not set up for this account.",
        };
      }

      const isValidPassword = await argon2.verify(
        user.passwordHash,
        validatedData.currentPassword
      );

      if (!isValidPassword) {
        return { success: false, error: "Current password is incorrect." };
      }

      updateData.passwordHash = await argon2.hash(validatedData.newPassword, {
        type: argon2.argon2id,
      });
    }

    // Update user with try-catch
    try {
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: updateData,
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          displayName: true,
          role: true,
        },
      });

      revalidatePath("/account");
      return {
        success: true,
        data: updatedUser,
      };
    } catch (updateError) {
      console.error("Database update error:", updateError);
      return {
        success: false,
        error: "Failed to update account information. Please try again.",
        debugInfo:
          process.env.NODE_ENV === "development" ? updateError : undefined,
      };
    }
  } catch (error) {
    console.error("Unexpected error in updateAccountInfo:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
      debugInfo: process.env.NODE_ENV === "development" ? error : undefined,
    };
  }
}
