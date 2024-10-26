"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface CarouselProduct {
  id: string;
  name: string;
  imageUrl: string;
  stock: number;
}

interface ProductCarouselProps {
  products: CarouselProduct[];
  className?: string;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({
  products,
  className,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (products.length <= 1) return;

    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [products.length, currentIndex]);

  const handlePrevious = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % products.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  if (!products.length) {
    return null;
  }

  const currentProduct = products[currentIndex];

  return (
    <div className={cn("w-full", className)}>
      <div className="relative w-full overflow-hidden rounded-lg bg-background">
        <div className="relative aspect-square w-full">
          <Link href={`/products/headwear/${currentProduct.id}`}>
            <Card className="overflow-hidden border-0 bg-transparent">
              <div className="relative aspect-square w-full">
                <Image
                  src={currentProduct.imageUrl.split(",")[0] || "/placeholder.jpg"}
                  alt={currentProduct.name}
                  fill
                  className="object-cover transition-opacity duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="font-medium text-lg truncate">
                  {currentProduct.name}
                </h3>
                <p className="text-sm text-white/80">
                  {currentProduct.stock} in stock
                </p>
              </div>
            </Card>
          </Link>
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={handlePrevious}
          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md hover:bg-white transition-colors"
          aria-label="Previous product"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md hover:bg-white transition-colors"
          aria-label="Next product"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Progress Indicators */}
        <div className="absolute bottom-4 left-0 right-0 z-10">
          <div className="flex justify-center gap-1.5">
            {products.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (!isAnimating) {
                    setIsAnimating(true);
                    setCurrentIndex(idx);
                    setTimeout(() => setIsAnimating(false), 500);
                  }
                }}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  idx === currentIndex
                    ? "w-6 bg-white"
                    : "w-1.5 bg-white/50 hover:bg-white/75"
                )}
                aria-label={`Go to product ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCarousel;