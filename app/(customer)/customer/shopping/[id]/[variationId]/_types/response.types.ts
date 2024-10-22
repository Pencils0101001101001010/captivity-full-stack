import { Variation } from "@prisma/client";
import { VariationWithRelations, ProductAndVariation } from "..";
import { ProductWithRelations } from "./product.types";

// Generic success/error response type
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

// Specific response types
export type FetchProductResult = ApiResponse<ProductWithRelations>;

export type FetchVariationResult = ApiResponse<VariationWithRelations>;

export type FetchProductAndVariationResult = ApiResponse<ProductAndVariation>;

export type FetchVariationsResult = ApiResponse<Variation[]>;
