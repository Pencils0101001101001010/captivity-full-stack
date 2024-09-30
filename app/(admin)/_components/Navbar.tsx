"use client";

import { useState } from "react";
import UserButton from "./UserButton";
import Sidebar from "./Sidebar";

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-card shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5 px-5 py-3">
        <div className="flex items-center gap-4">
          {/* Toggle Button for Sidebar on Mobile */}
          <button
            className="block lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <svg className="h-6 w-6 text-primary" viewBox="0 0 24 24">
              <path
                d="M4 6h16M4 12h16m-7 6h7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <div className="ml-20 text-2xl font-bold text-primary">
            ADMIN DASHBOARD
          </div>
        </div>
        <UserButton className="sm:ms-auto" />
      </div>

      {/* Sidebar overlay on small screens */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed bottom-0 left-0 top-0 w-64 bg-white p-5">
            {/* Sidebar component */}
            <Sidebar />
          </div>
        </div>
      )}
    </header>
  );
}
