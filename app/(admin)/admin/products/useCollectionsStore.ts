import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import {
  fetchAllCollections,
  toggleProductPublishStatus,
  type FetchCollectionsResult,
} from "./actions";

interface FeaturedImage {
  thumbnail: string;
  medium: string;
  large: string;
}

interface Product {
  id: string;
  productName: string;
  category: string[];
  description: string;
  sellingPrice: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  featuredImage?: FeaturedImage | null;
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
  lastFetched: number | null;
  fetchCollections: () => Promise<void>;
  toggleProductStatus: (productId: string) => Promise<boolean>;
  updateProductInCollections: (productId: string, isPublished: boolean) => void;
}

const FETCH_COOLDOWN = 60000; // 1 minute cooldown

export const useCollectionsStore = create<CollectionsState>()(
  devtools(
    persist(
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
        lastFetched: null,

        fetchCollections: async () => {
          const now = Date.now();
          const lastFetched = get().lastFetched;

          // If data was fetched recently, don't fetch again
          if (lastFetched && now - lastFetched < FETCH_COOLDOWN) {
            return;
          }

          set({ isLoading: true, error: null });
          try {
            const response = await fetchAllCollections();
            if (response.success) {
              set({
                collections: response.collections,
                counts: response.counts,
                isLoading: false,
                lastFetched: now,
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

        updateProductInCollections: (
          productId: string,
          isPublished: boolean
        ) => {
          set(state => {
            const newCollections = { ...state.collections };
            Object.keys(newCollections).forEach(key => {
              newCollections[key as keyof typeof newCollections] =
                newCollections[key as keyof typeof newCollections].map(
                  product =>
                    product.id === productId
                      ? { ...product, isPublished }
                      : product
                );
            });

            return {
              collections: newCollections,
              counts: Object.entries(newCollections).reduce(
                (acc, [key, products]) => ({
                  ...acc,
                  [key]: products.length,
                }),
                {} as CollectionsState["counts"]
              ),
            };
          });
        },
      }),
      {
        name: "collections-store",
        partialize: state => ({
          collections: state.collections,
          counts: state.counts,
          lastFetched: state.lastFetched,
        }),
      }
    ),
    {
      name: "collections-store",
    }
  )
);
