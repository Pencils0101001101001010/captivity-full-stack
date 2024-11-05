"use client";

import { useCallback } from "react";
import { fetchAllRoleCounts } from "../admin/users/actions";
import { fetchSummerCollectionTable } from "../admin/products/summer/actions";
import { fetchFashionCollectionTable } from "../admin/products/fashion/actions";
import { fetchIndustrialCollectionTable } from "../admin/products/industrial/actions";
import { fetchKidsCollectionTable } from "../admin/products/kids/actions";
import { fetchAfricanCollectionTable } from "../admin/products/african/actions";
import { fetchLeisureCollectionTable } from "../admin/products/leisure/actions";
import { fetchSignatureCollectionTable } from "../admin/products/signature/actions";
import { fetchSportCollectionTable } from "../admin/products/sport/actions";
import { fetchCamoCollectionTable } from "../admin/products/camo/actions";
import { fetchBaseballCollectionTable } from "../admin/products/baseball/actions";
import { Collections, UserCounts } from "./counts";

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const CACHE_KEY = "admin-menu-cache";

// Global promise to track ongoing fetches
let currentFetchPromise: Promise<void> | null = null;

// Load cache from localStorage
const loadCacheFromStorage = () => {
  try {
    const stored = localStorage.getItem(CACHE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Date.now() - parsed.lastFetched < CACHE_DURATION) {
        return parsed;
      }
    }
  } catch (error) {
    console.error("Error loading cache:", error);
  }
  return { data: null, lastFetched: 0 };
};

// Shared cache with persistence
const cache = loadCacheFromStorage();

const collectionFetchers = {
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

export function useLoadCounts(
  setUserCounts: (counts: UserCounts) => void,
  setCollections: (collections: Collections) => void,
  setIsLoading: (loading: boolean) => void
) {
  return useCallback(
    async (force = false) => {
      const now = Date.now();

      // Check cache first
      if (!force && cache.data && now - cache.lastFetched < CACHE_DURATION) {
        setUserCounts(cache.data.userCounts);
        setCollections(cache.data.collections);
        setIsLoading(false);
        return;
      }

      // If there's already a fetch in progress, wait for it
      if (currentFetchPromise) {
        await currentFetchPromise;
        if (cache.data) {
          setUserCounts(cache.data.userCounts);
          setCollections(cache.data.collections);
        }
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      // Create new fetch promise
      currentFetchPromise = (async () => {
        try {
          // Fetch all data in parallel
          const [userResult, ...collectionResults] = await Promise.all([
            fetchAllRoleCounts(),
            ...Object.values(collectionFetchers).map(fetch => fetch()),
          ]);

          const newCollections: Collections = {};
          const collectionKeys = Object.keys(collectionFetchers);

          // Process collection results
          collectionResults.forEach((result, index) => {
            if (result?.success) {
              const key = collectionKeys[index];
              newCollections[key] = {
                totalCount: result.totalCount,
                publishedCount: result.publishedCount,
                unpublishedCount: result.unpublishedCount,
              };
            }
          });

          // Update cache and state only if fetch was successful
          if (userResult.success) {
            cache.data = {
              userCounts: userResult.counts,
              collections: newCollections,
            };
            cache.lastFetched = now;

            // Save to localStorage
            localStorage.setItem(CACHE_KEY, JSON.stringify(cache));

            setUserCounts(userResult.counts);
            setCollections(newCollections);
          }
        } catch (error) {
          console.error("Error loading counts:", error);
        } finally {
          currentFetchPromise = null;
          setIsLoading(false);
        }
      })();

      await currentFetchPromise;
    },
    [setUserCounts, setCollections, setIsLoading]
  );
}
