"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { UserRole } from "@prisma/client";

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

export type FetchUsersResult =
  | { success: true; data: User[]; count: number }
  | { success: false; error: string };

// Helper function to check if user has admin privileges
function hasAdminPrivileges(role: UserRole): boolean {
  return role === UserRole.ADMIN || role === UserRole.SUPERADMIN;
}

// Function to fetch users by role
export async function fetchUsersByRole(
  role: UserRole
): Promise<FetchUsersResult> {
  try {
    const { user } = await validateRequest();
    if (!user || !hasAdminPrivileges(user.role)) {
      throw new Error("Unauthorized. Only admins can fetch users.");
    }

    const users = await prisma.user.findMany({
      where: { role },
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

    return {
      success: true,
      data: users,
      count: users.length,
    };
  } catch (error) {
    console.error(`Error fetching ${role} users:`, error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

// Function to fetch pending approval users (users with role USER)
export async function fetchPendingApprovalUsers(): Promise<FetchUsersResult> {
  return fetchUsersByRole(UserRole.USER);
}

// Role-specific fetch functions
export async function fetchCustomers(): Promise<FetchUsersResult> {
  return fetchUsersByRole(UserRole.CUSTOMER);
}

export async function fetchSubscribers(): Promise<FetchUsersResult> {
  return fetchUsersByRole(UserRole.SUBSCRIBER);
}

export async function fetchPromoUsers(): Promise<FetchUsersResult> {
  return fetchUsersByRole(UserRole.PROMO);
}

export async function fetchDistributors(): Promise<FetchUsersResult> {
  return fetchUsersByRole(UserRole.DISTRIBUTOR);
}

export async function fetchShopManagers(): Promise<FetchUsersResult> {
  return fetchUsersByRole(UserRole.SHOPMANAGER);
}

export async function fetchEditors(): Promise<FetchUsersResult> {
  return fetchUsersByRole(UserRole.EDITOR);
}

// Function to fetch all role counts at once
export async function fetchAllRoleCounts(): Promise<
  | {
      success: true;
      counts: {
        pendingApproval: number;
        customers: number;
        subscribers: number;
        promo: number;
        distributors: number;
        shopManagers: number;
        editors: number;
        admins: number;
        superadmins: number;
      };
    }
  | { success: false; error: string }
> {
  try {
    const { user } = await validateRequest();
    if (!user || !hasAdminPrivileges(user.role)) {
      throw new Error("Unauthorized. Only admins can fetch user counts.");
    }

    const [
      pendingApproval,
      customers,
      subscribers,
      promo,
      distributors,
      shopManagers,
      editors,
      admins,
      superadmins,
    ] = await Promise.all([
      prisma.user.count({ where: { role: UserRole.USER } }),
      prisma.user.count({ where: { role: UserRole.CUSTOMER } }),
      prisma.user.count({ where: { role: UserRole.SUBSCRIBER } }),
      prisma.user.count({ where: { role: UserRole.PROMO } }),
      prisma.user.count({ where: { role: UserRole.DISTRIBUTOR } }),
      prisma.user.count({ where: { role: UserRole.SHOPMANAGER } }),
      prisma.user.count({ where: { role: UserRole.EDITOR } }),
      prisma.user.count({ where: { role: UserRole.ADMIN } }),
      prisma.user.count({ where: { role: UserRole.SUPERADMIN } }),
    ]);

    return {
      success: true,
      counts: {
        pendingApproval,
        customers,
        subscribers,
        promo,
        distributors,
        shopManagers,
        editors,
        admins,
        superadmins,
      },
    };
  } catch (error) {
    console.error("Error fetching role counts:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function updateUserRole(
  userId: string,
  newRole: UserRole
): Promise<
  { success: true; message: string } | { success: false; error: string }
> {
  try {
    const { user } = await validateRequest();
    if (!user || !hasAdminPrivileges(user.role)) {
      throw new Error("Unauthorized. Only admins can update user roles.");
    }

    // Additional check: Only SUPERADMIN can create/modify ADMIN and SUPERADMIN roles
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (
      (newRole === UserRole.ADMIN ||
        newRole === UserRole.SUPERADMIN ||
        targetUser?.role === UserRole.ADMIN ||
        targetUser?.role === UserRole.SUPERADMIN) &&
      user.role !== UserRole.SUPERADMIN
    ) {
      throw new Error("Only SUPERADMIN can modify ADMIN and SUPERADMIN roles.");
    }

    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });

    revalidatePath("/admin/users/update");
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
