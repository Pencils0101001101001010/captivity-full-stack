// types/productTypes.ts

export type FeaturedImage = {
  id: number;
  thumbnail: string;
  medium: string;
  large: string;
  productId: number;
};

export type ProductWithFeaturedImage = {
  id: number;
  productName: string;
  category: string[];
  sellingPrice: number;
  featuredImage: FeaturedImage | null;
};
