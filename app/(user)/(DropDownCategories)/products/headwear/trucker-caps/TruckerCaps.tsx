"use client";

import React, { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import useTruckerCaps from "./useTruckerCaps";
import { ProductWithFeaturedImage } from "./actions";
import SideMenu from "@/app/(user)/_components/SideMenu";
import HeroSection from "@/app/(user)/_components/HeroSection";

const TruckerCapsProductList: React.FC = () => {
  const { products, loading, error } = useTruckerCaps();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [featuredImage, setFeaturedImage] = useState<{ large: string }>({
    large: "/Industrial-collection-Btn.jpg",
  });
  const productsPerPage = 9;

  useEffect(() => {
    if (products.length > 0 && products[1].featuredImage?.large) {
      setFeaturedImage({ large: products[1].featuredImage.large });
    }
  }, [products]);

  const filteredProducts = products.filter(product =>
    product.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  if (error) {
    return (
      <div className="container mx-auto my-8 text-center">
        <p className="text-red-500">Error loading products: {error}</p>
      </div>
    );
  }

  return (
    <section className="container mx-auto my-8">
      <HeroSection
        featuredImage={featuredImage}
        categoryName="TRUCKER CAPS"
      />

      <div className="flex flex-col md:flex-row gap-6 relative">
        {/* Updated sidebar with hidden scrollbar */}
        <aside className="md:w-1/4 lg:w-1/4 hidden md:block">
          <div className="sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto overflow-x-hidden no-scrollbar">
            <SideMenu />
          </div>
        </aside>
        <main className="w-full md:w-3/4 lg:w-4/5">
          <div className="flex items-center justify-between w-full mb-4">
            <h4>Trucker caps...</h4>
            <div className="w-[200px] max-w-sm">
              <Input
                type="text"
                placeholder="Search trucker caps..."
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>
          <hr className="w-full bg-gray-100 mt-0 mb-5" />
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                  <CardContent className="p-4">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentProducts.map((product: ProductWithFeaturedImage) => (
                <Link
                  href={`/products/headwear/${product.id}`}
                  key={product.id}
                >
                  <Card className="hover:shadow-lg transition-shadow duration-300">
                    <div className="relative h-48 w-full">
                      <Image
                        src={
                          product.featuredImage?.medium ||
                          "/Industrial-collection-Btn.jpg"
                        }
                        alt={product.productName}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{ objectFit: "cover" }}
                        className="rounded-t-lg"
                        priority
                      />
                    </div>
                    <CardContent className="p-4">
                      <h2 className="text-lg font-semibold mb-2 truncate">
                        {product.productName}
                      </h2>
                      {/* <Badge 
  variant="secondary"
  className={product.variations?.some(v => v.quantity > 0) ? "bg-green-500 hover:bg-green-600" : ""}
>
  {product.variations?.some(v => v.quantity > 0) ? "In Stock" : "Out of Stock"}
</Badge> */}
                    </CardContent>
                    <CardFooter>
                      <p>click to view</p>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          )}
          <div className="mt-8 flex justify-center items-center space-x-2">
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </main>
      </div>
    </section>
  );
};

export default TruckerCapsProductList;