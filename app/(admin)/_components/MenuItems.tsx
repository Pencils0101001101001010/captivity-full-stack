"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
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

// Types
type MenuLink = {
  name: string;
  href: string;
  count?: number;
};

type MenuItem = {
  title: string;
  links: MenuLink[];
};

type UserCounts = {
  pendingApproval: number;
  customers: number;
  subscribers: number;
  promo: number;
  distributors: number;
  shopManagers: number;
  editors: number;
};

type CollectionCounts = {
  totalCount: number;
  publishedCount: number;
  unpublishedCount: number;
};

type Collections = {
  [key: string]: CollectionCounts;
};

const INITIAL_USER_COUNTS: UserCounts = {
  pendingApproval: 0,
  customers: 0,
  subscribers: 0,
  promo: 0,
  distributors: 0,
  shopManagers: 0,
  editors: 0,
};

const INITIAL_COLLECTIONS: Collections = {
  summer: { totalCount: 0, publishedCount: 0, unpublishedCount: 0 },
  fashion: { totalCount: 0, publishedCount: 0, unpublishedCount: 0 },
  industrial: { totalCount: 0, publishedCount: 0, unpublishedCount: 0 },
  kids: { totalCount: 0, publishedCount: 0, unpublishedCount: 0 },
  african: { totalCount: 0, publishedCount: 0, unpublishedCount: 0 },
  leisure: { totalCount: 0, publishedCount: 0, unpublishedCount: 0 },
  signature: { totalCount: 0, publishedCount: 0, unpublishedCount: 0 },
  sport: { totalCount: 0, publishedCount: 0, unpublishedCount: 0 },
  winter: { totalCount: 0, publishedCount: 0, unpublishedCount: 0 },
  camo: { totalCount: 0, publishedCount: 0, unpublishedCount: 0 },
  baseball: { totalCount: 0, publishedCount: 0, unpublishedCount: 0 },
};

export function useMenuItems() {
  const [userCounts, setUserCounts] = useState<UserCounts>(INITIAL_USER_COUNTS);
  const [collections, setCollections] =
    useState<Collections>(INITIAL_COLLECTIONS);

  // Memoize the collection fetchers object
  const collectionFetchers = useMemo(
    () => ({
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
    }),
    []
  );

  // Memoize the loadCounts function
  const loadCounts = useCallback(async () => {
    try {
      const userResult = await fetchAllRoleCounts();
      if (userResult.success) {
        setUserCounts(userResult.counts);
      }

      const fetchPromises = Object.entries(collectionFetchers).map(
        async ([key, fetchFn]) => {
          try {
            const result = await fetchFn();
            if (result.success) {
              return [
                key,
                {
                  totalCount: result.totalCount,
                  publishedCount: result.publishedCount,
                  unpublishedCount: result.unpublishedCount,
                },
              ] as const;
            }
          } catch (error) {
            console.error(`Error fetching ${key} collection:`, error);
          }
          return null;
        }
      );

      const results = await Promise.all(fetchPromises);

      setCollections(prev => {
        const newCollections = { ...prev };
        results.forEach(result => {
          if (result) {
            const [key, counts] = result;
            newCollections[key] = counts;
          }
        });
        return newCollections;
      });
    } catch (error) {
      console.error("Error loading counts:", error);
    }
  }, [collectionFetchers]);

  // Set up the interval effect
  useEffect(() => {
    loadCounts();
    const interval = setInterval(loadCounts, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [loadCounts]);

  // Memoize the menuItems array
  const menuItems = useMemo<MenuItem[]>(
    () => [
      {
        title: "Users",
        links: [
          {
            name: "Pending Approval",
            href: "/admin/users/update/role-user",
            count: userCounts.pendingApproval,
          },
          {
            name: "Customers",
            href: "/admin/users/update/role-customer",
            count: userCounts.customers,
          },
          {
            name: "Subscribers",
            href: "/admin/users/subscribers",
            count: userCounts.subscribers,
          },
          {
            name: "Promo Users",
            href: "/admin/users/promo",
            count: userCounts.promo,
          },
          {
            name: "Distributors",
            href: "/admin/users/update/role-distributors",
            count: userCounts.distributors,
          },
          {
            name: "Shop Managers",
            href: "/admin/users/shop-managers",
            count: userCounts.shopManagers,
          },
          {
            name: "Editors",
            href: "/admin/users/editors",
            count: userCounts.editors,
          },
        ],
      },
      {
        title: "Products",
        links: [
          {
            name: "African",
            href: "/admin/products/african",
            count: collections.african.totalCount,
          },
          {
            name: "Fashion",
            href: "/admin/products/fashion",
            count: collections.fashion.totalCount,
          },
          {
            name: "Industrial",
            href: "/admin/products/industrial",
            count: collections.industrial.totalCount,
          },
          {
            name: "Kid's",
            href: "/admin/products/kids",
            count: collections.kids.totalCount,
          },
          {
            name: "Summer",
            href: "/admin/products/summer",
            count: collections.summer.totalCount,
          },
          {
            name: "Winter",
            href: "/admin/products/winter",
            count: collections.winter.totalCount,
          },
          {
            name: "Signature",
            href: "/admin/products/signature",
            count: collections.signature.totalCount,
          },
          {
            name: "Camo",
            href: "/admin/products/camo",
            count: collections.camo.totalCount,
          },
          {
            name: "Leisure",
            href: "/admin/products/leisure",
            count: collections.leisure.totalCount,
          },
          {
            name: "Sport",
            href: "/admin/products/sport",
            count: collections.sport.totalCount,
          },
          {
            name: "Baseball",
            href: "/admin/products/baseball",
            count: collections.baseball.totalCount,
          },
          { name: "Add Product", href: "/admin/products/create" },
        ],
      },
      {
        title: "Categories",
        links: [
          { name: "Headwear", href: "/admin/categories/headwear" },
          { name: "Apparel", href: "/admin/categories/apparel" },
          {
            name: "All-Collections",
            href: "/admin/categories/all-collections",
          },
          { name: "Un-Categorized", href: "/admin/categories/no-categories" },
        ],
      },
      {
        title: "Orders",
        links: [
          { name: "All Orders", href: "/admin/orders" },
          { name: "Pending Orders", href: "/admin/orders/pending" },
        ],
      },
      {
        title: "Customers",
        links: [
          { name: "All Customers", href: "/admin/customers" },
          { name: "Customer Groups", href: "/admin/customers/groups" },
        ],
      },
      {
        title: "Marketing",
        links: [
          { name: "Promotions", href: "/admin/marketing/promotions" },
          { name: "Discounts", href: "/admin/marketing/discounts" },
        ],
      },
      {
        title: "Settings",
        links: [
          { name: "General", href: "/admin/settings" },
          { name: "Security", href: "/admin/settings/security" },
        ],
      },
      {
        title: "Reports",
        links: [
          { name: "Sales Report", href: "/admin/reports/sales" },
          { name: "Inventory Report", href: "/admin/reports/inventory" },
        ],
      },
    ],
    [userCounts, collections] // Only recreate when these dependencies change
  );

  return menuItems;
}

export type { MenuItem, MenuLink };
