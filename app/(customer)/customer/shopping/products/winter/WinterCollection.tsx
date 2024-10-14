// SummerCollections.tsx
"use client";
import React from "react";
import CategoryCarousel from "../_components/CategoryCarousel";
import CollectionCarouselSkeleton from "../_components/CollectionCarouselSkeleton";
import { ProductWithFeaturedImage } from "../productTypes";
import useWinterProducts from "./useWinterProducts";
import { formatCategoryName } from "./winterUtils";

const WinterCollections: React.FC = () => {
  const { products, loading, error } = useWinterProducts();

  const categories: string[] = [
    "t-shirts",
    "women",
    "men",
    "fashion-collection",
    "headwear-collection",
    "sport-collection",
    "golfers",
    "new-in-apparel",
    "jackets",
    "beanies",
    "new-products",
    "hoodies",
  ];

  if (loading) {
    return (
      <div className="space-y-16">
        <h1 className="text-4xl font-bold text-center my-8">
          Winter Collection
        </h1>
        {categories.map((category, index) => (
          <CollectionCarouselSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const filterProductsByCategory = (
    category: string
  ): ProductWithFeaturedImage[] => {
    return products.filter(
      (product: ProductWithFeaturedImage) =>
        product.category.includes(category) &&
        product.category.includes("winter-collection")
    );
  };

  return (
    <div className="space-y-16">
      <h1 className="text-4xl font-bold text-center my-8">Winter Collection</h1>

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

export default WinterCollections;
