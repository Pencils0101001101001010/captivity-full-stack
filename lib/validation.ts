import { z } from "zod";

const requiredString = z.string().trim().min(1, "Required");

export const signUpSchema = z.object({
  email: requiredString.email("Invalid email address"),
  username: requiredString.regex(
    /^[a-zA-Z0-9_-]+$/,
    "Only letters, numbers, - and _ allowed"
  ),
  password: requiredString.min(8, "Must be at least 8 characters"),
  role: z
    .enum([
      "USER",
      "CUSTOMER",
      "SUBSCRIBER",
      "PROMO",
      "DISTRIBUTOR",
      "SHOPMANAGER",
      "EDITOR",
      "ADMIN",
    ])
    .default("USER"),
});

export type SignUpValues = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
  username: requiredString,
  password: requiredString,
});

export type LoginValues = z.infer<typeof loginSchema>;

export const ProductSchema = z.object({
  id: z.number().int().positive(),
  userId: requiredString,
  type: requiredString,
  sku: requiredString,
  name: requiredString,
  published: z.boolean(),
  isFeatured: z.boolean(),
  visibility: requiredString,
  shortDescription: z.string(),
  taxStatus: requiredString,
  inStock: z.boolean(),
  backordersAllowed: z.boolean(),
  soldIndividually: z.boolean(),
  allowReviews: z.boolean(),
  categories: requiredString,
  tags: z.string(),
  imageUrl: z.string().url(),
  upsells: z.string().nullable(),
  position: z.number().int().nonnegative(),
  attribute1Name: z.string().nullable(),
  attribute1Values: z.string().nullable(),
  attribute2Name: z.string().nullable(),
  attribute2Values: z.string().nullable(),
  regularPrice: z.number().positive().nullable(),
  stock: z.number().int().nonnegative().nullable(),
  createdAt: z.date(),
});

export type Product = z.infer<typeof ProductSchema>;

export const validateProduct = (data: unknown): Product => {
  return ProductSchema.parse(data);
};

export const validatePartialProduct = (data: unknown): Partial<Product> => {
  return ProductSchema.partial().parse(data);
};

export const CategorySchema = requiredString;

export const validateCategories = (categories: unknown): string[] => {
  const CategoryArraySchema = z.array(CategorySchema);
  return CategoryArraySchema.parse(categories);
};

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
    resellingLocation: z.string().optional(),
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
