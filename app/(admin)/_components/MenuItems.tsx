"use client";

import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { fetchAllRoleCounts } from "../admin/users/actions";
import { fetchAfricanCollectionTable } from "../admin/products/african/actions";

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
  african: CollectionCounts;
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
  african: { totalCount: 0, publishedCount: 0, unpublishedCount: 0 },
};

// Constants outside component to prevent recreation
const TWO_HOURS = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
const MINIMUM_FETCH_INTERVAL = 10000; // 10 seconds minimum between manual refreshes

export function useMenuItems() {
  const [userCounts, setUserCounts] = useState<UserCounts>(INITIAL_USER_COUNTS);
  const [collections, setCollections] =
    useState<Collections>(INITIAL_COLLECTIONS);
  const lastFetchTime = useRef<number>(0);
  const isMounted = useRef(true);
  const fetchPromiseRef = useRef<Promise<void> | null>(null);
  const hasInitialized = useRef(false);

  const loadCounts = useCallback(async (forceRefresh = false) => {
    const now = Date.now();
    const timeSinceLastFetch = now - lastFetchTime.current;

    // Skip if:
    // 1. Already fetching
    // 2. Not mounted
    // 3. Not enough time has passed and not forcing refresh
    if (
      fetchPromiseRef.current ||
      !isMounted.current ||
      (!forceRefresh && timeSinceLastFetch < MINIMUM_FETCH_INTERVAL)
    ) {
      return;
    }

    lastFetchTime.current = now;

    try {
      // Fetch user counts
      const userResult = await fetchAllRoleCounts();
      if (!isMounted.current) return;

      if (userResult.success) {
        setUserCounts(prev =>
          JSON.stringify(prev) !== JSON.stringify(userResult.counts)
            ? userResult.counts
            : prev
        );
      }

      // Only fetch African collection if it hasn't been initialized or forcing refresh
      if (!hasInitialized.current || forceRefresh) {
        const africanResult = await fetchAfricanCollectionTable();
        if (!isMounted.current) return;

        if (africanResult.success) {
          setCollections(prev => {
            const newCounts = {
              totalCount: africanResult.totalCount,
              publishedCount: africanResult.publishedCount,
              unpublishedCount: africanResult.unpublishedCount,
            };

            if (JSON.stringify(prev.african) !== JSON.stringify(newCounts)) {
              return {
                ...prev,
                african: newCounts,
              };
            }
            return prev;
          });
        }
        hasInitialized.current = true;
      }
    } catch (error) {
      console.error("Error loading counts:", error);
    } finally {
      fetchPromiseRef.current = null;
    }
  }, []); // Empty dependency array since all used values are refs or constants

  // Effect for initial load and interval setup
  useEffect(() => {
    // Reset mounted state
    isMounted.current = true;
    hasInitialized.current = false;

    // Initial load
    loadCounts(true);

    // Set up interval for refreshes
    const intervalId = setInterval(() => {
      loadCounts(true);
    }, TWO_HOURS);

    // Cleanup function
    return () => {
      isMounted.current = false;
      clearInterval(intervalId);
      fetchPromiseRef.current = null;
    };
  }, [loadCounts]); // loadCounts is stable and won't change

  // Memoized menu items
  return useMemo<MenuItem[]>(
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
          { name: "Processing Orders", href: "/admin/orders/processing" },
          { name: "Completed Orders", href: "/admin/orders/completed" },
          { name: "Cancelled Orders", href: "/admin/orders/cancelled" },
          { name: "Returns", href: "/admin/orders/returns" },
        ],
      },
      {
        title: "Customers",
        links: [
          { name: "All Customers", href: "/admin/customers" },
          { name: "Customer Groups", href: "/admin/customers/groups" },
          { name: "Customer Reviews", href: "/admin/customers/reviews" },
          { name: "Loyalty Program", href: "/admin/customers/loyalty" },
        ],
      },
      {
        title: "Marketing",
        links: [
          { name: "Promotions", href: "/admin/marketing/promotions" },
          { name: "Discounts", href: "/admin/marketing/discounts" },
          { name: "Coupons", href: "/admin/marketing/coupons" },
          { name: "Email Campaigns", href: "/admin/marketing/email" },
          { name: "Social Media", href: "/admin/marketing/social" },
          { name: "Analytics", href: "/admin/marketing/analytics" },
        ],
      },
      {
        title: "Settings",
        links: [
          { name: "General", href: "/admin/settings" },
          { name: "Security", href: "/admin/settings/security" },
          { name: "Shipping", href: "/admin/settings/shipping" },
          { name: "Payment", href: "/admin/settings/payment" },
          { name: "Taxes", href: "/admin/settings/taxes" },
          { name: "Notifications", href: "/admin/settings/notifications" },
          { name: "API", href: "/admin/settings/api" },
        ],
      },
      {
        title: "Reports",
        links: [
          { name: "Sales Report", href: "/admin/reports/sales" },
          { name: "Inventory Report", href: "/admin/reports/inventory" },
          { name: "Customer Report", href: "/admin/reports/customers" },
          { name: "Financial Report", href: "/admin/reports/financial" },
          { name: "Marketing Report", href: "/admin/reports/marketing" },
          { name: "Export Data", href: "/admin/reports/export" },
        ],
      },
      {
        title: "Help & Support",
        links: [
          { name: "Documentation", href: "/admin/help/docs" },
          { name: "FAQs", href: "/admin/help/faqs" },
          { name: "Contact Support", href: "/admin/help/support" },
          { name: "System Status", href: "/admin/help/status" },
        ],
      },
    ],
    [userCounts, collections]
  );
}

export type { MenuItem, MenuLink };
