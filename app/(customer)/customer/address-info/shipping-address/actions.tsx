"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const billingAddressSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  companyName: z.string().min(1, "Company name is required"),
  countryRegion: z.string().min(1, "Country/Region is required"),
  streetAddress: z.string().min(1, "Street address is required"),
  apartmentSuite: z.string().optional(),
  townCity: z.string().min(1, "Town/City is required"),
  province: z.string().min(1, "Province is required"),
  postcode: z.string().min(1, "Postal code is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Invalid email address"),
});

type ActionResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export async function updateBillingAddress(
  formData: z.infer<typeof billingAddressSchema>
): Promise<ActionResponse<any>> {
  try {
    const validatedData = billingAddressSchema.parse(formData);

    const { user } = await validateRequest();
    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        companyName: validatedData.companyName,
        country: validatedData.countryRegion, // Maps to country in DB
        streetAddress: validatedData.streetAddress,
        addressLine2: validatedData.apartmentSuite,
        townCity: validatedData.townCity,
        suburb: validatedData.province,
        postcode: validatedData.postcode,
        phoneNumber: parseInt(validatedData.phone),
        email: validatedData.email,
      },
    });

    revalidatePath("/account");
    revalidatePath("/billing");

    return {
      success: true,
      data: updatedUser,
    };
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Invalid form data",
      };
    }

    console.error("Billing address update error:", error);
    return {
      success: false,
      error: "Failed to update billing address",
    };
  }
}
