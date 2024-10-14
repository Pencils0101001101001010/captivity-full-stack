"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { navItems } from "./categoriesData";
import CategorySubmenu from "./CategorySubmenu";

const CategoriesDropDown = () => {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (section: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setOpenDropdown(section);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 300); // Delay before closing to allow moving to submenu
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <nav className="relative flex justify-evenly w-full" ref={dropdownRef}>
      <div className="hidden md:flex space-x-14">
        {navItems.map(section => (
          <div
            key={section.label}
            className="relative"
            onMouseEnter={() => handleMouseEnter(section.label)}
            onMouseLeave={handleMouseLeave}
          >
            <Button variant="ghost" className="flex items-center space-x-2">
              <span className="text-sm font-medium">{section.label}</span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  openDropdown === section.label && "rotate-180"
                )}
              />
            </Button>

            {openDropdown === section.label && (
              <CategorySubmenu
                items={section.items}
                pathname={pathname}
                onMouseEnter={() => {
                  if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                  }
                }}
                onMouseLeave={handleMouseLeave}
              />
            )}
          </div>
        ))}
      </div>
    </nav>
  );
};

export default CategoriesDropDown;
