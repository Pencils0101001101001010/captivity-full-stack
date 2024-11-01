import * as z from "zod";

export const accountFormSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    displayName: z.string().min(1, "Display name is required"),
    email: z.string().email("Invalid email address"),
    currentPassword: z.string().optional(),
    newPassword: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // If new password is provided, require current password
    if (data.newPassword && !data.currentPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Current password is required when setting a new password",
        path: ["currentPassword"],
      });
    }

    // If new password is provided, validate its format
    if (data.newPassword) {
      if (data.newPassword.length < 8) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Password must be at least 8 characters",
          path: ["newPassword"],
        });
      }
      if (!/[A-Z]/.test(data.newPassword)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Password must contain at least one uppercase letter",
          path: ["newPassword"],
        });
      }
      if (!/[a-z]/.test(data.newPassword)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Password must contain at least one lowercase letter",
          path: ["newPassword"],
        });
      }
      if (!/[0-9]/.test(data.newPassword)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Password must contain at least one number",
          path: ["newPassword"],
        });
      }
    }

    // Check if passwords match when new password is provided
    if (data.newPassword && data.newPassword !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

export type FormValues = z.infer<typeof accountFormSchema>;
