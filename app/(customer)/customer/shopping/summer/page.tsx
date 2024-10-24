import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import SummerCollectionPage from "./SummerLanding";
import FilterSidebar from "./FilterSidebar";

const SummerPage = () => {
  return (
    <div>
      {/* Page Header Section */}
      <div className="bg-gray-50 border-b">
        <div className="container mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-gray-600 mb-4">
            <Link href="/" className="hover:text-blue-600">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <Link href="/collections" className="hover:text-blue-600">
              Collections
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-gray-900 font-medium">Summer Collection</span>
          </div>

          {/* Page Title */}
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Summer Collection
              </h1>
              <p className="text-gray-600 mt-1">
                Discover our latest summer styles and seasonal favorites
              </p>
            </div>
            {/* Optional: Add collection stats or additional info */}
            <div className="text-right text-gray-600">
              <p className="text-sm">Season: Summer 2024</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          <div className="w-64 flex-shrink-0">
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
