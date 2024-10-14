// SummerCollections.tsx
"use client";
import React from "react";
import useSummerProducts from "./useSummerProducts";
import CategoryCarousel from "../_components/CategoryCarousel";
import { ProductWithFeaturedImage } from "./types";

const SummerCollections: React.FC = () => {
  const { products, loading, error } = useSummerProducts();

  if (loading) {
    return <div>Loading summer collections...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const productTypes: string[] = [
    "fashion-collection",
    "headwear-collection",
    "sport-collection",
    "apparel-collection",
    "t-shirts",
  ];

  const genderCategories: string[] = ["men", "women", "unisex"];

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

      {/* Product Type Categories */}
      {productTypes.map((category: string) => (
        <CategoryCarousel
          key={category}
          categoryName={formatCategoryName(category)}
          products={filterProductsByCategory(category)}
        />
      ))}

      {/* Gender Categories */}
      {genderCategories.map((gender: string) => (
        <div key={gender} className="space-y-12">
          <h2 className="text-3xl font-semibold mt-12 mb-6 capitalize">
            {gender} Collection
          </h2>
          {productTypes.map((category: string) => {
            const filteredProducts = products.filter(
              (product: ProductWithFeaturedImage) =>
                product.category.includes(category) &&
                product.category.includes("summer-collection") &&
                product.category.includes(gender)
            );
            if (filteredProducts.length > 0) {
              return (
                <CategoryCarousel
                  key={`${gender}-${category}`}
                  categoryName={`${formatCategoryName(category)} for ${formatCategoryName(gender)}`}
                  products={filteredProducts}
                />
              );
            }
            return null;
          })}
        </div>
      ))}
    </div>
  );
};

export default SummerCollections;
