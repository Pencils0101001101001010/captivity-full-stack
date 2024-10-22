import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
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
  | "caps"
  | "uncategorised";

export type CategorizedProducts = {
  [key in Category]: ProductWithRelations[];
};

interface SummerState {
  summerProducts: CategorizedProducts;
  loading: boolean;
  error: string | null;
}

interface SummerActions {
  setSummerProducts: (products: CategorizedProducts) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchSummerCollection: () => Promise<void>;
}

const initialState: SummerState = {
  summerProducts: {
    men: [],
    women: [],
    kids: [],
    hats: [],
    golfers: [],
    bottoms: [],
    caps: [],
    uncategorised: [],
  },
  loading: false,
  error: null,
};

const useSummerStore = create<SummerState & SummerActions>()((set, get) => ({
  ...initialState,

  setSummerProducts: products => set({ summerProducts: products }),

  setLoading: loading => set({ loading }),

  setError: error => set({ error }),

  fetchSummerCollection: async () => {
    const { loading } = get();
    if (loading) return;

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

// Selector hooks using useShallow for complex objects
export const useSummerProducts = () =>
  useSummerStore(useShallow(state => state.summerProducts));

export const useSummerLoading = () => useSummerStore(state => state.loading);

export const useSummerError = () => useSummerStore(state => state.error);

// Group actions together with useShallow
export const useSummerActions = () =>
  useSummerStore(
    useShallow(state => ({
      setSummerProducts: state.setSummerProducts,
      setLoading: state.setLoading,
      setError: state.setError,
      fetchSummerCollection: state.fetchSummerCollection,
    }))
  );

export default useSummerStore;
