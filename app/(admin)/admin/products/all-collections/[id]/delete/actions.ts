"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteProduct(id: number) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      throw new Error("Unauthorized. Please log in.");
    }

    if (user.role !== "ADMIN") {
      throw new Error("Only admins can delete products.");
    }

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new Error("Product not found.");
    }

    await prisma.product.delete({
      where: { id },
    });

    revalidatePath(`/admin/products/all-collections/${id}/delete`);
    redirect("/admin");
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
}