import * as z from "zod";

export const accountFormSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    displayName: z.string().min(1, "Display name is required"),
    email: z.string().email("Invalid email address"),
    currentPassword: z.string().optional(),
    newPassword: z
      .string()
      .optional()
      .transform(val => (val === "" ? undefined : val))
      .refine(
        val => {
          if (!val) return true;
          return (
            val.length >= 8 &&
            /[A-Z]/.test(val) &&
            /[a-z]/.test(val) &&
            /[0-9]/.test(val)
          );
        },
        {
          message:
            "Password must be at least 8 characters and contain uppercase, lowercase, and numbers",
        }
      ),
    confirmPassword: z.string().optional(),
    avatar: z.any().optional(),
  })
  .refine(
    data => {
      if (!data.newPassword) return true;
      if (!data.currentPassword) return false;
      return true;
    },
    {
      message: "Current password is required when setting a new password",
      path: ["currentPassword"],
    }
  )
  .refine(
    data => {
      if (!data.newPassword) return true;
      return data.newPassword === data.confirmPassword;
    },
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

export type FormValues = z.infer<typeof accountFormSchema>;