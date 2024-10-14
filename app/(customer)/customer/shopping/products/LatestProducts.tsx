"use client";

import React from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";
import useLatestProducts from "./useLatestProducts";

const LatestProducts = () => {
  const { products, loading, error } = useLatestProducts();

  if (loading) {
    return <div>Loading latest products...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="w-full py-8">
      <h2 className="text-3xl font-bold mb-6 px-4">Latest Products</h2>
      {products.length === 0 ? (
        <p>No new products available.</p>
      ) : (
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 5000,
            }),
          ]}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {products.map(product => (
              <CarouselItem
                key={product.id}
                className="pl-2 md:pl-4 md:basis-1/4 lg:basis-1/5"
              >
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    {product.featuredImage && (
                      <div className="relative h-48 w-full">
                        <Image
                          src={product.featuredImage.thumbnail}
                          alt={product.productName}
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-2 truncate">
                        {product.productName}
                      </h3>
                      <p className="text-lg font-bold text-primary">
                        R{product.sellingPrice.toFixed(2)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      )}
    </div>
  );
};

export default LatestProducts;
