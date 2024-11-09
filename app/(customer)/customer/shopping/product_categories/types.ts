// Color filter schema

import {
  Product,
  DynamicPricing,
  FeaturedImage,
  Variation,
} from "@prisma/client";

export type ProductWithRelations = Product & {
  dynamicPricing: DynamicPricing[]; // Assuming a product has multiple dynamic pricing records
  featuredImage: FeaturedImage | null; // A product may or may not have a featured image
  variations: Variation[]; // A product can have multiple variations
};
export type UserRole =
  | "USER"
  | "CUSTOMER"
  | "SUBSCRIBER"
  | "PROMO"
  | "DISTRIBUTOR"
  | "SHOPMANAGER"
  | "EDITOR"
  | "ADMIN";

export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export interface User {
  id: string;
  wpId?: string;
  username: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  phoneNumber: string;
  streetAddress: string;
  townCity: string;
  postcode: string;
  country: string;
  companyName: string;
  role: UserRole;
  // Add other fields as needed
}
