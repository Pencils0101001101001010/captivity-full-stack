type Product = {
  id: string;
  productName: string;
  category: string[];
  description: string;
  sellingPrice: number;
  isPublished: boolean;
  dynamicPricing: {
    id: string;
    from: string;
    to: string;
    type: string;
    amount: string;
    productId: string;
  }[];
  variations: {
    id: string;
    name: string;
    color: string;
    size: string;
    sku: string;
    sku2: string;
    variationImageURL: string;
    quantity: number;
    productId: string;
  }[];
  featuredImage: {
    id: string;
    thumbnail: string;
    medium: string;
    large: string;
    productId: string;
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
