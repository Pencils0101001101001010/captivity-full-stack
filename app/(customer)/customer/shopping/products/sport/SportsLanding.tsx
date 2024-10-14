"use client";
import React from "react";
import ProductCarousel from "../_components/_carousel-component/ProductCarousel";
import SportProductsSkeleton from "./SportProductsSkeleton";
import { useSportProducts } from "./hooks";

const SportLanding: React.FC = () => {
  const { categorizedSportProducts, isLoading, error } = useSportProducts();

  if (isLoading) {
    return <SportProductsSkeleton />;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      {Object.entries(categorizedSportProducts).map(
        ([category, products]) =>
          products.length > 0 && (
            <ProductCarousel
              key={category}
              products={products}
              title={`${category} Sport Collection`}
            />
          )
      )}
    </div>
  );
};

export default SportLanding;
