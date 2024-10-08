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
import { useMotionValue } from "framer-motion";
import Image from "next/image";

interface Collection {
  name: string;
  imageHref: string;
}

const collections: Collection[] = [
  {
    name: "Summer",
    imageHref:
      "https://images.unsplash.com/photo-1726491703560-87cc8a3624b9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzfHx8ZW58MHx8fHx8",
  },
  {
    name: "Winter",
    imageHref:
      "https://images.unsplash.com/photo-1726491703560-87cc8a3624b9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzfHx8ZW58MHx8fHx8",
  },
  {
    name: "Sport",
    imageHref:
      "https://images.unsplash.com/photo-1726491703560-87cc8a3624b9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzfHx8ZW58MHx8fHx8",
  },
  {
    name: "T- Shirts",
    imageHref:
      "https://images.unsplash.com/photo-1726491703560-87cc8a3624b9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzfHx8ZW58MHx8fHx8",
  },
  {
    name: "Caps",
    imageHref:
      "https://images.unsplash.com/photo-1726491703560-87cc8a3624b9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzfHx8ZW58MHx8fHx8",
  },
  {
    name: "Hoodies",
    imageHref:
      "https://images.unsplash.com/photo-1726491703560-87cc8a3624b9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzfHx8ZW58MHx8fHx8",
  },
  {
    name: "Golfers",
    imageHref:
      "https://images.unsplash.com/photo-1726491703560-87cc8a3624b9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzfHx8ZW58MHx8fHx8",
  },
  {
    name: "Men",
    imageHref:
      "https://images.unsplash.com/photo-1726491703560-87cc8a3624b9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzfHx8ZW58MHx8fHx8",
  },
  {
    name: "Women",
    imageHref:
      "https://images.unsplash.com/photo-1726491703560-87cc8a3624b9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzfHx8ZW58MHx8fHx8",
  },
  {
    name: "Kids",
    imageHref:
      "https://images.unsplash.com/photo-1726491703560-87cc8a3624b9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzfHx8ZW58MHx8fHx8",
  },
  {
    name: "Bottoms",
    imageHref:
      "https://images.unsplash.com/photo-1726491703560-87cc8a3624b9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzfHx8ZW58MHx8fHx8",
  },
  {
    name: "Jackets",
    imageHref:
      "https://images.unsplash.com/photo-1726491703560-87cc8a3624b9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzfHx8ZW58MHx8fHx8",
  },
  {
    name: "Hats",
    imageHref:
      "https://images.unsplash.com/photo-1726491703560-87cc8a3624b9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzfHx8ZW58MHx8fHx8",
  },
  {
    name: "Pre Curved",
    imageHref:
      "https://images.unsplash.com/photo-1726491703560-87cc8a3624b9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzfHx8ZW58MHx8fHx8",
  },
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
      <h2 className="text-5xl font-bold mb-4 text-center">Express Shop</h2>
      <Carousel className="w-full" ref={carouselRef}>
        <CarouselContent>
          {collections.map((collection, index) => (
            <CarouselItem key={index} className="md:basis-1/4 lg:basis-1/5">
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 m-3 overflow-hidden">
                <CardContent className="flex flex-col items-center justify-center p-6 bg-gradient-to-b from-white to-gray-100">
                  <div className="relative w-20 h-20 mb-4 rounded-full overflow-hidden shadow-md">
                    <Image
                      src={collection.imageHref}
                      alt={collection.name}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-300 hover:scale-110"
                    />
                  </div>
                  <h3 className="font-semibold text-center text-gray-800 hover:text-blue-600 transition-colors duration-300">
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
