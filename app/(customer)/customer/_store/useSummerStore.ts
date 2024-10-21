import { create } from "zustand";
import {
  Product,
  DynamicPricing,
  Variation,
  FeaturedImage,
} from "@prisma/client";
import { fetchSummerCollection } from "../shopping/summer/actions";

export type ProductWithRelations = Product & {
  dynamicPricing: DynamicPricing[];
  variations: Variation[];
  featuredImage: FeaturedImage | null;
};

export type Category =
  | "men"
  | "women"
  | "kids"
  | "hats"
  | "golfers"
  | "bottoms"
  | "caps";

export type CategorizedProducts = {
  [key in Category]: ProductWithRelations[];
};

interface SummerStoreState {
  summerProducts: CategorizedProducts;
  loading: boolean;
  error: string | null;

  setSummerProducts: (products: CategorizedProducts) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchSummerCollection: () => Promise<void>;
}

const useSummerStore = create<SummerStoreState>((set, get) => ({
  summerProducts: {
    men: [],
    women: [],
    kids: [],
    hats: [],
    golfers: [],
    bottoms: [],
    caps: [],
  },
  loading: false,
  error: null,

  setSummerProducts: products => set({ summerProducts: products }),
  setLoading: loading => set({ loading }),
  setError: error => set({ error }),
  fetchSummerCollection: async () => {
    const { loading } = get();
    if (loading) return; // Prevent multiple simultaneous fetches

    set({ loading: true, error: null });
    try {
      const result = await fetchSummerCollection();
      if (result.success) {
        set({ summerProducts: result.data, loading: false });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
}));

export default useSummerStore;
