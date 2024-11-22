// components/VendorNavItems.tsx
import React from "react";
import Link from "next/link";
import { PlusCircle, Users, ClipboardList } from "lucide-react";

interface VendorNavItemsProps {
  vendorWebsite: string;
}

export const VendorNavItems = React.memo(
  ({ vendorWebsite }: VendorNavItemsProps) => {
    const navItems = [
      {
        href: `/vendor/${vendorWebsite}/add-product`,
        icon: <PlusCircle size={18} />,
        label: "Add Product",
      },
      {
        href: `/vendor/${vendorWebsite}/users`,
        icon: <Users size={18} />,
        label: "Users",
      },
      {
        href: `/vendor/${vendorWebsite}/orders`,
        icon: <ClipboardList size={18} />,
        label: "Orders",
      },
    ];

    return (
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-2 text-white hover:text-white/80 transition-colors"
          >
            {item.icon}
            <span className="md:hidden lg:inline">{item.label}</span>
          </Link>
        ))}
      </div>
    );
  }
);

VendorNavItems.displayName = "VendorNavItems";
