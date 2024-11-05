"use client";

import { useState, useEffect, useMemo } from "react";
import { Collections, UserCounts } from "./counts";
import {
  CACHE_DURATION,
  INITIAL_COLLECTIONS,
  INITIAL_USER_COUNTS,
} from "./initial-states";
import { useLoadCounts } from "./useLoadCounts";

const CACHE_KEY = "admin-menu-cache";

// Ensure all collection properties exist
const ensureCollections = (collections: Collections): Collections => {
  const required = [
    "african",
    "fashion",
    "industrial",
    "kids",
    "summer",
    "winter",
    "signature",
    "camo",
    "leisure",
    "sport",
    "baseball",
  ];

  const safeCollections = { ...collections };
  required.forEach(key => {
    if (!safeCollections[key]) {
      safeCollections[key] = {
        totalCount: 0,
        publishedCount: 0,
        unpublishedCount: 0,
      };
    }
  });

  return safeCollections;
};

// Load initial state from cache if available
const getInitialState = () => {
  try {
    const stored = localStorage.getItem(CACHE_KEY);
    if (stored) {
      const cache = JSON.parse(stored);
      if (Date.now() - cache.lastFetched < CACHE_DURATION) {
        return {
          userCounts: cache.data.userCounts,
          collections: ensureCollections(cache.data.collections),
          isLoading: false,
        };
      }
    }
  } catch (error) {
    console.error("Error loading initial state:", error);
  }
  return {
    userCounts: INITIAL_USER_COUNTS,
    collections: ensureCollections(INITIAL_COLLECTIONS),
    isLoading: true,
  };
};

export function useMenuItems() {
  const initialState = useMemo(getInitialState, []);

  const [userCounts, setUserCounts] = useState<UserCounts>(
    initialState.userCounts
  );
  const [collections, setCollections] = useState<Collections>(
    initialState.collections
  );
  const [isLoading, setIsLoading] = useState(initialState.isLoading);

  const loadCounts = useLoadCounts(
    setUserCounts,
    newCollections => setCollections(ensureCollections(newCollections)),
    setIsLoading
  );

  useEffect(() => {
    if (initialState.isLoading) {
      loadCounts();
    }
    const interval = setInterval(() => loadCounts(true), CACHE_DURATION);
    return () => clearInterval(interval);
  }, [loadCounts, initialState.isLoading]);

  // Ensure collections are safe before creating menu items
  const safeCollections = useMemo(
    () => ensureCollections(collections),
    [collections]
  );

  const menuItems = useMemo(
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
            count: safeCollections.african.totalCount,
          },
          {
            name: "Fashion",
            href: "/admin/products/fashion",
            count: safeCollections.fashion.totalCount,
          },
          {
            name: "Industrial",
            href: "/admin/products/industrial",
            count: safeCollections.industrial.totalCount,
          },
          {
            name: "Kid's",
            href: "/admin/products/kids",
            count: safeCollections.kids.totalCount,
          },
          {
            name: "Summer",
            href: "/admin/products/summer",
            count: safeCollections.summer.totalCount,
          },
          {
            name: "Winter",
            href: "/admin/products/winter",
            count: safeCollections.winter.totalCount,
          },
          {
            name: "Signature",
            href: "/admin/products/signature",
            count: safeCollections.signature.totalCount,
          },
          {
            name: "Camo",
            href: "/admin/products/camo",
            count: safeCollections.camo.totalCount,
          },
          {
            name: "Leisure",
            href: "/admin/products/leisure",
            count: safeCollections.leisure.totalCount,
          },
          {
            name: "Sport",
            href: "/admin/products/sport",
            count: safeCollections.sport.totalCount,
          },
          {
            name: "Baseball",
            href: "/admin/products/baseball",
            count: safeCollections.baseball.totalCount,
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
    [userCounts, safeCollections]
  );

  return { menuItems, isLoading };
}
