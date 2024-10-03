"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteProduct(id: number) {
  try {
    // Validate user session
    const { user } = await validateRequest();
    if (!user) {
      throw new Error("Unauthorized. Please log in.");
    }

    // Check if the user has the ADMIN role
    if (user.role !== "ADMIN") {
      throw new Error("Only admins can delete products.");
    }

    // Delete the product from the database
    await prisma.product.delete({
      where: { id },
    });

    // Revalidate the path to reflect the product deletion
    revalidatePath(`/admin/products/all-collections/${id}/delete`);

    // Redirect to the products page
    redirect("/admin");
  } catch (error) {
    // Log the error
    console.error("Error deleting product:", error);

    // Rethrow the error to be handled by the client
    throw error;
  }
}
