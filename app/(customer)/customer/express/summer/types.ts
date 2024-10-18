// types/summerCollection.ts

import { UserRole } from "@prisma/client";

export type FeaturedImage = {
  thumbnail: string;
  medium: string;
  large: string;
};

export type Product = {
  id: number;
  productName: string;
  category: string[];
  description: string;
  sellingPrice: number;
  featuredImage: FeaturedImage | null;
};

export type FetchSummerCollectionResult =
  | { success: true; data: Product[] }
  | { success: false; error: string };

export type ValidatedUser = {
  id: string;
  role: UserRole;
};

export type FilteredCollection = {
  men: Product[];
  women: Product[];
  kids: Product[];
  unisex: Product[];
  hats: Product[];
  caps: Product[];
  tShirts: Product[];
};
