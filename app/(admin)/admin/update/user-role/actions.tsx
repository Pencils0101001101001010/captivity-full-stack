"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { UserRole } from "@prisma/client";

type UpdateUserRoleResult =
  | { success: true; message: string }
  | { success: false; error: string };

export async function updateUserRole(
  userId: string,
  newRole: UserRole
): Promise<UpdateUserRoleResult> {
  try {
    // Validate user session
    const { user } = await validateRequest();
    if (!user || user.role !== "ADMIN") {
      throw new Error("Unauthorized. Only admins can update user roles.");
    }

    // Update the user's role in the database
    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });

    // Revalidate the admin users page
    revalidatePath("/admin/users");

    return { success: true, message: "User role updated successfully" };
  } catch (error) {
    console.error("Error updating user role:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

//////////////////////////////////////////////////////

type User = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  companyName: string;
  role: UserRole;
  createdAt: Date;
};

type FetchAllUsersResult =
  | { success: true; data: User[] }
  | { success: false; error: string };

export async function fetchAllUsers(): Promise<FetchAllUsersResult> {
  try {
    // Validate user session
    const { user } = await validateRequest();
    if (!user) {
      throw new Error("Unauthorized. Please log in.");
    }

    // Check if the user has the ADMIN role
    if (user.role !== "ADMIN") {
      throw new Error("Only admins can fetch all users.");
    }

    // Fetch all users from the database
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        displayName: true,
        role: true,
        companyName: true,
        createdAt: true,
      },
    });

    // Revalidate the admin users page
    revalidatePath("/admin/users");

    return { success: true, data: users };
  } catch (error) {
    console.error("Error fetching users:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
