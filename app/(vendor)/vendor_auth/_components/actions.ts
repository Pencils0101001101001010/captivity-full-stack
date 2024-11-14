"use server";

import prisma from "@/lib/prisma";
import { hash, verify } from "@node-rs/argon2";
import { generateIdFromEntropySize } from "lucia";
import { isRedirectError } from "next/dist/client/components/redirect";
import { redirect } from "next/navigation";
import { z } from "zod";
import { lucia } from "@/auth";
import { cookies } from "next/headers";
import { Prisma } from "@prisma/client";

// Schemas
const vendorCustomerSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    storeSlug: z
      .string()
      .min(3, "Store name must be at least 3 characters")
      .regex(
        /^[a-zA-Z0-9-]+$/,
        "Only letters, numbers, and hyphens are allowed"
      ),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type VendorCustomerFormData = z.infer<typeof vendorCustomerSchema>;
type LoginFormData = z.infer<typeof loginSchema>;

// Registration
export async function vendorCustomerSignUp(
  formData: VendorCustomerFormData
): Promise<{ error?: string }> {
  try {
    const validatedData = vendorCustomerSchema.parse(formData);

    // Verify vendor exists
    const vendorStore = await prisma.user.findFirst({
      where: {
        storeSlug: validatedData.storeSlug,
        role: "VENDOR",
      },
    });

    if (!vendorStore) {
      return {
        error: "Vendor store not found. Please check the store name.",
      };
    }

    // Check username
    const existingUsername = await prisma.user.findFirst({
      where: {
        username: {
          equals: validatedData.username,
          mode: "insensitive",
        },
      },
    });

    if (existingUsername) {
      return {
        error: "Username already taken",
      };
    }

    // Check email
    const existingEmail = await prisma.user.findFirst({
      where: {
        email: {
          equals: validatedData.email,
          mode: "insensitive",
        },
      },
    });

    if (existingEmail) {
      return {
        error: "Email already taken",
      };
    }

    const userId = generateIdFromEntropySize(10);
    const passwordHash = await hash(validatedData.password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    // Create a unique storeSlug for the vendor customer
    const customerStoreSlug = `${validatedData.storeSlug}-customer-${validatedData.username}`;

    // Check if the customer storeSlug already exists
    const existingCustomerSlug = await prisma.user.findFirst({
      where: {
        storeSlug: customerStoreSlug,
      },
    });

    if (existingCustomerSlug) {
      return {
        error: "Unable to create account. Please try a different username.",
      };
    }

    await prisma.user.create({
      data: {
        id: userId,
        username: validatedData.username,
        email: validatedData.email,
        passwordHash,
        storeSlug: customerStoreSlug,
        role: "VENDORCUSTOMER",
        firstName: "Pending",
        lastName: "Pending",
        displayName: validatedData.username,
        streetAddress: "Pending",
        townCity: "Pending",
        postcode: "Pending",
        country: "Pending",
        natureOfBusiness: "Pending",
        currentSupplier: "Pending",
        salesRep: "Pending",
        companyName: "Pending",
        phoneNumber: "Pending",
        agreeTerms: true,
      },
    });

    redirect("/vendor/registration-pending");
  } catch (error) {
    console.error("Registration error:", error);
    if (isRedirectError(error)) throw error;

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          error:
            "This store name is already taken. Please try a different one.",
        };
      }
    }

    return {
      error: "Something went wrong. Please try again.",
    };
  }
}

// Login
export async function vendorCustomerLogin(
  formData: LoginFormData
): Promise<{ error?: string; redirect?: string }> {
  try {
    const validatedData = loginSchema.parse(formData);

    const user = await prisma.user.findFirst({
      where: {
        email: {
          equals: validatedData.email,
          mode: "insensitive",
        },
        role: "VENDORCUSTOMER",
      },
    });

    if (!user || !user.passwordHash) {
      return {
        error: "Invalid email or password",
      };
    }

    const validPassword = await verify(
      user.passwordHash,
      validatedData.password,
      {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1,
      }
    );

    if (!validPassword) {
      return {
        error: "Invalid email or password",
      };
    }

    // Extract vendor store slug
    const vendorStoreSlug = user.storeSlug?.split("-customer-")[0];
    if (!vendorStoreSlug) {
      return {
        error: "Invalid store configuration",
      };
    }

    // Create session
    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return {
      redirect: `/vendor/${vendorStoreSlug}`,
    };
  } catch (error) {
    console.error("Login error:", error);
    if (error instanceof z.ZodError) {
      return {
        error: error.errors[0].message,
      };
    }
    return {
      error: "Something went wrong. Please try again.",
    };
  }
}
