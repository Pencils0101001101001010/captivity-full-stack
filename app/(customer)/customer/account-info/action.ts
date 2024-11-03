"use server";

import { z } from "zod";
import prisma from "@/lib/prisma";
import * as argon2 from "argon2";
import { revalidatePath } from "next/cache";
import { accountFormSchema } from "./types";

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
    const validatedData = accountFormSchema.parse(formData);

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
      addressLine2: validatedData.addressLine2,
      suburb: validatedData.suburb,
      townCity: validatedData.townCity,
      postcode: validatedData.postcode,
      country: validatedData.country,
      position: validatedData.position,
      natureOfBusiness: validatedData.natureOfBusiness,
      currentSupplier: validatedData.currentSupplier,
      otherSupplier: validatedData.otherSupplier,
      resellingTo: validatedData.resellingTo,
      salesRep: validatedData.salesRep,
      website: validatedData.website,
      companyName: validatedData.companyName,
      ckNumber: validatedData.ckNumber,
      vatNumber: validatedData.vatNumber,
    };

    // Handle email update
    if (validatedData.email !== user.email) {
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
      } catch (error) {
        console.error("Password verification error:", error);
        return { success: false, error: "Error verifying password" };
      }
    }

    // Update user in database
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
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: "Invalid form data" };
    }
    return { success: false, error: "Failed to update account information" };
  }
}
