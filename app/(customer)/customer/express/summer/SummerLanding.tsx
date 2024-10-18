"use client"
import React from "react";
import CategoryCarousel from "./CategoryCarousel";
import { useSummerCollection } from "./useSummerHook";

const SummerLanding: React.FC = () => {
  const { collection, loading, error } = useSummerCollection();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-2xl">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Summer Collection</h1>

      {collection.men.length > 0 && (
        <CategoryCarousel title="Men's Collection" products={collection.men} />
      )}

      {collection.women.length > 0 && (
        <CategoryCarousel
          title="Women's Collection"
          products={collection.women}
        />
      )}

      {collection.kids.length > 0 && (
        <CategoryCarousel title="Kids' Collection" products={collection.kids} />
      )}

      {collection.unisex.length > 0 && (
        <CategoryCarousel
          title="Unisex Collection"
          products={collection.unisex}
        />
      )}

      {collection.hats.length > 0 && (
        <CategoryCarousel title="Hats" products={collection.hats} />
      )}

      {collection.caps.length > 0 && (
        <CategoryCarousel title="Caps" products={collection.caps} />
      )}

      {collection.tShirts.length > 0 && (
        <CategoryCarousel title="T-Shirts" products={collection.tShirts} />
      )}

      {Object.values(collection).every(array => array.length === 0) && (
        <div className="text-center text-2xl mt-8">
          No summer collection items available at the moment.
        </div>
      )}
    </div>
  );
};

export default SummerLanding;
