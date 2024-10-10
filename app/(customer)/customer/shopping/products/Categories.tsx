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
import Link from "next/link";

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
      "https://images.unsplash.com/photo-1521045452978-3753d26aaee4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fG1lbiUyMGNsb3RoaW5nfGVufDB8fDB8fHww",
  },
  {
    name: "Sport",
    imageHref:
      "https://images.unsplash.com/photo-1488424138610-252b5576e079?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHBlcnNvbnxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    name: "T-Shirts",
    imageHref:
      "https://images.unsplash.com/photo-1624302884806-4b9f5d62b8cd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDN8fHQlMjAlMjBzaGlydHN8ZW58MHx8MHx8fDA%3D",
  },
  {
    name: "Caps",
    imageHref:
      "https://images.unsplash.com/photo-1620743364195-6915419c6dc6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODh8fGNhcHN8ZW58MHx8MHx8fDA%3D",
  },
  {
    name: "Hoodies",
    imageHref:
      "https://images.unsplash.com/photo-1649566169356-e47e8d9809e4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGhvb2RpZXN8ZW58MHx8MHx8fDA%3D",
  },
  {
    name: "Golfers",
    imageHref:
      "https://images.unsplash.com/photo-1621369132713-4cfdb898dfcb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTR8fGdvbGZlcnN8ZW58MHx8MHx8fDA%3D",
  },
  {
    name: "Men",
    imageHref:
      "https://images.unsplash.com/photo-1600364768584-adefe419431a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bWVuJTIwd2VhcnxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    name: "Women",
    imageHref:
      "https://images.unsplash.com/photo-1500771471050-fb3ee40b66c2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nzl8fHdvbWVuJTIwd2VhcnxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    name: "Kids",
    imageHref:
      "https://images.unsplash.com/photo-1639143145655-90e63b64383a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8a2lkcyUyMHdlYXJ8ZW58MHx8MHx8fDA%3D",
  },
  {
    name: "Bottoms",
    imageHref:
      "https://images.unsplash.com/photo-1504198458649-3128b932f49e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Ym90dG9tcyUyMGNsb3RoZXN8ZW58MHx8MHx8fDA%3D",
  },
  {
    name: "Jackets",
    imageHref:
      "https://images.unsplash.com/photo-1608193882486-3af78815f450?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGphY2tldHN8ZW58MHx8MHx8fDA%3D",
  },
  {
    name: "Hats",
    imageHref:
      "https://images.unsplash.com/photo-1533827432537-70133748f5c8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGhhdHN8ZW58MHx8MHx8fDA%3D",
  },
  {
    name: "Pre-Curved",
    imageHref:
      "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cHJlJTIwY3VydmVkJTIwY2xvdGhlc3xlbnwwfHwwfHx8MA%3D%3D",
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
      <h2 className="text-5xl font-bold mb-2 text-center">Express Shop</h2>
      <Carousel className="w-full" ref={carouselRef}>
        <CarouselContent>
          {collections.map((collection, index) => (
            <CarouselItem key={index} className="md:basis-1/4 lg:basis-1/5">
              <Link
                href={`/customer/shopping/products/${collection.name.toLowerCase()}`}
              >
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 m-3 overflow-hidden">
                  <CardContent className="flex flex-col items-center justify-center p-6 bg-gradient-to-b from-white to-gray-100">
                    <div className="relative w-[120px] h-[120px] mb-4 rounded-full overflow-hidden shadow-md">
                      <Image
                        src={collection.imageHref}
                        alt={collection.name}
                        fill
                        sizes="120px"
                        className="object-cover transition-transform duration-300 hover:scale-110"
                      />
                    </div>
                    <h3 className="text-xl font-semibold text-center text-gray-800 hover:text-blue-600 transition-colors duration-300">
                      {collection.name}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
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
