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
  debugInfo?: any;
};

export async function updateAccountInfo(
  userId: string,
  formData: z.infer<typeof accountFormSchema>
): Promise<ActionResponse<any>> {
  try {
    console.log("Starting updateAccountInfo", { userId });

    // Validate input data first
    let validatedData;
    try {
      validatedData = accountFormSchema.parse(formData);
    } catch (validationError: any) {
      console.error("Validation error:", validationError);
      return {
        success: false,
        error: "Invalid form data",
        debugInfo:
          process.env.NODE_ENV === "development"
            ? validationError.errors
            : undefined,
      };
    }

    // Check database connection
    try {
      await checkDatabaseConnection();
    } catch (error) {
      console.error("Database connection error:", error);
      return {
        success: false,
        error: "Database connection failed",
        debugInfo: process.env.NODE_ENV === "development" ? error : undefined,
      };
    }

    // Get current user
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
      return { success: false, error: "User not found" };
    }

    // Prepare update data
    const updateData: Record<string, any> = {
      username: validatedData.username,
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      displayName: validatedData.displayName,
      email: validatedData.email,
      phoneNumber: validatedData.phoneNumber,
      streetAddress: validatedData.streetAddress,
      townCity: validatedData.townCity,
      postcode: validatedData.postcode,
      country: validatedData.country,
      natureOfBusiness: validatedData.natureOfBusiness,
      currentSupplier: validatedData.currentSupplier,
      salesRep: validatedData.salesRep,
      companyName: validatedData.companyName,
    };

    // Handle optional fields
    if (validatedData.addressLine2)
      updateData.addressLine2 = validatedData.addressLine2;
    if (validatedData.suburb) updateData.suburb = validatedData.suburb;
    if (validatedData.position) updateData.position = validatedData.position;
    if (validatedData.otherSupplier)
      updateData.otherSupplier = validatedData.otherSupplier;
    if (validatedData.resellingTo)
      updateData.resellingTo = validatedData.resellingTo;
    if (validatedData.website) updateData.website = validatedData.website;
    if (validatedData.ckNumber) updateData.ckNumber = validatedData.ckNumber;
    if (validatedData.vatNumber) updateData.vatNumber = validatedData.vatNumber;

    // Handle password update
    if (validatedData.newPassword && validatedData.currentPassword) {
      if (!user.passwordHash) {
        return {
          success: false,
          error: "Password authentication not set up",
        };
      }

      try {
        const isValidPassword = await argon2.verify(
          user.passwordHash,
          validatedData.currentPassword
        );

        if (!isValidPassword) {
          return { success: false, error: "Current password is incorrect" };
        }

        updateData.passwordHash = await argon2.hash(validatedData.newPassword);
      } catch (error) {
        console.error("Password verification error:", error);
        return {
          success: false,
          error: "Password update failed",
          debugInfo: process.env.NODE_ENV === "development" ? error : undefined,
        };
      }
    }

    // Perform update
    try {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
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
    } catch (error: any) {
      console.error("Update error:", error);
      return {
        success: false,
        error:
          error.code === "P2002" ? "Email already exists" : "Update failed",
        debugInfo: process.env.NODE_ENV === "development" ? error : undefined,
      };
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
      debugInfo: process.env.NODE_ENV === "development" ? error : undefined,
    };
  }
}
