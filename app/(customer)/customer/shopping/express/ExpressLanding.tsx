"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const collections: string[] = [
  "SPORT",
  "WINTER",
  "SUMMER",
  "BASEBALL",
  "SIGNATURE",
  "LEISURE",
  "INDUSTRIAL",
  "FASHION",
  "CAMO",
];

interface CardProps {
  collection: string;
}

const Card: React.FC<CardProps> = ({ collection }) => (
  <Link
    href={`/customer/shopping/${collection.toLowerCase()}`}
    className="block w-full h-full"
  >
    <div className="w-full h-full flex flex-col items-center justify-center bg-white rounded-lg shadow-2xl shadow-black p-4 transition-transform hover:scale-105 m-2">
      <div className="w-32 h-32 bg-red-500 rounded-full mb-4" />
      <span className="text-xl font-bold text-gray-800">{collection}</span>
    </div>
  </Link>
);

const ExpressLanding: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const cardsPerSlide = 4;
  const totalSlides = Math.ceil(collections.length / cardsPerSlide);

  const nextSlide = () => {
    setCurrentSlide(prev => Math.min(prev + 1, totalSlides - 1));
  };

  const prevSlide = () => {
    setCurrentSlide(prev => Math.max(prev - 1, 0));
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 75) {
      nextSlide();
    }
    if (touchEndX.current - touchStartX.current > 75) {
      prevSlide();
    }
  };

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.style.transition = "transform 0.3s ease-in-out";
      carouselRef.current.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
  }, [currentSlide]);

  return (
    <div className="relative w-full max-w-6xl mx-auto py-12 px-4">
      <div className="overflow-hidden">
        <div
          ref={carouselRef}
          className="flex"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {[...Array(totalSlides)].map((_, slideIndex) => (
            <div
              key={slideIndex}
              className="flex-shrink-0 w-full grid grid-cols-2 md:grid-cols-4 gap-6"
            >
              {collections
                .slice(
                  slideIndex * cardsPerSlide,
                  (slideIndex + 1) * cardsPerSlide
                )
                .map((collection, index) => (
                  <Card key={index} collection={collection} />
                ))}
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={prevSlide}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={currentSlide === 0}
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={currentSlide === totalSlides - 1}
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

export default ExpressLanding;
