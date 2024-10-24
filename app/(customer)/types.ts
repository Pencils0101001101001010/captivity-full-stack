// types.ts
import { OrderStatus } from "@prisma/client";

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  variation: {
    id: string;
    name: string;
    color: string;
    size: string;
    sku: string;
    sku2: string | null;
    variationImageURL: string | null;
  };
}

export interface Order {
  id: string;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  orderItems: OrderItem[];
}

export interface User {
  id: string;
  role:
    | "USER"
    | "CUSTOMER"
    | "SUBSCRIBER"
    | "PROMO"
    | "DISTRIBUTOR"
    | "SHOPMANAGER"
    | "EDITOR"
    | "ADMIN";
  isLoading?: boolean;
  orders?: Order[];
}

export interface ActionResponse<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}
