/* eslint-disable react/no-unescaped-entities */
// shopping/layout.tsx
import React, { ReactNode } from "react";
import prisma from "@/lib/prisma";
import FilterSidebar from "./_components/FilterSidebar";
import SearchField from "./_components/SearchField";

interface LayoutProps {
  children: ReactNode;
}

export default async function Layout({
  children,
}: LayoutProps): Promise<JSX.Element> {
  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Column */}
          <div className="w-full lg:w-[300px] lg:flex-shrink-0">
            {/* Search - Desktop Only */}
            <div className="hidden lg:block mb-6">
              <SearchField />
            </div>

            {/* Filters */}
            <FilterSidebar />
          </div>

          {/* Main Content Column */}
          <div className="flex-1">
            {/* Search - Mobile Only */}
            <div className="lg:hidden mb-6">
              <SearchField />
            </div>
            {children}
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-muted mt-12 py-12 mb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Stay Updated
            </h2>
            <p className="text-muted-foreground mb-6">
              Subscribe to our newsletter for exclusive collection updates and
              special offers.
            </p>
            <div className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-md border border-border bg-background"
              />
              <button
                type="button"
                className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
