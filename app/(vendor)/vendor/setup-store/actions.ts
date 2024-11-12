"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

type SetupStoreData = {
  storeName: string;
  storeSlug: string;
  storeDescription: string;
  storePhoneNumber: string;
  storeContactEmail: string;
};

export async function setupStore(data: SetupStoreData) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return { error: "Not authenticated" };
    }

    // Check if store slug is already taken
    const existingStore = await prisma.user.findFirst({
      where: {
        storeSlug: data.storeSlug,
      },
    });

    if (existingStore) {
      return { error: "Store URL is already taken" };
    }

    // Update user with store information
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        storeName: data.storeName,
        storeSlug: data.storeSlug,
        storeDescription: data.storeDescription,
        storePhoneNumber: data.storePhoneNumber,
        storeContactEmail: data.storeContactEmail,
        isVendorActive: true,
      },
    });

    revalidatePath(`/vendor/${data.storeSlug}`);
    return { success: true };
  } catch (error) {
    console.error("Store setup error:", error);
    return { error: "Failed to setup store" };
  }
}
