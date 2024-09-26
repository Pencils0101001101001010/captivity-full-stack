"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils"; // Utility function to merge classnames
import { Button } from "@/components/ui/button"; // Assuming you have a Button component
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
} from "lucide-react"; // Icon imports

// Define types for nav items and sections
type NavItem = {
  href: string;
  icon: React.ElementType; // React component for the icon
  label: string;
};

type Section = {
  section: string;
  items: NavItem[];
};

const Sidebar = ({ className }: { className?: string }) => {
  const pathname = usePathname();

  const navItems: Section[] = [
    {
      section: "DASHBOARD",
      items: [{ href: "/", icon: Home, label: "Home (Dashboard)" }],
    },
    {
      section: "PERMITS",
      items: [
        { href: "/permits/apply", icon: FileText, label: "Apply" },
        { href: "/permits/list", icon: FileText, label: "List Applications" },
      ],
    },
    {
      section: "USERS",
      items: [
        { href: "/users/list", icon: Users, label: "List Users" },
        { href: "/users/profile", icon: User, label: "View Profile" },
        { href: "/users/tracking", icon: FileText, label: "Tracking" },
      ],
    },
    {
      section: "SUBMISSIONS",
      items: [
        { href: "/skipper", icon: Anchor, label: "Skipper" },
        { href: "/admin", icon: Eye, label: "Admin" },
        { href: "/driver", icon: Truck, label: "Truck Driver" },
        {
          href: "/submissions/factory-controller",
          icon: Building2,
          label: "Factory Controller",
        },
        {
          href: "/submissions/permit-holder",
          icon: Shield,
          label: "Permit Holder",
        },
        {
          href: "/submissions/system-admin",
          icon: Settings,
          label: "Systems Administrator",
        },
      ],
    },
  ];

  return (
    <div
      className={cn(
        "sticky top-[60px] flex h-screen w-64 flex-col bg-white p-4",
        className
      )}
    >
      <div className="mb-6 flex items-center">
        <svg
          className="mr-2 h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 4L4 8L12 12L20 8L12 4Z"
            stroke="blue"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4 12L12 16L20 12"
            stroke="blue"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4 16L12 20L20 16"
            stroke="blue"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-xl font-semibold text-blue-500">CatchTrack</span>
      </div>

      {navItems.map((section) => (
        <div key={section.section} className="mb-4">
          <h3 className="mb-2 text-sm font-semibold text-gray-500">
            {section.section}
          </h3>
          <div className="space-y-1">
            {section.items.map((item: NavItem) => (
              <Button
                key={item.href}
                variant="ghost"
                className={cn(
                  "w-full justify-start transition-colors duration-200",
                  pathname === item.href
                    ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                )}
                asChild
              >
                <Link href={item.href} className="flex items-center">
                  <item.icon className="mr-3 h-4 w-4" />
                  <span className="flex-grow">{item.label}</span>
                  {/* Add a chevron for specific items */}
                  {section.section === "SUBMISSIONS" &&
                    item.label !== "Permit Holder" &&
                    item.label !== "Systems Administrator" && (
                      <ChevronRight className="h-4 w-4 opacity-50" />
                    )}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
