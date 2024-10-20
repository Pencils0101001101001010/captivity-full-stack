// types.ts

export type Variation = {
  id: number;
  name: string;
  color: string;
  size: string;
  sku: string;
  sku2: string;
  variationImageURL: string;
  quantity: number;
  productId: number;
  product: {
    id: number;
    productName: string;
    sellingPrice: number;
  };
};

export type FeaturedImage = {
  id: number;
  thumbnail: string;
  medium: string;
  large: string;
  productId: number;
};

export type DynamicPricing = {
  id: number;
  from: string;
  to: string;
  type: string;
  amount: string;
  productId: number;
};

export type Product = {
  id: number;
  productName: string;
  category: string[];
  description: string;
  sellingPrice: number;
  isPublished: boolean;
  dynamicPricing: DynamicPricing[];
  variations: Variation[];
  featuredImage: FeaturedImage | null;
};

export type CartItem = {
  id: number;
  quantity: number;
  variation: Variation;
};

export type AddToCartResult =
  | { success: true; message: string }
  | { success: false; error: string };

export type FetchCartResult =
  | { success: true; data: { cartItems: CartItem[]; totalCost: number } }
  | { success: false; error: string };

export type UpdateCartItemQuantityResult =
  | {
      success: true;
      message: string;
      newQuantity: number;
      newTotalCost: number;
    }
  | { success: false; error: string };

export type DeleteCartItemResult =
  | { success: true; message: string }
  | { success: false; error: string };
