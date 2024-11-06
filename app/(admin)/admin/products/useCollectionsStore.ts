import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  fetchAllCollections,
  toggleProductPublishStatus,
  type FetchCollectionsResult,
} from "./actions";

interface Product {
  id: string;
  productName: string;
  category: string[];
  description: string;
  sellingPrice: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface CollectionsState {
  collections: {
    winter: Product[];
    summer: Product[];
    camo: Product[];
    baseball: Product[];
    kids: Product[];
    signature: Product[];
    fashion: Product[];
    leisure: Product[];
    sport: Product[];
    african: Product[];
    industrial: Product[];
  };
  counts: {
    winter: number;
    summer: number;
    camo: number;
    baseball: number;
    kids: number;
    signature: number;
    fashion: number;
    leisure: number;
    sport: number;
    african: number;
    industrial: number;
  };
  isLoading: boolean;
  error: string | null;
  // Actions
  fetchCollections: () => Promise<void>;
  toggleProductStatus: (productId: string) => Promise<boolean>;
  updateProductInCollections: (productId: string, isPublished: boolean) => void;
}

export const useCollectionsStore = create<CollectionsState>()(
  devtools(
    (set, get) => ({
      collections: {
        winter: [],
        summer: [],
        camo: [],
        baseball: [],
        kids: [],
        signature: [],
        fashion: [],
        leisure: [],
        sport: [],
        african: [],
        industrial: [],
      },
      counts: {
        winter: 0,
        summer: 0,
        camo: 0,
        baseball: 0,
        kids: 0,
        signature: 0,
        fashion: 0,
        leisure: 0,
        sport: 0,
        african: 0,
        industrial: 0,
      },
      isLoading: false,
      error: null,

      fetchCollections: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetchAllCollections();
          if (response.success) {
            set({
              collections: response.collections,
              counts: response.counts,
              isLoading: false,
            });
          } else {
            set({ error: response.error, isLoading: false });
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

      toggleProductStatus: async (productId: string) => {
        try {
          const response = await toggleProductPublishStatus(productId);
          if (response.success) {
            get().updateProductInCollections(productId, response.isPublished);
            return true;
          }
          set({ error: response.error });
          return false;
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "An unexpected error occurred",
          });
          return false;
        }
      },

      updateProductInCollections: (productId: string, isPublished: boolean) => {
        const collections = get().collections;
        const updatedCollections = Object.entries(collections).reduce(
          (acc, [key, products]) => ({
            ...acc,
            [key]: products.map(product =>
              product.id === productId ? { ...product, isPublished } : product
            ),
          }),
          {} as CollectionsState["collections"]
        );

        // Update counts
        const updatedCounts = Object.entries(updatedCollections).reduce(
          (acc, [key, products]) => ({
            ...acc,
            [key]: products.length,
          }),
          {} as CollectionsState["counts"]
        );

        set({
          collections: updatedCollections,
          counts: updatedCounts,
        });
      },
    }),
    {
      name: "collections-store",
    }
  )
);
