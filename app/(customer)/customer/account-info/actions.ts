"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import * as argon2 from "argon2";
import { revalidatePath } from "next/cache";
import { accountFormSchema } from "./validation";
import * as z from "zod";
import { ActionResponse } from "./types";

export async function updateAccountInfo(
  formData: FormData
): Promise<ActionResponse<any>> {
  try {
    // Convert FormData to object
    const rawData = Object.fromEntries(formData.entries());

    // Validate input
    const validatedData = accountFormSchema.parse(rawData);
    console.log("Validated data:", {
      ...validatedData,
      currentPassword: validatedData.currentPassword ? "[REDACTED]" : undefined,
      newPassword: validatedData.newPassword ? "[REDACTED]" : undefined,
      confirmPassword: validatedData.confirmPassword ? "[REDACTED]" : undefined,
    });

    // Get current session
    const { user } = await validateRequest();
    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    // Get current user with full details
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        passwordHash: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        displayName: true,
        avatarUrl: true,
      },
    });

    if (!dbUser) {
      return { success: false, error: "User not found" };
    }

    // Prepare update data
    const updateData: any = {
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      displayName: validatedData.displayName,
    };

    // Handle email update
    if (validatedData.email !== dbUser.email) {
      const existingUser = await prisma.user.findUnique({
        where: {
          email: validatedData.email,
          NOT: { id: dbUser.id },
        },
      });

      if (existingUser) {
        return { success: false, error: "Email already in use" };
      }
      updateData.email = validatedData.email;
    }

    // Handle password update
    if (validatedData.newPassword && validatedData.currentPassword) {
      if (!dbUser.passwordHash) {
        return {
          success: false,
          error: "No password set for this account",
        };
      }

      try {
        const cleanHash = dbUser.passwordHash.trim();

        // Verify current password
        const isValidPassword = await argon2.verify(
          cleanHash,
          validatedData.currentPassword
        );

        if (!isValidPassword) {
          return {
            success: false,
            error: "Current password is incorrect",
          };
        }

        // Hash the new password
        const hashedPassword = await argon2.hash(validatedData.newPassword, {
          type: argon2.argon2id,
        });

        updateData.passwordHash = hashedPassword;
      } catch (error: unknown) {
        console.error("Password verification error:", error);
        return {
          success: false,
          error: "Error verifying password",
        };
      }
    }

    // Update user in database
    const updatedUser = await prisma.user.update({
      where: { id: dbUser.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        displayName: true,
        role: true,
        avatarUrl: true,
      },
    });

    // Revalidate relevant paths
    revalidatePath("/customer/account-info");
    revalidatePath("/customer");
    revalidatePath("/");

    return {
      success: true,
      data: updatedUser,
    };
  } catch (error: unknown) {
    console.error("Update account error:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error:
          "Invalid form data: " + error.errors.map(e => e.message).join(", "),
      };
    }

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "Failed to update account information",
    };
  }
}
