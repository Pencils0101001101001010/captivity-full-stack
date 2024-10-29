// types.ts
import { z } from "zod";

// Define the schema first
export const productFormSchema = z.object({
  productName: z.string().min(3, "Product name must be at least 3 characters"),
  category: z.array(z.string()).min(1, "At least one category is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  sellingPrice: z.number().min(0.01, "Price must be greater than 0"),
  isPublished: z.boolean(),
  dynamicPricing: z.array(
    z.object({
      from: z.string().min(1, "From value is required"),
      to: z.string().min(1, "To value is required"),
      type: z.enum(["fixed_price", "percentage"] as const),
      amount: z.string().min(1, "Amount is required"),
    })
  ),
  variations: z.array(
    z.object({
      name: z.string().min(1, "Name is required"),
      color: z.string().optional(),
      size: z.string().optional(),
      sku: z.string().min(3, "SKU must be at least 3 characters"),
      sku2: z.string().optional(),
      variationImageURL: z.string().optional(),
      quantity: z.number().min(0, "Quantity cannot be negative"),
    })
  ),
  featuredImage: z.object({
    thumbnail: z.string(),
    medium: z.string(),
    large: z.string(),
  }),
});

// Infer the type from the schema
export type ProductFormData = z.infer<typeof productFormSchema>;

// Type for dynamic pricing
export type DynamicPricing = ProductFormData["dynamicPricing"][number];

// Type for variations
export type Variation = ProductFormData["variations"][number];

// Type for featured image
export type FeaturedImage = ProductFormData["featuredImage"];
