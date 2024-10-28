"use client";

import React, { useState, useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Shirt,
  Sun,
  Package,
  PlusCircle,
  ChevronDown,
  LucideIcon,
} from "lucide-react";

type NavItem = {
  href: string;
  icon: LucideIcon;
  label: string;
  subItems?: NavItem[];
  color: string;
};

type Section = {
  section: string;
  items: NavItem[];
};

interface SidebarProps {
  className?: string;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ className, onClose }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [openSections, setOpenSections] = useState<string[]>([]);
  const [activeItems, setActiveItems] = useState<string[]>([]);

  const navItems: Section[] = useMemo(
    () => [
      {
        section: "USERS",
        items: [
          {
            href: "/admin/update/user-role",
            icon: Users,
            label: "Update Roles",
            color: "#4CAF50",
          },
        ],
      },
      {
        section: "PRODUCTS",
        items: [
          {
            href: "/admin/products/create",
            icon: PlusCircle,
            label: "Create",
            color: "#4CAF50",
          },
          {
            href: "/admin/products",
            icon: ShoppingBag,
            label: "Products",
            color: "#2196F3",
            subItems: [
              {
                href: "/headwear",
                icon: Sun,
                label: "Headwear",
                color: "#FF9800",
                subItems: [
                  {
                    href: "/leisure-collection",
                    icon: Package,
                    label: "Leisure",
                    color: "#9C27B0",
                  },
                  {
                    href: "/industrial-collection",
                    icon: Package,
                    label: "Industrial",
                    color: "#795548",
                  },
                  {
                    href: "/signature-collection",
                    icon: Package,
                    label: "Signature",
                    color: "#607D8B",
                  },
                  {
                    href: "/baseball-collection",
                    icon: Package,
                    label: "Baseball",
                    color: "#F44336",
                  },
                  {
                    href: "/fashion-collection",
                    icon: Package,
                    label: "Fashion",
                    color: "#E91E63",
                  },
                  {
                    href: "/sport-collection",
                    icon: Package,
                    label: "Sport",
                    color: "#00BCD4",
                  },
                  {
                    href: "/multi-functional-collection",
                    icon: Package,
                    label: "Multi-Functional",
                    color: "#8BC34A",
                  },
                  {
                    href: "/new-in-headwear-collection",
                    icon: Package,
                    label: "New",
                    color: "#FFEB3B",
                  },
                  {
                    href: "/african-collection",
                    icon: Package,
                    label: "African",
                    color: "#FF5722",
                  },
                ],
              },
              {
                href: "/apparel",
                icon: Shirt,
                label: "Apparel",
                color: "#3F51B5",
                subItems: [
                  {
                    href: "/new-in-apparel-collection",
                    icon: Package,
                    label: "New",
                    color: "#FFEB3B",
                  },
                  {
                    href: "/men-collection",
                    icon: Package,
                    label: "Men",
                    color: "#2196F3",
                  },
                  {
                    href: "/woman-collection",
                    icon: Package,
                    label: "Women",
                    color: "#E91E63",
                  },
                  {
                    href: "/kids-collection",
                    icon: Package,
                    label: "Kids",
                    color: "#4CAF50",
                  },
                  {
                    href: "/t-shirts-collection",
                    icon: Package,
                    label: "T-Shirts",
                    color: "#9C27B0",
                  },
                  {
                    href: "/golfers-collection",
                    icon: Package,
                    label: "Golfers",
                    color: "#795548",
                  },
                  {
                    href: "/hoodies-collection",
                    icon: Package,
                    label: "Hoodies",
                    color: "#607D8B",
                  },
                  {
                    href: "/jackets-collection",
                    icon: Package,
                    label: "Jackets",
                    color: "#F44336",
                  },
                  {
                    href: "/bottoms-collection",
                    icon: Package,
                    label: "Bottoms",
                    color: "#00BCD4",
                  },
                ],
              },
              {
                href: "/all-collections",
                icon: Package,
                label: "All Collections",
                color: "#673AB7",
                subItems: [
                  {
                    href: "/signature",
                    icon: Package,
                    label: "Signature",
                    color: "#607D8B",
                  },
                  {
                    href: "/baseball",
                    icon: Package,
                    label: "Baseball",
                    color: "#F44336",
                  },
                  {
                    href: "/fashion",
                    icon: Package,
                    label: "Fashion",
                    color: "#E91E63",
                  },
                  {
                    href: "/leisure",
                    icon: Package,
                    label: "Leisure",
                    color: "#9C27B0",
                  },
                  {
                    href: "/sport",
                    icon: Package,
                    label: "Sport",
                    color: "#00BCD4",
                  },
                  {
                    href: "/industrial",
                    icon: Package,
                    label: "Industrial",
                    color: "#795548",
                  },
                  {
                    href: "/camo",
                    icon: Package,
                    label: "Camo",
                    color: "#4CAF50",
                  },
                  {
                    href: "/summer",
                    icon: Package,
                    label: "Summer",
                    color: "#FF9800",
                  },
                  {
                    href: "/winter",
                    icon: Package,
                    label: "Winter",
                    color: "#2196F3",
                  },
                  {
                    href: "/kids",
                    icon: Package,
                    label: "Kids",
                    color: "#4CAF50",
                  },
                  {
                    href: "/african",
                    icon: Package,
                    label: "African",
                    color: "#FF5722",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        section: "ORDERS",
        items: [
          {
            href: "/admin/orders",
            icon: Users,
            label: "Pending",
            color: "#4CAF50",
          },
        ],
      },
    ],
    []
  );

  useEffect(() => {
    const updateActiveItems = (items: NavItem[], parentPath: string = "") => {
      items.forEach(item => {
        const fullPath = `${parentPath}${item.href}`;
        if (pathname?.startsWith(fullPath)) {
          setActiveItems(prev => [...new Set([...prev, fullPath])]);
          setOpenSections(prev => [...new Set([...prev, item.label])]);
          if (item.subItems) {
            updateActiveItems(item.subItems, fullPath);
          }
        }
      });
    };

    setActiveItems([]);
    navItems.forEach(section => updateActiveItems(section.items));
  }, [pathname, navItems]);

  const toggleSection = (section: string) => {
    setOpenSections(prev =>
      prev.includes(section)
        ? prev.filter(sec => sec !== section)
        : [...prev, section]
    );
  };

  const isItemActive = (href: string): boolean => activeItems.includes(href);

  const renderNavItem = (
    item: NavItem,
    parentPath: string = "",
    depth: number = 0
  ) => {
    const fullPath = `${parentPath}${item.href}`;
    const isActive = isItemActive(fullPath);
    const isOpen = openSections.includes(item.label);
    const hasSubItems = item.subItems !== undefined && item.subItems.length > 0;

    return (
      <div key={fullPath} className="w-full">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-left transition-colors duration-200 mb-2",
            isActive
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            depth > 0 && "pl-4"
          )}
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            if (hasSubItems) {
              toggleSection(item.label);
            } else {
              router.push(fullPath);
              onClose?.();
            }
          }}
        >
          <div className="flex w-full items-center">
            <item.icon className="mr-2 h-4 w-4" style={{ color: item.color }} />
            <span className="flex-grow text-sm font-medium">{item.label}</span>
            {hasSubItems && (
              <ChevronDown
                className={cn(
                  "ml-auto h-4 w-4 transition-transform duration-200",
                  isOpen && "rotate-180"
                )}
              />
            )}
          </div>
        </Button>
        {hasSubItems && item.subItems && (
          <div
            className={cn(
              "overflow-hidden transition-all duration-300 ease-in-out",
              isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
            )}
          >
            <div className="space-y-1 pl-4">
              {item.subItems.map(subItem =>
                renderNavItem(subItem, fullPath, depth + 1)
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <aside
      className={cn(
        "flex h-screen w-64 flex-col overflow-y-auto bg-background p-4 shadow-md",
        className
      )}
    >
      <div className="mb-6 flex items-center">
        <LayoutDashboard className="mr-2 h-6 w-6 text-primary" />
        <Button
          variant="link"
          className="text-xl font-semibold text-primary"
          onClick={e => {
            e.preventDefault();
            router.push("/admin");
            onClose?.();
          }}
        >
          Admin Dashboard
        </Button>
      </div>

      <nav className="flex-grow space-y-4">
        {navItems.map(section => (
          <div key={section.section} className="space-y-2">
            <h3 className="text-sm font-semibold uppercase text-muted-foreground">
              {section.section}
            </h3>
            <div className="space-y-1">
              {section.items.map(item => renderNavItem(item))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
