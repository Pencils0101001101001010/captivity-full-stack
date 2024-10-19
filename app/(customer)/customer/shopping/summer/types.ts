type Product = {
  id: number;
  productName: string;
  category: string[];
  description: string;
  sellingPrice: number;
  isPublished: boolean;
  dynamicPricing: {
    id: number;
    from: string;
    to: string;
    type: string;
    amount: string;
    productId: number;
  }[];
  variations: {
    id: number;
    name: string;
    color: string;
    size: string;
    sku: string;
    sku2: string;
    variationImageURL: string;
    quantity: number;
    productId: number;
  }[];
  featuredImage: {
    id: number;
    thumbnail: string;
    medium: string;
    large: string;
    productId: number;
  } | null;
};

type FetchSummerCollectionResult =
  | { success: true; data: Product[] }
  | { success: false; error: string };

type SummerCollectionHookResult = {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
};
