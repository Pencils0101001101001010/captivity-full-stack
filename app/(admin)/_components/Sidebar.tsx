"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Home, FileText, ChevronDown } from "lucide-react";

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
  const [openSections, setOpenSections] = useState<string[]>([]);
  const [activeItems, setActiveItems] = useState<string[]>([]);

  useEffect(() => {
    const updateActiveItems = (items: NavItem[], parentPath: string = "") => {
      for (const item of items) {
        const fullPath = `${parentPath}${item.href}`;
        if (pathname?.startsWith(fullPath)) {
          setActiveItems((prev) => [...new Set([...prev, fullPath])]);
          setOpenSections((prev) => [...new Set([...prev, item.label])]);

          if (item.subItems) {
            updateActiveItems(item.subItems, fullPath);
          }
        }
      }
    };

    setActiveItems([]);
    navItems.forEach((section) => updateActiveItems(section.items));
  }, [pathname]);

  const toggleSection = (section: string) => {
    setOpenSections((prev) =>
      prev.includes(section)
        ? prev.filter((sec) => sec !== section)
        : [...prev, section]
    );
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
              href: "/headwear",
              icon: FileText,
              label: "HEADWEAR",
              subItems: [
                {
                  href: "/leisure-collection",
                  icon: FileText,
                  label: "LEISURE",
                },
                {
                  href: "/industrial-collection",
                  icon: FileText,
                  label: "INDUSTRIAL",
                },
                {
                  href: "/signature-collection",
                  icon: FileText,
                  label: "SIGNATURE",
                },
                {
                  href: "/baseball-collection",
                  icon: FileText,
                  label: "BASEBALL",
                },
                {
                  href: "/fashion-collection",
                  icon: FileText,
                  label: "FASHION",
                },
                {
                  href: "/sport-collection",
                  icon: FileText,
                  label: "SPORT",
                },
                {
                  href: "/multi-functional-collection",
                  icon: FileText,
                  label: "MULTI-FUNC",
                },
                {
                  href: "/new-in-headwear-collection",
                  icon: FileText,
                  label: "NEW",
                },
                {
                  href: "/african-collection",
                  icon: FileText,
                  label: "AFRICAN",
                },
              ],
            },
            {
              href: "/apparel",
              icon: FileText,
              label: "APPAREL",
              subItems: [
                {
                  href: "/new-in-apparel-collection",
                  icon: FileText,
                  label: "NEW",
                },
                {
                  href: "/men-collection",
                  icon: FileText,
                  label: "MEN",
                },
                {
                  href: "/woman-collection",
                  icon: FileText,
                  label: "WOMAN",
                },
                {
                  href: "/kids-collection",
                  icon: FileText,
                  label: "KIDS",
                },
                {
                  href: "/t-shirts-collection",
                  icon: FileText,
                  label: "T-SHIRTS",
                },
                {
                  href: "/golfers-collection",
                  icon: FileText,
                  label: "GOLFERS",
                },
                {
                  href: "/hoodies-collection",
                  icon: FileText,
                  label: "HOODIES",
                },
                {
                  href: "/jackets-collection",
                  icon: FileText,
                  label: "JACKETS",
                },
                {
                  href: "/bottoms-collection",
                  icon: FileText,
                  label: "BOTTOMS",
                },
              ],
            },
            {
              href: "/all-collections",
              icon: FileText,
              label: "ALL COLLECTIONS",
              subItems: [
                {
                  href: "/signature",
                  icon: FileText,
                  label: "SIGNATURE",
                },
                {
                  href: "/baseball",
                  icon: FileText,
                  label: "BASEBALL",
                },
                {
                  href: "/fashion",
                  icon: FileText,
                  label: "FASHION",
                },
                {
                  href: "/leisure",
                  icon: FileText,
                  label: "LEISURE",
                },
                {
                  href: "/sport",
                  icon: FileText,
                  label: "SPORT",
                },
                {
                  href: "/industrial",
                  icon: FileText,
                  label: "INDUSTRIAL",
                },
                {
                  href: "/camo",
                  icon: FileText,
                  label: "CAMO",
                },
                {
                  href: "/summer",
                  icon: FileText,
                  label: "SUMMER",
                },
                {
                  href: "/winter",
                  icon: FileText,
                  label: "WINTER",
                },
                {
                  href: "/kids",
                  icon: FileText,
                  label: "KIDS",
                },
                {
                  href: "/african",
                  icon: FileText,
                  label: "AFRICAN",
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  const isItemActive = (href: string): boolean => {
    return activeItems.includes(href);
  };

  const renderNavItem = (item: NavItem, parentPath: string = "") => {
    const fullPath = `${parentPath}${item.href}`;
    const isActive = isItemActive(fullPath);
    const isOpen = openSections.includes(item.label);
    const hasSubItems = item.subItems && item.subItems.length > 0;

    return (
      <React.Fragment key={fullPath}>
        <Link href={fullPath} passHref>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start transition-colors duration-200",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              parentPath && "pl-4"
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
          <div className="mt-1 space-y-1 border-l border-accent pl-4">
            {item.subItems.map((subItem) => renderNavItem(subItem, fullPath))}
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
