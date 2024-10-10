"use client";
import React from "react";
import ProductCarousel from "../_components/ProductCarousel";
import WinterProductsSkeleton from "./WinterProductsSkeleton";
import { useWinterProducts } from "./hooks";

const WinterLanding: React.FC = () => {
  const { categorizedWinterProducts, isLoading, error } = useWinterProducts();

  if (isLoading) {
    return <WinterProductsSkeleton />;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Winter Collection</h1>
      {Object.entries(categorizedWinterProducts).map(
        ([category, products]) =>
          products.length > 0 && (
            <ProductCarousel
              key={category}
              products={products}
              title={`${category} Winter Collection`}
            />
          )
      )}
    </div>
  );
};

export default WinterLanding;
