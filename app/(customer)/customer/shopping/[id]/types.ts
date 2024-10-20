// app/(customer)/customer/shopping/cart/types.ts

export type Product = {
  id: number;
  productName: string;
  sellingPrice: number;
  // Add other product properties as needed
};

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
  product: Product;
};

export type CartItem = {
  id: number;
  quantity: number;
  variation: Variation;
};

export type AddToCartResult =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      error: string;
    };

export type FetchCartResult =
  | {
      success: true;
      data: {
        cartItems: CartItem[];
        totalCost: number;
      };
    }
  | {
      success: false;
      error: string;
    };

export type UpdateCartItemQuantityResult =
  | {
      success: true;
      message: string;
      newQuantity: number;
      newTotalCost: number;
    }
  | {
      success: false;
      error: string;
    };

export type DeleteCartItemResult =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      error: string;
    };
