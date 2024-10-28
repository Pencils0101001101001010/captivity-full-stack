"use client";
import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useSession } from "../SessionProvider";
import Link from "next/link";
import { usePathname } from "next/navigation";

const CollapsibleSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [openDropdowns, setOpenDropdowns] = useState<number[]>([]);
  const { user } = useSession();
  const pathname = usePathname();

  const menuItems = [
    {
      title: "Dashboard",
      links: [
        { name: "Overview", href: "/admin/dashboard" },
        { name: "Analytics", href: "/admin/dashboard/analytics" },
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

  const toggleDropdown = (index: number) => {
    setOpenDropdowns(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      }
      return [...prev, index];
    });
  };

  return (
    <div className="relative h-screen flex">
      <div
        className={`bg-gray-900 text-white transition-all duration-300 ${
          isOpen ? "w-[300px]" : "w-0"
        } overflow-hidden`}
      >
        <div className="p-4">
          {/* User Welcome Section */}
          <div className="mb-6 px-2">
            <h2 className="text-xl font-bold text-gray-200">
              Welcome, {user.username}
            </h2>
            <p className="text-sm text-gray-400 mt-1">Administrator</p>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-700 my-4" />

          <nav className="space-y-1">
            {menuItems.map((item, index) => (
              <div key={index}>
                <div className="rounded-md overflow-hidden">
                  <button
                    onClick={() => toggleDropdown(index)}
                    className={`w-full p-3 flex items-center justify-between hover:bg-gray-800 transition-colors duration-200 ${
                      openDropdowns.includes(index) ? "bg-gray-800" : ""
                    }`}
                  >
                    <span className="font-medium text-gray-200">
                      {item.title}
                    </span>
                    <div className="text-gray-400">
                      {openDropdowns.includes(index) ? (
                        <ChevronUp size={18} />
                      ) : (
                        <ChevronDown size={18} />
                      )}
                    </div>
                  </button>

                  <div
                    className={`transition-all duration-200 ease-in-out ${
                      openDropdowns.includes(index)
                        ? "max-h-40 opacity-100"
                        : "max-h-0 opacity-0"
                    } overflow-hidden bg-gray-800`}
                  >
                    {item.links.map((link, linkIndex) => (
                      <Link
                        key={linkIndex}
                        href={link.href}
                        className={`block px-6 py-2 text-sm transition-colors duration-200 ${
                          pathname === link.href
                            ? "bg-gray-700 text-white border-l-4 border-blue-500"
                            : "text-gray-400 hover:text-white hover:bg-gray-700"
                        }`}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </div>
                {/* Divider after each section except the last one */}
                {index < menuItems.length - 1 && (
                  <div className="h-px bg-gray-700 my-1" />
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-4 -right-10 bg-gray-900 text-white p-2 rounded-r hover:bg-gray-800 transition-colors duration-200 focus:outline-none"
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
      >
        {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>
    </div>
  );
};

export default CollapsibleSidebar;
