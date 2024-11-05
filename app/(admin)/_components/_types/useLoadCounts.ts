"use client";

import { useCallback } from "react";
import { fetchAllRoleCounts } from "../../admin/users/actions";
import { fetchSummerCollectionTable } from "../../admin/products/summer/actions";
import { fetchFashionCollectionTable } from "../../admin/products/fashion/actions";
import { fetchIndustrialCollectionTable } from "../../admin/products/industrial/actions";
import { fetchKidsCollectionTable } from "../../admin/products/kids/actions";
import { fetchAfricanCollectionTable } from "../../admin/products/african/actions";
import { fetchLeisureCollectionTable } from "../../admin/products/leisure/actions";
import { fetchSignatureCollectionTable } from "../../admin/products/signature/actions";
import { fetchSportCollectionTable } from "../../admin/products/sport/actions";
import { fetchCamoCollectionTable } from "../../admin/products/camo/actions";
import { fetchBaseballCollectionTable } from "../../admin/products/baseball/actions";
import { Collections, UserCounts } from "./counts";

// Add proper type for the API responses
type CollectionResponse =
  | {
      success: true;
      data: any[];
      totalCount: number;
      publishedCount: number;
      unpublishedCount: number;
    }
  | {
      success: false;
      error?: string;
    };

const CACHE_KEY = "admin-menu-cache";
const CACHE_DURATION = 60 * 60 * 1000;

let fetchPromise: Promise<void> | null = null;

const collectionFetchers: Record<string, () => Promise<CollectionResponse>> = {
  summer: fetchSummerCollectionTable,
  fashion: fetchFashionCollectionTable,
  industrial: fetchIndustrialCollectionTable,
  kids: fetchKidsCollectionTable,
  african: fetchAfricanCollectionTable,
  leisure: fetchLeisureCollectionTable,
  signature: fetchSignatureCollectionTable,
  sport: fetchSportCollectionTable,
  camo: fetchCamoCollectionTable,
  baseball: fetchBaseballCollectionTable,
};

const loadFromCache = () => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsedCache = JSON.parse(cached);
      if (Date.now() - parsedCache.timestamp < CACHE_DURATION) {
        return parsedCache.data;
      }
    }
  } catch (error) {
    console.error("Error loading from cache:", error);
  }
  return null;
};

const saveToCache = (data: {
  userCounts: UserCounts;
  collections: Collections;
}) => {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        data,
        timestamp: Date.now(),
      })
    );
  } catch (error) {
    console.error("Error saving to cache:", error);
  }
};

export function useLoadCounts(
  setUserCounts: (counts: UserCounts) => void,
  setCollections: (collections: Collections) => void,
  setIsLoading: (loading: boolean) => void
) {
  return useCallback(
    async (force = false) => {
      // Try to load from cache first
      if (!force) {
        const cachedData = loadFromCache();
        if (cachedData) {
          setUserCounts(cachedData.userCounts);
          setCollections(cachedData.collections);
          setIsLoading(false);
          return;
        }
      }

      // If a fetch is already in progress, wait for it
      if (fetchPromise) {
        await fetchPromise;
        return;
      }

      setIsLoading(true);

      // Create the fetch promise
      fetchPromise = (async () => {
        try {
          // Batch all fetches together
          const results = await Promise.all([
            fetchAllRoleCounts(),
            ...Object.entries(collectionFetchers).map(([key, fetcher]) =>
              fetcher().catch(error => {
                console.error(`Error fetching ${key}:`, error);
                return { success: false } as CollectionResponse;
              })
            ),
          ]);

          const [userResult, ...collectionResults] = results;

          if (!userResult.success) {
            throw new Error("Failed to fetch user counts");
          }

          const newCollections: Collections = {};
          Object.keys(collectionFetchers).forEach((key, index) => {
            const result = collectionResults[index] as CollectionResponse;
            newCollections[key] = {
              totalCount: result.success ? result.totalCount : 0,
              publishedCount: result.success ? result.publishedCount : 0,
              unpublishedCount: result.success ? result.unpublishedCount : 0,
            };
          });

          const data = {
            userCounts: userResult.counts,
            collections: newCollections,
          };

          // Save to cache
          saveToCache(data);

          // Update state
          setUserCounts(data.userCounts);
          setCollections(data.collections);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setIsLoading(false);
          fetchPromise = null;
        }
      })();

      await fetchPromise;
    },
    [setUserCounts, setCollections, setIsLoading]
  );
}
