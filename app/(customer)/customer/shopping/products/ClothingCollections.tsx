"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import useEmblaCarousel from "embla-carousel-react";
import { collections } from "./CollectionTypes";

const ClothingCollections = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    slidesToScroll: 1,
    dragFree: true,
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

  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Clothing Collections
      </h2>
      <div className="relative">
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex -mx-2">
            {collections.map((collection, index) => (
              <div key={index} className="flex-[0_0_16.666%] min-w-0 px-2">
                <Link
                  href={`/collection/${collection.name.toLowerCase()}`}
                  passHref
                >
                  <Card className="overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer">
                    <CardContent className="p-0">
                      <div className="relative h-40 w-full">
                        <Image
                          src={collection.image}
                          alt={`${collection.name} Collection`}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          style={{ objectFit: "cover" }}
                          className="transition-transform duration-300"
                        />
                      </div>
                      <div className="p-2 bg-white">
                        <h3 className="text-sm font-semibold text-gray-800 truncate">
                          {collection.name}
                        </h3>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-4">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full mx-1 transition-all duration-300 ${
              index === selectedIndex ? "bg-primary w-3" : "bg-gray-300"
            }`}
            onClick={() => emblaApi && emblaApi.scrollTo(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default ClothingCollections;
