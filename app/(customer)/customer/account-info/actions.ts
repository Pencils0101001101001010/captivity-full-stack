"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import * as argon2 from "argon2";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const updateAccountSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  displayName: z.string().min(1, "Display name is required"),
  email: z.string().email("Invalid email address"),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
  confirmPassword: z.string().optional(),
});

type ActionResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  debug?: any;
};

function serializeError(error: unknown) {
  if (error instanceof Error) {
    return {
      message: error.message,
      name: error.name,
    };
  }
  return { message: String(error) };
}

export async function updateAccountInfo(
  formData: z.infer<typeof updateAccountSchema>
): Promise<ActionResponse<any>> {
  try {
    // Validate input
    const validatedData = updateAccountSchema.parse(formData);

    // Get current session
    const { user } = await validateRequest();
    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    // Get current user with full details including password hash
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
      },
    });

    if (!dbUser) {
      return { success: false, error: "User not found" };
    }

    console.log("Found user:", {
      id: dbUser.id,
      email: dbUser.email,
      hasPasswordHash: !!dbUser.passwordHash,
    });

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
      console.log("Starting password update process");

      if (!dbUser.passwordHash) {
        return {
          success: false,
          error: "No password set for this account",
        };
      }

      try {
        // Clean the hash string to ensure no whitespace
        const cleanHash = dbUser.passwordHash.trim();

        // Log the exact hash format
        console.log("Hash format check:", {
          originalHash: cleanHash.slice(0, 20) + "...",
          startsWithDollar: cleanHash.startsWith("$"),
          containsDollar: cleanHash.includes("$"),
          length: cleanHash.length,
          charCodes: Array.from(cleanHash.slice(0, 5)).map(c =>
            c.charCodeAt(0)
          ),
        });

        if (!cleanHash.startsWith("$")) {
          return {
            success: false,
            error: "Invalid password hash format",
          };
        }

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
        console.error("Password verification error:", serializeError(error));
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
      },
    });

    revalidatePath("/account");
    revalidatePath("/");

    return {
      success: true,
      data: updatedUser,
    };
  } catch (error: unknown) {
    console.error("Update account error:", serializeError(error));
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Invalid form data",
      };
    }
    return {
      success: false,
      error: "Failed to update account information",
    };
  }
}
