import { z } from "zod";

export const registrationSchema = z
  .object({
    companyName: z.string().min(1, "Company name is required"),
    vatNumber: z.string().optional(),
    ckNumber: z.string().optional(),
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    email: z.string().email("Invalid email address"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
    natureOfBusiness: z.enum([
      "distributors",
      "retailer",
      "manufacturer",
      "service",
      "other",
    ]),
    currentSupplier: z.enum([
      "none",
      "supplier1",
      "supplier2",
      "supplier3",
      "other",
    ]),
    otherSupplier: z.string().optional(),
    website: z.string().url("Invalid URL").optional().or(z.literal("")),
    resellingTo: z.string().optional(),
    position: z.string().optional(),
    streetAddress: z.string().min(1, "Street address is required"),
    addressLine2: z.string().optional(),
    suburb: z.string().optional(),
    townCity: z.string().min(1, "Town/City is required"),
    postcode: z.string().min(1, "Postcode is required"),
    country: z.enum([
      "southAfrica",
      "namibia",
      "botswana",
      "zimbabwe",
      "mozambique",
    ]),
    salesRep: z.enum(["noOne", "rep1", "rep2", "rep3", "rep4"]),
    agreeTerms: z
      .boolean()
      .refine(
        (val) => val === true,
        "You must agree to the terms and conditions"
      ),
  })
  .refine(
    (data) => {
      if (data.currentSupplier === "other" && !data.otherSupplier) {
        return false;
      }
      return true;
    },
    {
      message: "Please specify the other supplier",
      path: ["otherSupplier"],
    }
  );

export type RegistrationFormData = z.infer<typeof registrationSchema>;
