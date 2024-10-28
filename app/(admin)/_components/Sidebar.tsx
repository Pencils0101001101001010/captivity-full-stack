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
import { menuItems } from "./MenuItems";

const CollapsibleSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [openDropdowns, setOpenDropdowns] = useState<number[]>([]);
  const { user } = useSession();
  const pathname = usePathname();

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
                <div className="rounded-md">
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

                  {/* Dropdown container */}
                  <div
                    className={`transition-all duration-200 ease-in-out bg-gray-800 ${
                      openDropdowns.includes(index) ? "" : "h-0"
                    } overflow-hidden`}
                  >
                    {/* Scrollable content */}
                    <div className="max-h-48 overflow-y-auto">
                      {item.links.map((link, linkIndex) => (
                        <Link
                          key={linkIndex}
                          href={link.href}
                          className={`block px-6 py-2 text-sm transition-colors duration-200 relative ${
                            pathname === link.href
                              ? "bg-gray-700 text-white border-l-4 border-blue-500"
                              : "text-gray-400 hover:text-white hover:bg-gray-700"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{link.name}</span>
                            {link.count && link.count > 0 && (
                              <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full min-w-[20px] text-center">
                                {link.count}
                              </span>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
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
