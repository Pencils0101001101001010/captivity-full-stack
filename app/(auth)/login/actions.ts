"use server";

import { lucia } from "@/auth";
import prisma from "@/lib/prisma";
import { loginSchema, LoginValues } from "@/lib/validation";
import { hash, verify } from "@node-rs/argon2";
import { isRedirectError } from "next/dist/client/components/redirect";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { User } from "@prisma/client";
import { sendEmail } from "./email";
import { z } from "zod";
import { randomBytes } from "crypto";

enum UserRole {
  USER = "USER",
  CUSTOMER = "CUSTOMER",
  SUBSCRIBER = "SUBSCRIBER",
  PROMO = "PROMO",
  DISTRIBUTOR = "DISTRIBUTOR",
  SHOPMANAGER = "SHOPMANAGER",
  EDITOR = "EDITOR",
  ADMIN = "ADMIN",
}

const roleRoutes: Record<UserRole, string> = {
  [UserRole.USER]: "/register-pending-message",
  [UserRole.CUSTOMER]: "/customer",
  [UserRole.SUBSCRIBER]: "/subscriber",
  [UserRole.PROMO]: "/promo",
  [UserRole.DISTRIBUTOR]: "/distributor",
  [UserRole.SHOPMANAGER]: "/shop",
  [UserRole.EDITOR]: "/editor",
  [UserRole.ADMIN]: "/admin",
};

export async function login(
  credentials: LoginValues
): Promise<{ error: string } | void> {
  try {
    const { username, password } = loginSchema.parse(credentials);

    const existingUser = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
    });

    if (!existingUser || !existingUser.passwordHash) {
      return {
        error: "Incorrect username or password",
      };
    }

    const validPassword = await verify(existingUser.passwordHash, password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    if (!validPassword) {
      return {
        error: "Incorrect username or password",
      };
    }

    const userRole = existingUser.role as UserRole;

    if (userRole === UserRole.USER) {
      return redirect("/register-pending-message");
    } else {
      const session = await lucia.createSession(existingUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );

      const redirectPath = roleRoutes[userRole] || "/";
      return redirect(redirectPath);
    }
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return {
      error: "Something went wrong. Please try again.",
    };
  }
}

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const resetPasswordSchema = z.object({
  token: z.string(),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export async function initiatePasswordReset(
  values: ForgotPasswordValues
): Promise<{ success?: boolean; error?: string }> {
  try {
    const { email } = forgotPasswordSchema.parse(values);
    console.log("Attempting password reset for:", email);

    const user = await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
    });

    if (!user) {
      console.log("No user found with email:", email);
      return { success: true };
    }

    const resetToken = randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const resetLink = `${baseUrl}/reset-password?token=${resetToken}`;

      await sendEmail({
        to: user.email,
        subject: "Reset Your Password",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .button { 
                  background-color: #0070f3;
                  color: white;
                  padding: 12px 24px;
                  text-decoration: none;
                  border-radius: 5px;
                  display: inline-block;
                  margin: 20px 0;
                }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>Reset Your Password</h1>
                <p>We received a request to reset your password. Click the button below to proceed:</p>
                <a href="${resetLink}" class="button">Reset Password</a>
                <p>Or copy this link to your browser:</p>
                <p>${resetLink}</p>
                <p>This link will expire in 1 hour.</p>
                <p>If you didn't request this, please ignore this email.</p>
              </div>
            </body>
          </html>
        `,
      });

      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken,
          resetTokenExpiry,
        },
      });

      return { success: true };
    } catch (emailError) {
      console.error("Failed to send reset email:", emailError);
      return {
        error:
          "Failed to send reset email. Please try again or contact support.",
      };
    }
  } catch (error) {
    console.error("Password reset initiation error:", error);
    return { error: "Failed to process password reset request" };
  }
}

export async function validateResetToken(
  token: string
): Promise<{ valid: boolean; error?: string }> {
  try {
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
    });

    return { valid: !!user };
  } catch (error) {
    console.error("Token validation error:", error);
    return { valid: false, error: "Invalid or expired reset token" };
  }
}

export async function resetPassword({
  token,
  newPassword,
}: {
  token: string;
  newPassword: string;
}): Promise<{ success?: boolean; error?: string; redirectTo?: string }> {
  if (!token) {
    return { error: "Reset token is required" };
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return { error: "Invalid or expired reset token" };
    }

    const passwordHash = await hash(newPassword, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });
    const redirectPath = "/login";

    return {
      success: true,
      redirectTo: redirectPath,
    };
  } catch (error) {
    if (!isRedirectError(error)) {
      console.error("Password reset error:", error);
    }
    return { error: "Failed to reset password" };
  }
}
