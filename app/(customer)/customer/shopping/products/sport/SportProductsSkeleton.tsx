import React from "react";

const SkeletonProduct = () => (
  <div className="px-2">
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative w-full h-48 bg-gray-200 animate-pulse" />
      <div className="p-4">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
      </div>
    </div>
  </div>
);

const SkeletonCarousel = () => (
  <div className="mb-12">
    <div className="h-8 bg-gray-200 rounded w-1/4 mb-6 animate-pulse" />
    <div className="flex space-x-4 overflow-hidden">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="w-1/4 flex-shrink-0">
          <SkeletonProduct />
        </div>
      ))}
    </div>
  </div>
);

const SportProductsSkeleton = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      <div className="h-10 bg-gray-200 rounded w-1/2 mx-auto mb-8 animate-pulse" />
      {[...Array(4)].map((_, index) => (
        <SkeletonCarousel key={index} />
      ))}
    </div>
  );
};

export default SportProductsSkeleton;
