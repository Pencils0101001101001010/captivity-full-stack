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

///////////////////Product Schema Validation////////////////////////////

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

export const CategorySchema = requiredString; // Categories must be non-empty strings

// Function to validate categories array
export const validateCategories = (categories: unknown): string[] => {
  const CategoryArraySchema = z.array(CategorySchema);
  return CategoryArraySchema.parse(categories);
};
