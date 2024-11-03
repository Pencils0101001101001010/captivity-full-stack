import { z } from "zod";

export const accountFormSchema = z.object({
  username: z.string().min(1, "Username is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  displayName: z.string().min(1, "Display name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.number().min(1, "Phone number is required"),
  streetAddress: z.string().min(1, "Street address is required"),
  addressLine2: z.string().nullish(), // Changed this
  suburb: z.string().nullish(), // Changed this
  townCity: z.string().min(1, "Town/City is required"),
  postcode: z.string().min(1, "Postcode is required"),
  country: z.string().min(1, "Country is required"),
  position: z.string().nullish(),
  natureOfBusiness: z.string().min(1, "Nature of business is required"),
  currentSupplier: z.string().min(1, "Current supplier is required"),
  otherSupplier: z.string().nullish(),
  resellingTo: z.string().nullish(),
  salesRep: z.string().min(1, "Sales representative is required"),
  website: z.string().url().nullish(),
  companyName: z.string().min(1, "Company name is required"),
  ckNumber: z.string().nullish(),
  vatNumber: z.string().nullish(),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
  confirmPassword: z.string().optional(),
});

export type AccountFormValues = z.infer<typeof accountFormSchema>;

// import { z } from "zod";
// import { UserRole } from "@prisma/client";

// export const accountFormSchema = z.object({
//   username: z.string().min(1, "Username is required"),
//   firstName: z.string().min(1, "First name is required"),
//   lastName: z.string().min(1, "Last name is required"),
//   displayName: z.string().min(1, "Display name is required"),
//   email: z.string().email("Invalid email address"),
//   phoneNumber: z.number().min(1, "Phone number is required"),
//   streetAddress: z.string().min(1, "Street address is required"),
//   addressLine2: z
//     .string()
//     .nullish()
//     .transform(val => val ?? ""),
//   suburb: z
//     .string()
//     .nullish()
//     .transform(val => val ?? ""),
//   townCity: z.string().min(1, "Town/City is required"),
//   postcode: z.string().min(1, "Postcode is required"),
//   country: z.string().min(1, "Country is required"),
//   position: z.string().optional(),
//   natureOfBusiness: z.string().min(1, "Nature of business is required"),
//   currentSupplier: z.string().min(1, "Current supplier is required"),
//   otherSupplier: z.string().optional(),
//   resellingTo: z.string().optional(),
//   salesRep: z.string().min(1, "Sales representative is required"),
//   website: z.string().url().optional(),
//   companyName: z.string().min(1, "Company name is required"),
//   ckNumber: z.string().optional(),
//   vatNumber: z.string().optional(),
//   currentPassword: z.string().optional(),
//   newPassword: z
//     .string()
//     .optional()
//     .transform(val => (val === "" ? undefined : val))
//     .refine(
//       val => {
//         if (!val) return true;
//         return (
//           val.length >= 8 &&
//           /[A-Z]/.test(val) &&
//           /[a-z]/.test(val) &&
//           /[0-9]/.test(val)
//         );
//       },
//       {
//         message:
//           "Password must be at least 8 characters and contain uppercase, lowercase, and numbers",
//       }
//     ),
//   confirmPassword: z.string().optional(),
// });

// export type AccountFormValues = z.infer<typeof accountFormSchema>;
