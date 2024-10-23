import * as z from "zod";

const accountFormSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    displayName: z.string().min(1, "Display name is required"),
    email: z.string().email("Invalid email address"),
    currentPassword: z.string().optional(),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .optional()
      .refine(val => !val || /[A-Z]/.test(val), {
        message: "Password must contain at least one uppercase letter",
      })
      .refine(val => !val || /[a-z]/.test(val), {
        message: "Password must contain at least one lowercase letter",
      })
      .refine(val => !val || /[0-9]/.test(val), {
        message: "Password must contain at least one number",
      }),
    confirmPassword: z.string().optional(),
  })
  .refine(
    data => {
      // Only validate passwords match if new password is provided
      if (data.newPassword && data.newPassword !== data.confirmPassword) {
        return false;
      }
      return true;
    },
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

type FormValues = z.infer<typeof accountFormSchema>;
