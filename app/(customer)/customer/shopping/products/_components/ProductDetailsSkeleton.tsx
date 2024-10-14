import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

const ProductDetailsSkeleton: React.FC = () => {
  return (
    <Card className="w-full max-w-2xl mx-auto animate-pulse">
      <CardHeader>
        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="aspect-square bg-gray-200 rounded-lg"></div>
          <div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              <div className="h-4 bg-gray-200 rounded w-3/6"></div>
            </div>
            <div className="mt-4 h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="mt-4 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="h-10 bg-gray-200 rounded w-full"></div>
      </CardFooter>
    </Card>
  );
};

export default ProductDetailsSkeleton;
