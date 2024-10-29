export interface DynamicPricing {
  from: string;
  to: string;
  type: string;
  amount: string;
}

export interface Variation {
  name: string;
  color: string;
  size: string;
  sku: string;
  sku2: string;
  variationImageURL: string;
  quantity: number;
}

export interface FeaturedImage {
  thumbnail: string;
  medium: string;
  large: string;
}

export interface ProductFormData {
  productName: string;
  category: string[];
  description: string;
  sellingPrice: number;
  isPublished: boolean;
  dynamicPricing: DynamicPricing[];
  variations: Variation[];
  featuredImage: FeaturedImage;
}
