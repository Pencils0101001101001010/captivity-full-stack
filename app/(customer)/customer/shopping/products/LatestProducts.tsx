"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useLatestProducts from "./useLatestProducts";
import useEmblaCarousel from "embla-carousel-react";

const LatestProducts = () => {
  const { products, loading, error } = useLatestProducts();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
    containScroll: "trimSnaps",
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  if (loading) {
    return <div>Loading latest products...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Group products into sets of 4
  const productGroups = [];
  for (let i = 0; i < products.length; i += 4) {
    productGroups.push(products.slice(i, i + 4));
  }

  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Latest Products</h2>
      {products.length === 0 ? (
        <p>No new products available.</p>
      ) : (
        <div className="relative">
          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex -mx-4">
              {productGroups.map((group, groupIndex) => (
                <div
                  key={groupIndex}
                  className="flex-[0_0_100%] min-w-0 flex px-4"
                >
                  {group.map(product => (
                    <div key={product.id} className="w-1/4 px-2">
                      <Link href={`/customer/shopping/products/${product.id}`}>
                        <Card className="overflow-hidden shadow-lg transition-shadow duration-300 hover:shadow-xl cursor-pointer">
                          <CardContent className="p-4">
                            {product.featuredImage && (
                              <div className="relative h-48 w-full mb-4 overflow-hidden rounded-lg">
                                <Image
                                  src={product.featuredImage.medium}
                                  alt={product.productName}
                                  fill
                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                  style={{ objectFit: "cover" }}
                                  className="transition-transform duration-300 hover:scale-105"
                                />
                              </div>
                            )}
                            <h3 className="text-lg font-semibold mb-2 truncate">
                              {product.productName}
                            </h3>
                            <p className="text-xl font-bold text-primary">
                              R{product.sellingPrice.toFixed(2)}
                            </p>
                          </CardContent>
                        </Card>
                      </Link>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="absolute top-1/2 -left-4 -translate-y-1/2 rounded-full bg-white shadow-md z-[1]"
            onClick={() => emblaApi && emblaApi.scrollPrev()}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute top-1/2 -right-4 -translate-y-1/2 rounded-full bg-white shadow-md z-[1]"
            onClick={() => emblaApi && emblaApi.scrollNext()}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      )}
      <div className="flex justify-center mt-6">
        {scrollSnaps.map((_, index) => (
          <Button
            key={index}
            variant="ghost"
            size="sm"
            className={`w-3 h-3 rounded-full mx-1 p-0 ${
              index === selectedIndex ? "bg-primary" : "bg-gray-300"
            }`}
            onClick={() => scrollTo(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default LatestProducts;
