import { Variation } from "@prisma/client";

export interface AddToCartButtonProps {
  selectedVariation: Variation | null;
  quantity: number;
  disabled: boolean;
}

export interface CartItem {
  id: string;
  quantity: number;
  variation: Variation;
}

export interface Cart {
  id: string;
  userId: string;
  cartItems: CartItem[];
  createdAt: Date;
  updatedAt: Date;
}
