import * as z from "zod";

export const formSchema = z.object({
  captivityBranch: z.string().min(1, "Please select a branch"),
  methodOfCollection: z.string().min(1, "Please select a method of collection"),
  salesRep: z.string().optional(),
  referenceNumber: z.string().optional(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  companyName: z.string().min(1, "Company name is required"),
  countryRegion: z.string().min(1, "Please select a country/region"),
  streetAddress: z.string().min(1, "Street address is required"),
  apartmentSuite: z.string().optional(),
  townCity: z.string().min(1, "Town/City is required"),
  province: z.string().min(1, "Please select a province"),
  postcode: z.string().min(1, "Postcode/ZIP is required"),
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address"),
  orderNotes: z.string().optional(),
  agreeTerms: z.boolean().refine(value => value === true, {
    message: "You must agree to the terms and conditions",
  }),
  receiveEmailReviews: z.boolean().optional(),
});

export type FormValues = z.infer<typeof formSchema>;
