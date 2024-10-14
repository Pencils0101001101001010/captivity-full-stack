// SummerCollections.tsx
"use client";
import React from "react";
import useSummerProducts from "./useSummerProducts";
import CategoryCarousel from "../_components/CategoryCarousel";
import { ProductWithFeaturedImage } from "./summerTypes";
const SummerCollections: React.FC = () => {
  const { products, loading, error } = useSummerProducts();

  if (loading) {
    return <div>Loading summer collections...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const categories: string[] = [
    "women",
    "men",
    "sport-collection",
    "t-shirts",
    "fashion-collection",
    "headwear-collection",
  ];

  const filterProductsByCategory = (
    category: string
  ): ProductWithFeaturedImage[] => {
    return products.filter(
      (product: ProductWithFeaturedImage) =>
        product.category.includes(category) &&
        product.category.includes("summer-collection")
    );
  };

  const formatCategoryName = (category: string): string => {
    return category
      .split("-")
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="space-y-16">
      <h1 className="text-4xl font-bold text-center my-8">Summer Collection</h1>

      {categories.map((category: string) => {
        const filteredProducts = filterProductsByCategory(category);
        if (filteredProducts.length > 0) {
          return (
            <CategoryCarousel
              key={category}
              categoryName={`${formatCategoryName(category)} Collection`}
              products={filteredProducts}
            />
          );
        }
        return null;
      })}
    </div>
  );
};

export default SummerCollections;
