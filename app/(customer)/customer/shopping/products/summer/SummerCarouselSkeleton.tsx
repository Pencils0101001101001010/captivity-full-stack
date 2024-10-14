// components/CategoryCarouselSkeleton.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const SummerCarouselSkeleton: React.FC = () => {
  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 py-8 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
      <div className="relative">
        <div className="overflow-hidden">
          <div className="flex -mx-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="flex-[0_0_25%] min-w-0 px-4">
                <Card className="overflow-hidden shadow-lg">
                  <CardContent className="p-4">
                    <div className="relative h-64 w-full mb-4 bg-gray-200 rounded-lg"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute top-1/2 -left-4 -translate-y-1/2 w-10 h-10 bg-gray-200 rounded-full"></div>
        <div className="absolute top-1/2 -right-4 -translate-y-1/2 w-10 h-10 bg-gray-200 rounded-full"></div>
      </div>
      <div className="flex justify-center mt-6">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="w-3 h-3 rounded-full mx-1 bg-gray-200"
          ></div>
        ))}
      </div>
    </div>
  );
};

export default SummerCarouselSkeleton;
