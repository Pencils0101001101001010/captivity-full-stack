import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const LatestProductsSkeleton = () => {
  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 py-8">
      <div className="h-9 w-64 bg-gray-200 rounded mb-6"></div>
      <div className="relative">
        <div className="overflow-hidden">
          <div className="flex -mx-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="w-1/4 px-2">
                <Card className="overflow-hidden shadow-lg">
                  <CardContent className="p-4">
                    <div className="relative h-48 w-full mb-4 bg-gray-200 rounded-lg"></div>
                    <div className="h-6 w-3/4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-7 w-1/2 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-6">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="w-3 h-3 rounded-full mx-1 bg-gray-200"
          ></div>
        ))}
      </div>
    </div>
  );
};

export default LatestProductsSkeleton;
