"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import * as argon2 from "argon2";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { accountFormSchema, FormValues } from "./validation";

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
};

export async function updateAccountInfo(formData: FormValues) {
  try {
    // Validate input
    const validatedData = accountFormSchema.parse(formData);

    // Get current session
    const { user } = await validateRequest();
    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    // Get current user
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
        return { success: false, error: "No password set for this account" };
      }

      const isValidPassword = await argon2.verify(
        dbUser.passwordHash,
        validatedData.currentPassword
      );

      if (!isValidPassword) {
        return { success: false, error: "Current password is incorrect" };
      }

      updateData.passwordHash = await argon2.hash(validatedData.newPassword);
    }

    // Update user
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
    return { success: true, data: updatedUser };
  } catch (error) {
    console.error("Update error:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: "Invalid form data" };
    }
    return { success: false, error: "Failed to update account information" };
  }
}
