import { VendorProduct, VendorVariation } from "@prisma/client";
import { z } from "zod";
import { Control } from "react-hook-form";

// Define the DynamicPricing type
export interface VendorDynamicPricingRule {
  id: string;
  from: string;
  to: string;
  type: "fixed_price" | "percentage";
  amount: string;
  vendorProductId: string;
}

// Vendor product display types
export type VendorProductWithRelations = VendorProduct & {
  variations: VendorVariation[];
  featuredImage: { medium: string } | null;
  dynamicPricing: VendorDynamicPricingRule[];
};

export type VendorProductDetailsProps = {
  product: VendorProductWithRelations;
};

export type VendorAddToCartButtonProps = {
  selectedVariation: VendorVariation | null;
  quantity: number;
  disabled: boolean;
};

export type VendorColorSelectorProps = {
  colors: string[];
  selectedColor: string | undefined;
  variations: VendorVariation[];
  onColorSelect: (color: string) => void;
  productName: string;
};

export type VendorSizeSelectorProps = {
  sizes: string[];
  selectedSize: string | undefined;
  onSizeSelect: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

export type VendorQuantitySelectorProps = {
  quantity: number;
  maxQuantity: number;
  onQuantityChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export interface VendorProductImageProps {
  selectedVariation: VendorVariation | null;
  product: {
    id: string;
    productName: string;
    featuredImage: {
      thumbnail: string;
      medium: string;
      large: string;
    } | null;
    variations: Array<{
      id: string;
      color: string;
      variationImageURL: string;
    }>;
  };
  uniqueColors: string[];
  onColorSelect: (color: string) => void;
}

// Vendor product form schema
export const vendorProductFormSchema = z.object({
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
      variationImage: z.any().optional(),
      quantity: z.number().min(0, "Quantity cannot be negative"),
    })
  ),
  featuredImage: z.object({
    file: z.any().optional(),
    thumbnail: z.string(),
    medium: z.string(),
    large: z.string(),
  }),
});

export type VendorProductFormData = z.infer<typeof vendorProductFormSchema>;

export type VendorDynamicPricing =
  VendorProductFormData["dynamicPricing"][number];
export type VendorVariationFormData =
  VendorProductFormData["variations"][number];
export type VendorFeaturedImageFormData =
  VendorProductFormData["featuredImage"];

export interface VendorVariationTabProps {
  control: Control<VendorProductFormData>;
}

export interface VendorFeaturedImageTabProps {
  control: Control<VendorProductFormData>;
}

export interface VendorBasicInfoTabProps {
  control: Control<VendorProductFormData>;
}

export interface VendorDynamicPricingTabProps {
  control: Control<VendorProductFormData>;
}
