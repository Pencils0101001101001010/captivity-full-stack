"use client";

import { useEffect, useState } from "react";
import { fetchAllRoleCounts } from "../admin/users/actions";

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
  const [counts, setCounts] = useState({
    pendingApproval: 0,
    customers: 0,
    subscribers: 0,
    promo: 0,
    distributors: 0,
    shopManagers: 0,
    editors: 0,
  });

  useEffect(() => {
    const loadCounts = async () => {
      const result = await fetchAllRoleCounts();
      if (result.success) {
        setCounts(result.counts);
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
          count: counts.pendingApproval,
        },
        {
          name: "Customers",
          href: "/admin/users/update/role-customer",
          count: counts.customers,
        },
        {
          name: "Subscribers",
          href: "/admin/users/subscribers",
          count: counts.subscribers,
        },
        {
          name: "Promo Users",
          href: "/admin/users/promo",
          count: counts.promo,
        },
        {
          name: "Distributors",
          href: "/admin/users/update/role-distributors",
          count: counts.distributors,
        },
        {
          name: "Shop Managers",
          href: "/admin/users/shop-managers",
          count: counts.shopManagers,
        },
        {
          name: "Editors",
          href: "/admin/users/editors",
          count: counts.editors,
        },
      ],
    },
    {
      title: "Products",
      links: [
        { name: "All Products", href: "/admin/products" },
        { name: "Add Product", href: "/admin/products/add" },
      ],
    },
    {
      title: "Categories",
      links: [
        { name: "All Categories", href: "/admin/categories" },
        { name: "Add Category", href: "/admin/categories/add" },
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
