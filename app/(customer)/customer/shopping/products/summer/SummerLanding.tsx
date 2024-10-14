"use client";
import React from "react";
import SummerProductsSkeleton from "./SummerProductsSkeleton";
import { useSummerProducts } from "./hooks";
import ProductCarousel from "../_components/_carousel-component/ProductCarousel";

const SummerLanding: React.FC = () => {
  const { categorizedProducts, isLoading, error } = useSummerProducts();

  if (isLoading) {
    return <SummerProductsSkeleton />;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      {Object.entries(categorizedProducts).map(([category, products]) => (
        <ProductCarousel
          key={category}
          products={products}
          title={`${category} Summer Collection`}
        />
      ))}
    </div>
  );
};

export default SummerLanding;
