"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

// Define the UserRole enum to match your schema
const UserRole = z.enum([
  "USER",
  "CUSTOMER",
  "SUBSCRIBER",
  "PROMO",
  "DISTRIBUTOR",
  "SHOPMANAGER",
  "EDITOR",
  "ADMIN",
]);

// Create a schema for updating user role
const updateUserRoleSchema = z.object({
  userId: z.string(),
  newRole: UserRole,
});

export async function updateUserRole(
  data: z.infer<typeof updateUserRoleSchema>
) {
  try {
    // Validate user session
    const { user } = await validateRequest();
    if (!user) {
      throw new Error("Unauthorized. Please log in.");
    }

    // Check if the user has the ADMIN role
    if (user.role !== "ADMIN") {
      throw new Error("Only admins can update user roles.");
    }

    // Validate and extract the input data
    const { userId, newRole } = updateUserRoleSchema.parse(data);

    // Update the user's role in the database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });

    // Revalidate relevant paths
    revalidatePath("/admin/users"); // Assuming there's an admin users page
    revalidatePath(`/user/${userId}`); // Assuming there's a user profile page

    // Redirect to a success page or back to the user list
    redirect("/admin/users?success=true");
  } catch (error) {
    if (error instanceof z.ZodError) {
      // For Zod validation errors, we'll redirect with error details
      const errorMessage = error.errors.map((e) => e.message).join(", ");
      redirect(
        `/admin/update-user-role/${data.userId}?error=${encodeURIComponent(errorMessage)}`
      );
    }
    if (error instanceof Error) {
      // For other errors, we'll redirect with the error message
      redirect(
        `/admin/update-user-role/${data.userId}?error=${encodeURIComponent(error.message)}`
      );
    }
    // For unexpected errors, we'll redirect with a generic error message
    redirect(
      `/admin/update-user-role/${data.userId}?error=${encodeURIComponent("An unexpected error occurred")}`
    );
  }
}
