"use client";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CollapsibleSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="relative h-screen flex">
      {/* Main sidebar */}
      <div
        className={`bg-gray-800 text-white transition-all duration-300 ${
          isOpen ? "w-64" : "w-0"
        } overflow-hidden`}
      >
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Sidebar</h2>
          <nav>
            <ul className="space-y-2">
              <li className="p-2 hover:bg-gray-700 rounded cursor-pointer">
                Home
              </li>
              <li className="p-2 hover:bg-gray-700 rounded cursor-pointer">
                Dashboard
              </li>
              <li className="p-2 hover:bg-gray-700 rounded cursor-pointer">
                Settings
              </li>
              <li className="p-2 hover:bg-gray-700 rounded cursor-pointer">
                Profile
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-4 -right-10 bg-gray-800 text-white p-2 rounded-r hover:bg-gray-700 focus:outline-none"
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
      >
        {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>
    </div>
  );
};

export default CollapsibleSidebar;
