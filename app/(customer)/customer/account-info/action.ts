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
};

export async function updateAccountInfo(
  userId: string,
  formData: z.infer<typeof accountFormSchema>
): Promise<ActionResponse<any>> {
  try {
    // First check database connection
    const connectionCheck = await checkDatabaseConnection();
    if (connectionCheck !== true) {
      console.error("Database connection failed:", connectionCheck.error);
      return {
        success: false,
        error: "Database connection error. Please try again later.",
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
        error:
          "Invalid form data: " +
          (validationError instanceof Error
            ? validationError.message
            : "Unknown validation error"),
      };
    }

    // Get current user with full details
    let user;
    try {
      user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          passwordHash: true,
          email: true,
          role: true,
        },
      });
    } catch (dbError) {
      console.error("Database query error:", dbError);
      return {
        success: false,
        error: "Database error while fetching user",
      };
    }

    if (!user) {
      return { success: false, error: "User not found" };
    }

    // Prepare update data
    const updateData: any = {
      username: validatedData.username,
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      displayName: validatedData.displayName,
      phoneNumber: validatedData.phoneNumber,
      streetAddress: validatedData.streetAddress,
      addressLine2: validatedData.addressLine2 || null,
      suburb: validatedData.suburb || null,
      townCity: validatedData.townCity,
      postcode: validatedData.postcode,
      country: validatedData.country,
      position: validatedData.position || null,
      natureOfBusiness: validatedData.natureOfBusiness,
      currentSupplier: validatedData.currentSupplier,
      otherSupplier: validatedData.otherSupplier || null,
      resellingTo: validatedData.resellingTo || null,
      salesRep: validatedData.salesRep,
      website: validatedData.website || null,
      companyName: validatedData.companyName,
      ckNumber: validatedData.ckNumber || null,
      vatNumber: validatedData.vatNumber || null,
    };

    // Handle email update
    if (validatedData.email !== user.email) {
      try {
        const existingUser = await prisma.user.findUnique({
          where: {
            email: validatedData.email,
            NOT: { id: user.id },
          },
        });

        if (existingUser) {
          return { success: false, error: "Email already in use" };
        }
        updateData.email = validatedData.email;
      } catch (emailCheckError) {
        console.error("Email check error:", emailCheckError);
        return {
          success: false,
          error: "Error checking email availability",
        };
      }
    }

    // Handle password update
    if (validatedData.newPassword && validatedData.currentPassword) {
      if (!user.passwordHash) {
        return { success: false, error: "No password set for this account" };
      }

      try {
        const isValidPassword = await argon2.verify(
          user.passwordHash,
          validatedData.currentPassword
        );

        if (!isValidPassword) {
          return { success: false, error: "Current password is incorrect" };
        }

        updateData.passwordHash = await argon2.hash(validatedData.newPassword, {
          type: argon2.argon2id,
        });
      } catch (passwordError) {
        console.error("Password processing error:", passwordError);
        return {
          success: false,
          error: "Error processing password update",
        };
      }
    }

    // Update user in database
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
      return { success: true, data: updatedUser };
    } catch (updateError) {
      console.error("User update error:", updateError);
      return {
        success: false,
        error: "Failed to update user information in database",
      };
    }
  } catch (error) {
    console.error("Unexpected error in updateAccountInfo:", error);
    return {
      success: false,
      error: "An unexpected error occurred while updating account information",
    };
  }
}
