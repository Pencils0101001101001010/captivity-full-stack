import { create } from "zustand";
import { fetchVendorCollections } from "../actions";

interface Product {
  id: string;
  productName: string;
  category: string[];
  description: string;
  sellingPrice: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  featuredImage?: {
    id: string;
    thumbnail: string;
    medium: string;
    large: string;
    vendorProductId: string;
  } | null;
}

interface Collections {
  african: Product[];
  baseball: Product[];
  camo: Product[];
  fashion: Product[];
  industrial: Product[];
  kids: Product[];
  leisure: Product[];
  signature: Product[];
  sport: Product[];
  summer: Product[];
  winter: Product[];
}

interface CollectionCounts {
  african: number;
  baseball: number;
  camo: number;
  fashion: number;
  industrial: number;
  kids: number;
  leisure: number;
  signature: number;
  sport: number;
  summer: number;
  winter: number;
}

interface VendorCollectionsStore {
  collections: Collections | null;
  counts: CollectionCounts | null;
  isLoading: boolean;
  error: string | null;
  fetchCollections: () => Promise<void>;
}

export const useVendorCollectionsStore = create<VendorCollectionsStore>(
  set => ({
    collections: null,
    counts: null,
    isLoading: false,
    error: null,
    fetchCollections: async () => {
      try {
        set({ isLoading: true, error: null });
        const result = await fetchVendorCollections();

        if (result.success) {
          set({
            collections: result.collections,
            counts: result.counts,
            isLoading: false,
          });
        } else {
          set({
            error: result.error,
            isLoading: false,
          });
        }
      } catch (error) {
        set({
          error:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred",
          isLoading: false,
        });
      }
    },
  })
);
