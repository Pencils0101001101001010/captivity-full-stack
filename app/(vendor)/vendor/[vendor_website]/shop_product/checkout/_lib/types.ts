import { OrderStatus } from "@prisma/client";

export interface VendorCartItem {
  id: string;
  quantity: number;
  vendorVariation: {
    quantity: number;
    size: string;
    color: string;
    variationImageURL?: string;
    vendorProduct: {
      productName: string;
      sellingPrice: number;
      featuredImage?: {
        medium: string;
      };
      dynamicPricing: Array<{
        id: string;
        vendorProductId: string;
        from: string;
        to: string;
        type: string;
        amount: string;
      }>;
    };
  };
}

export interface VendorCart {
  vendorCartItems: VendorCartItem[];
}

export interface VendorOrderItem {
  id: string;
  quantity: number;
  price: number;
  vendorVariation: {
    size: string;
    color: string;
    variationImageURL?: string;
    vendorProduct: {
      productName: string;
      featuredImage?: {
        medium: string;
      };
    };
  };
}

export interface VendorOrder {
  id: string;
  status: OrderStatus;
  totalAmount: number;
  createdAt: Date;
  vendorOrderItems: VendorOrderItem[];
  vendorBranch: string;
  methodOfCollection: string;
  salesRep?: string;
  referenceNumber?: string;
  firstName: string;
  lastName: string;
  companyName: string;
  countryRegion: string;
  streetAddress: string;
  apartmentSuite?: string;
  townCity: string;
  province: string;
  postcode: string;
  phone: string;
  email: string;
  orderNotes?: string;
}

export interface VendorFormValues {
  vendorBranch: string;
  methodOfCollection: string;
  salesRep: string;
  referenceNumber: string;
  firstName: string;
  lastName: string;
  companyName: string;
  countryRegion: string;
  streetAddress: string;
  apartmentSuite: string;
  townCity: string;
  province: string;
  postcode: string;
  phone: string;
  email: string;
  orderNotes: string;
  agreeTerms: boolean;
  receiveEmailReviews: boolean;
}

export type VendorOrderActionResult = {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
};
