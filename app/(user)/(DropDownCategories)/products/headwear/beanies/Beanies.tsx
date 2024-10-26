"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import SideMenu from "@/app/(user)/_components/SideMenu";
import HeroSection from "@/app/(user)/_components/HeroSection";
import useBeanies from "./useBeanies";
import type { ProductWithFeaturedImage } from "./actions";
import { fetchNewInHeadwear } from "../../_global/actions";
import ProductCarousel from "@/app/(customer)/customer/shopping/product_categories/_components/ProductCarousel";

const ITEMS_PER_PAGE = 8;

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span 
          key={star} 
          className={`text-lg ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
        >
          ★
        </span>
      ))}
    </div>
  );
};

interface BeanieProduct extends ProductWithFeaturedImage {
  rating?: number;
}

const BeaniesProductList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { products, loading, error } = useBeanies();
  const [featuredImage, setFeaturedImage] = useState<{ large: string }>({
    large: "/Industrial-collection-Btn.jpg",
  });
  const [newHeadwear, setNewHeadwear] = useState<any[]>([]);

  // Transform products for carousel
  const carouselProducts = useMemo(() => {
    return newHeadwear.map(product => ({
      id: product.id,
      name: product.productName,
      imageUrl: product.featuredImage?.medium || "/placeholder.jpg",
      stock: product.stock || 0
    }));
  }, [newHeadwear]);

  useEffect(() => {
    const loadNewHeadwear = async () => {
      try {
        const result = await fetchNewInHeadwear();
        if (result.success && result.data) {
          setNewHeadwear(result.data);
        }
      } catch (error) {
        console.error("Error loading new headwear:", error);
      }
    };
    
    loadNewHeadwear();
  }, []);

  const { paginatedProducts, totalPages, startIndex } = useMemo(() => {
    const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedProducts = products.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );
    return { paginatedProducts, totalPages, startIndex };
  }, [products, currentPage]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px]">
        <Loader2 className="mx-auto my-3 animate-spin h-8 w-8" />
        <p className="text-muted-foreground">Loading beanies collection...</p>
      </div>
    );
  }
  
  if (error) return <div>Error: {error}</div>;

  return (
    <section className="container mx-auto my-8">
      <HeroSection featuredImage={featuredImage} categoryName="BEANIES" />

      <div className="flex flex-col md:flex-row gap-6 relative">
        <aside className="md:w-1/4 lg:w-1/4 hidden md:block">
          <div className="sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto overflow-x-hidden no-scrollbar">
            <SideMenu /><ProductCarousel 
              products={carouselProducts}
              className="w-full"
            />
          </div>
        </aside>

        {/* Main Content */}
        <main className="w-3/4">
          <div className="grid grid-cols-4 gap-6">
            {paginatedProducts.map((product: BeanieProduct) => (
              <Link
                href={`/products/headwear/${product.id}`}
                key={product.id}
                className="block"
              >
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  <div className="relative h-48 w-full">
                    <Image
                      src={product.featuredImage?.medium || "/placeholder.jpg"}
                      alt={product.productName}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      style={{ objectFit: "cover" }}
                      className="hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h2 className="text-gray-700 mb-2">{product.productName}</h2>
                    <StarRating rating={product.rating || 4} />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              <button
                onClick={() => setCurrentPage(prev => prev - 1)}
                disabled={currentPage === 1}
                className="p-2 bg-white border rounded hover:bg-gray-50"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 rounded ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white"
                      : "bg-white border hover:bg-gray-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={currentPage === totalPages}
                className="p-2 bg-white border rounded hover:bg-gray-50"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </main>
      </div>
    </section>
  );
};

export default BeaniesProductList;