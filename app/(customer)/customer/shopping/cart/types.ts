// types.ts

export type Variation = {
  id: number;
  name: string;
  color: string;
  size: string;
  sku: string;
  variationImageURL: string;
  quantity: number;
  product: {
    id: number;
    productName: string;
    sellingPrice: number;
  };
};

export type CartItem = {
  id: number;
  quantity: number;
  variation: Variation;
};

export type FetchCartResult =
  | { success: true; data: { cartItems: CartItem[]; totalCost: number } }
  | { success: false; error: string };

export type AddToCartResult =
  | { success: true; message: string }
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

export type User = {
  id: string;
  role: string;
};

export type ValidateRequestResult = {
  user: User | null;
};
