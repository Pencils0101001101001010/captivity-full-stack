"use client";

import { useEffect, useState } from "react";
import { fetchAllRoleCounts } from "../admin/users/actions";
import { fetchSummerCollectionTable } from "../admin/products/summer/actions";
import { fetchFashionCollectionTable } from "../admin/products/fashion/actions";
type MenuLink = {
  name: string;
  href: string;
  count?: number;
};

type MenuItem = {
  title: string;
  links: MenuLink[];
};

export function useMenuItems() {
  const [userCounts, setUserCounts] = useState({
    pendingApproval: 0,
    customers: 0,
    subscribers: 0,
    promo: 0,
    distributors: 0,
    shopManagers: 0,
    editors: 0,
  });

  const [summerCounts, setSummerCounts] = useState({
    totalCount: 0,
    publishedCount: 0,
    unpublishedCount: 0,
  });

  useEffect(() => {
    const loadCounts = async () => {
      const [userResult, summerResult] = await Promise.all([
        fetchAllRoleCounts(),
        fetchSummerCollectionTable(),
      ]);

      if (userResult.success) {
        setUserCounts(userResult.counts);
      }
      if (summerResult.success) {
        setSummerCounts({
          totalCount: summerResult.totalCount,
          publishedCount: summerResult.publishedCount,
          unpublishedCount: summerResult.unpublishedCount,
        });
      }
    };

    loadCounts();
    const interval = setInterval(loadCounts, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const menuItems: MenuItem[] = [
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
          name: "Fashion",
          href: "/admin/products/fashion",
          count: summerCounts.totalCount
       },
        {
          name: "Summer",
          href: "/admin/products/summer",
          count: summerCounts.totalCount,
        },
        { name: "Winter", href: "/admin/products/winter" },
        { name: "Industrial", href: "/admin/products/industrial" },
        { name: "Signature", href: "/admin/products/signature" },
        { name: "Camo", href: "/admin/products/camo" },
        { name: "Add Product", href: "/admin/products/create" },
      ],
    },
    {
      title: "Categories",
      links: [
        { name: "Headwear", href: "/admin/categories/headwear" },
        { name: "Apparel", href: "/admin/categories/apparel" },
        { name: "All-Collections", href: "/admin/categories/all-collections" },
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
  ];

  return menuItems;
}

export type { MenuItem, MenuLink };
