"use client";
import React, { useEffect, useRef, useCallback } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Bed, Car, Baby, Sparkles, Shirt, LucideIcon } from "lucide-react";
import { useMotionValue } from "framer-motion";

interface Collection {
  name: string;
  icon: LucideIcon;
}

const collections: Collection[] = [
  { name: "Appliances", icon: Bed },
  { name: "Auto", icon: Car },
  { name: "Baby & Toddler", icon: Baby },
  { name: "Beauty", icon: Sparkles },
  { name: "Apparel", icon: Shirt },
  { name: "Appliances", icon: Bed },
  { name: "Auto", icon: Car },
  { name: "Baby & Toddler", icon: Baby },
  { name: "Beauty", icon: Sparkles },
  { name: "Apparel", icon: Shirt },
  { name: "Appliances", icon: Bed },
  { name: "Auto", icon: Car },
  { name: "Baby & Toddler", icon: Baby },
  { name: "Beauty", icon: Sparkles },
  { name: "Apparel", icon: Shirt },
  // Add more collections as needed
];

const ProductCollections = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  const startAutoplay = useCallback(
    (delay: number) => {
      if (autoplayRef.current) {
        clearTimeout(autoplayRef.current);
      }
      autoplayRef.current = setTimeout(() => {
        if (carouselRef.current) {
          const scrollWidth = carouselRef.current.scrollWidth;
          const clientWidth = carouselRef.current.clientWidth;
          const maxScroll = scrollWidth - clientWidth;

          x.set((x.get() + clientWidth) % maxScroll);
          carouselRef.current.scrollTo({ left: x.get(), behavior: "smooth" });
        }
        startAutoplay(delay);
      }, delay);
    },
    [x]
  );

  useEffect(() => {
    startAutoplay(3000); // Start autoplay with 3 seconds delay
    return () => {
      if (autoplayRef.current) {
        clearTimeout(autoplayRef.current);
      }
    };
  }, [startAutoplay]);

  return (
    <div className="w-screen px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">Shop by Department</h2>
      <Carousel className="w-full" ref={carouselRef}>
        <CarouselContent>
          {collections.map((collection, index) => (
            <CarouselItem key={index} className="md:basis-1/4 lg:basis-1/5">
              <Card className="shadow-xl showdow-black m-3">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <collection.icon className="w-12 h-12 mb-2" />
                  <h3 className="font-semibold text-center">
                    {collection.name}
                  </h3>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default ProductCollections;
