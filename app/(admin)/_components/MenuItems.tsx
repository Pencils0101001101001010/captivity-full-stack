"use client";

import { useEffect, useState } from "react";
import { fetchAllRoleCounts } from "../admin/users/actions";
import { fetchSummerCollectionTable } from "../admin/products/summer/actions";
import { fetchFashionCollectionTable } from "../admin/products/fashion/actions";
import { fetchIndustrialCollectionTable } from "../admin/products/industrial/actions";
import { fetchKidsCollectionTable } from "../admin/products/kids/actions";
import { fetchAfricanCollectionTable } from "../admin/products/african/actions";
import { fetchLeisureCollectionTable } from "../admin/products/leisure/actions";
import { fetchSignatureCollectionTable } from "../admin/products/signature/actions";
import { fetchSportCollectionTable } from "../admin/products/sport/actions";
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

  const [fashionCounts, setFashionCounts] = useState({
    totalCount: 0,
    publishedCount: 0,
    unpublishedCount: 0,
  });

  const [industrialCounts, setIndustrialCounts] = useState({
    totalCount: 0,
    publishedCount: 0,
    unpublishedCount: 0,
  });

  const [kidsCounts, setKidsCounts] = useState({
    totalCount: 0,
    publishedCount: 0,
    unpublishedCount: 0,
  });

  const [africanCounts, setAfricanCounts] = useState({
    totalCount: 0,
    publishedCount: 0,
    unpublishedCount: 0,
  });

  const [leisureCounts, setLeisureCounts] = useState({
    totalCount: 0,
    publishedCount: 0,
    unpublishedCount: 0,
  });
  const [signatureCounts, setSignatureCounts] = useState({
    totalCount: 0,
    publishedCount: 0,
    unpublishedCount: 0,
  });
  const [sportCounts, setSportCounts] = useState({
    totalCount: 0,
    publishedCount: 0,
    unpublishedCount: 0,
  });
  const [winterCounts, setWinterCounts] = useState({
    totalCount: 0,
    publishedCount: 0,
    unpublishedCount: 0,
  });
  const [camoCounts, setCamoCounts] = useState({
    totalCount: 0,
    publishedCount: 0,
    unpublishedCount: 0,
  });

  useEffect(() => {
    const loadCounts = async () => {
      try {
        const [
          userResult,
          summerResult,
          fashionResult,
          industrialResult,
          kidsResult,
          africanResult,
          leisureResult,
          signatureResult,
          sportResult,
        ] = await Promise.all([
          fetchAllRoleCounts(),
          fetchSummerCollectionTable(),
          fetchFashionCollectionTable(),
          fetchIndustrialCollectionTable(),
          fetchKidsCollectionTable(),
          fetchAfricanCollectionTable(),
          fetchLeisureCollectionTable(),
          fetchSignatureCollectionTable(),
          fetchSportCollectionTable(),
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
        if (fashionResult.success) {
          setFashionCounts({
            totalCount: fashionResult.totalCount,
            publishedCount: fashionResult.publishedCount,
            unpublishedCount: fashionResult.unpublishedCount,
          });
        }
        if (industrialResult.success) {
          setIndustrialCounts({
            totalCount: industrialResult.totalCount,
            publishedCount: industrialResult.publishedCount,
            unpublishedCount: industrialResult.unpublishedCount,
          });
        }
        if (kidsResult.success) {
          setKidsCounts({
            totalCount: kidsResult.totalCount,
            publishedCount: kidsResult.publishedCount,
            unpublishedCount: kidsResult.unpublishedCount,
          });
        }
        if (africanResult.success) {
          setAfricanCounts({
            totalCount: africanResult.totalCount,
            publishedCount: africanResult.publishedCount,
            unpublishedCount: africanResult.unpublishedCount,
          });
        }
        if (leisureResult.success) {
          setLeisureCounts({
            totalCount: leisureResult.totalCount,
            publishedCount: leisureResult.publishedCount,
            unpublishedCount: leisureResult.unpublishedCount,
          });
        }
        if (signatureResult.success) {
          setSignatureCounts({
            totalCount: signatureResult.totalCount,
            publishedCount: signatureResult.publishedCount,
            unpublishedCount: signatureResult.unpublishedCount,
          });
        }
        if (sportResult.success) {
          setSportCounts({
            totalCount: sportResult.totalCount,
            publishedCount: sportResult.publishedCount,
            unpublishedCount: sportResult.unpublishedCount,
          });
        }
      } catch (error) {
        console.error("Error loading counts:", error);
      }
    };

    loadCounts();
    const interval = setInterval(loadCounts, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  //     useEffect(() => {
  //     const loadCounts = async () => {
  //       const [userResult, fashionResult] = await Promise.all([
  //         fetchAllRoleCounts(),
  //         fetchFashionCollectionTable(),
  //         fetchIndustrialCollectionTable(),
  //         fetchKidsCollectionTable(),
  //         fetchAfricanCollectionTable(),
  //         fetchLeisureCollectionTable(),
  //         fetchSignatureCollectionTable(),
  //         fetchSportCollectionTable(),
  //         fetchSummerCollectionTable(),
  //       ]);

  //       if (userResult.success) {
  //         setUserCounts(userResult.counts);
  //       }
  //       if (fashionResult.success) {
  //         setFashionCounts({
  //           totalCount: fashionResult.totalCount,
  //           publishedCount: fashionResult.publishedCount,
  //           unpublishedCount: fashionResult.unpublishedCount,
  //         });
  //       }
  //     };

  //     loadCounts();
  //     const interval = setInterval(loadCounts, 5 * 60 * 1000);
  //     return () => clearInterval(interval);
  //   }, []);

  //     useEffect(() => {
  //     const loadCounts = async () => {
  //       const [userResult, industrialResult] = await Promise.all([
  //         fetchAllRoleCounts(),
  //         fetchIndustrialCollectionTable(),
  //       ]);

  //       if (userResult.success) {
  //         setUserCounts(userResult.counts);
  //       }
  //       if (industrialResult.success) {
  //         setIndustrialCounts({
  //           totalCount: industrialResult.totalCount,
  //           publishedCount: industrialResult.publishedCount,
  //           unpublishedCount: industrialResult.unpublishedCount,
  //         });
  //       }
  //     };

  //     loadCounts();
  //     const interval = setInterval(loadCounts, 5 * 60 * 1000);
  //     return () => clearInterval(interval);
  //   }, []);

  //   useEffect(() => {
  //     const loadCounts = async () => {
  //       const [userResult, kidsResult] = await Promise.all([
  //         fetchAllRoleCounts(),
  //         fetchKidsCollectionTable(),
  //       ]);

  //       if (userResult.success) {
  //         setUserCounts(userResult.counts);
  //       }
  //       if (kidsResult.success) {
  //         setIndustrialCounts({
  //           totalCount: kidsResult.totalCount,
  //           publishedCount: kidsResult.publishedCount,
  //           unpublishedCount: kidsResult.unpublishedCount,
  //         });
  //       }
  //     };

  //     loadCounts();
  //     const interval = setInterval(loadCounts, 5 * 60 * 1000);
  //     return () => clearInterval(interval);
  //   }, []);

  //   useEffect(() => {
  //   const loadCounts = async () => {
  //     const [userResult, africanResult] = await Promise.all([
  //       fetchAllRoleCounts(),
  //       fetchAfricanCollectionTable(),
  //     ]);

  //     if (userResult.success) {
  //       setUserCounts(userResult.counts);
  //     }
  //     if (africanResult.success) {
  //       setSummerCounts({
  //         totalCount: africanResult.totalCount,
  //         publishedCount: africanResult.publishedCount,
  //         unpublishedCount: africanResult.unpublishedCount,
  //       });
  //     }
  //     };
  //   loadCounts();
  //   const interval = setInterval(loadCounts, 5 * 60 * 1000);
  //   return () => clearInterval(interval);
  // }, []);

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
          name: "African",
          href: "/admin/products/african",
          count: africanCounts.totalCount,
        },
        {
          name: "Fashion",
          href: "/admin/products/fashion",
          count: fashionCounts.totalCount,
        },
        {
          name: "Industrial",
          href: "/admin/products/industrial",
          count: industrialCounts.totalCount,
        },
        {
          name: "Kid's",
          href: "/admin/products/kids",
          count: kidsCounts.totalCount,
        },
        {
          name: "Summer",
          href: "/admin/products/summer",
          count: summerCounts.totalCount,
        },
        {
          name: "Winter",
          href: "/admin/products/winter",
          count: winterCounts.totalCount,
        },
        {
          name: "Signature",
          href: "/admin/products/signature",
          count: signatureCounts.totalCount,
        },
        {
          name: "Camo",
          href: "/admin/products/camo",
          count: camoCounts.totalCount,
        },{
          name: "leisure",
          href: "/admin/products/leisure",
          count: leisureCounts.totalCount,
        },{
          name: "Sport",
          href: "/admin/products/sport",
          count: sportCounts.totalCount,
        },
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
