import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import SummerCollectionPage from "./SummerLanding";
import FilterSidebar from "./FilterSidebar";

const SummerPage = () => {
  return (
    <div>
      {/* Page Header Section */}
      <div className="bg-muted border-b border-border">
        <div className="container mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-muted-foreground mb-4">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <Link href="/collections" className="hover:text-primary">
              Collections
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-foreground font-medium">
              Summer Collection
            </span>
          </div>

          {/* Page Title */}
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Summer Collection
              </h1>
              <p className="text-muted-foreground mt-1">
                Discover our latest summer styles and seasonal favorites
              </p>
            </div>
            <div className="text-right text-muted-foreground">
              <p className="text-sm">Season: Summer 2024</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto py-8">
        <div className="flex gap-8">
          <div className="w-[300px] flex-shrink-0">
            <FilterSidebar />
          </div>
          <div className="flex-1">
            <SummerCollectionPage />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummerPage;
