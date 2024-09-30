"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Home,
  FileText,
  Users,
  User,
  Truck,
  Building2,
  Shield,
  Settings,
  ChevronRight,
  Anchor,
  Eye,
  ChevronDown,
} from "lucide-react";

type NavItem = {
  href: string;
  icon: React.ElementType;
  label: string;
  subItems?: NavItem[];
};

type Section = {
  section: string;
  items: NavItem[];
};

const Sidebar = ({ className }: { className?: string }) => {
  const pathname = usePathname();
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>(
    {}
  );

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const navItems: Section[] = [
    {
      section: "USERS",
      items: [
        { href: "/admin/update/user-role", icon: Home, label: "UPDATE ROLES" },
      ],
    },
    {
      section: "PRODUCTS",
      items: [
        {
          href: "/admin/products",
          icon: FileText,
          label: "PRODUCTS",
          subItems: [
            {
              href: "/admin/products/headwear",
              icon: FileText,
              label: "HEADWEAR",
              subItems: [
                {
                  href: "/admin/products/headwear/leisure-collection",
                  icon: FileText,
                  label: "Leisure Collection",
                },
                {
                  href: "/admin/products/headwear/industrial-collection",
                  icon: FileText,
                  label: "Industrial Collection",
                },
                {
                  href: "/admin/products/headwear/signature-collection",
                  icon: FileText,
                  label: "Signature Collection",
                },
                {
                  href: "/admin/products/headwear/baseball-collection",
                  icon: FileText,
                  label: "Baseball Collection",
                },
                {
                  href: "/admin/products/headwear/fashion-collection",
                  icon: FileText,
                  label: "Fashion Collection",
                },
                {
                  href: "/admin/products/headwear/sport-collection",
                  icon: FileText,
                  label: "Sport Collection",
                },
                {
                  href: "/admin/products/headwear/multi-functional-collection",
                  icon: FileText,
                  label: "Multifunctional",
                },
                {
                  href: "/admin/products/headwear/new-in-headwear-collection",
                  icon: FileText,
                  label: "New in Headwear",
                },
                {
                  href: "/admin/products/headwear/african-collection",
                  icon: FileText,
                  label: "African Collection",
                },
              ],
            },
            {
              href: "/admin/products/apparel",
              icon: FileText,
              label: "Apparel Collection",
            },
            {
              href: "/admin/products/other",
              icon: FileText,
              label: "Other Category Collections",
            },
          ],
        },
      ],
    },
  ];

  const renderNavItem = (item: NavItem, depth = 0) => {
    const isActive = pathname ? pathname.startsWith(item.href) : false;
    const isOpen = openSections[item.label] || isActive;
    const hasSubItems = item.subItems && item.subItems.length > 0;

    return (
      <React.Fragment key={item.href}>
        <Link href={item.href} passHref>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start transition-colors duration-200",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              depth > 0 && `pl-[${depth * 1.5}rem]`
            )}
            onClick={(e) => {
              if (hasSubItems) {
                e.preventDefault();
                toggleSection(item.label);
              }
            }}
          >
            <div className="flex w-full items-center">
              <item.icon className="mr-3 h-4 w-4" />
              <span className="flex-grow text-sm">{item.label}</span>
              {hasSubItems && (
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    isOpen && "rotate-180"
                  )}
                />
              )}
            </div>
          </Button>
        </Link>
        {hasSubItems && isOpen && item.subItems && (
          <div
            className={cn(
              "mt-1 space-y-1",
              depth > 0 && "border-l border-accent pl-4"
            )}
          >
            {item.subItems.map((subItem) => renderNavItem(subItem, depth + 1))}
          </div>
        )}
      </React.Fragment>
    );
  };

  return (
    <div
      className={cn(
        "sticky top-[60px] flex h-screen w-64 flex-col bg-background p-4 shadow-md",
        className
      )}
    >
      <div className="mb-6 flex items-center">
        <svg
          className="mr-2 h-6 w-6 text-primary"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 4L4 8L12 12L20 8L12 4Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4 12L12 16L20 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4 16L12 20L20 16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <Link href="/admin" className="text-xl font-semibold text-primary">
          Admin
        </Link>
      </div>

      {navItems.map((section) => (
        <div key={section.section} className="mb-4">
          <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
            {section.section}
          </h3>
          <div className="space-y-1">
            {section.items.map((item) => renderNavItem(item))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
