"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const images = [
  {
    src: "/Long-Sleeve-Golfer-Charcoal-gray.jpg",
    title: "Long Sleeve Golfer",
    rating: 5,
    link: "/apparel/golfers",
  },
  {
    src: "/ice-beanie-burnt-orange-.jpg",
    title: "Ice Beanie",
    rating: 4,
    link: "/headwear/beanies",
  },
  {
    src: "/Alaska-Puffer-Jacket-Black.jpg",
    title: "Alaska Puffer Jacket Black",
    rating: 4,
    link: "/headwear/flat-peaks",
  },
  {
    src: "/Linen-model.jpg",
    title: "Linen Cap",
    rating: 4,
    link: "/headwear/trucker-caps",
  },
  {
    src: "/Multifuctional-Headwear-SA-Green-Right.jpg",
    title: "Multifunctional Headwear",
    rating: 4,
    link: "/headwear/multifunctional-headwear",
  },
  {
    src: "/Classic-T-Shirt-Model-2.jpg",
    title: "Classic T-Shirt",
    rating: 4,
    link: "/apparel/t-shirts",
  },
  {
    src: "/Basic-crewneck-Sweater_Lilac.jpg",
    title: "Basic Crew Neck Sweater",
    rating: 4,
    link: "/apparel/men",
  },
];

export default function ProductCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000); // Rotate every 4 seconds

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <div className="hidden lg:block">
      <div className="flex flex-col items-center  ">
        <span className="text-xl text-gray-700 font-bold">
          NEW PRODUCTS
          <div className="w-[300px] h-px bg-gray-500 my-2 mb-4" />
        </span>
        <div className="relative w-[300px] max-w-xs overflow-hidden rounded-lg shadow-lg bg-gray-200">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {images.map((image, index) => (
              <div key={index} className="w-full flex-shrink-0">
                <Link href={image.link}>
                  <Image
                    src={image.src}
                    alt={image.title}
                    width={1300}
                    height={1300}
                    className="object-cover w-full h-70 cursor-pointer"
                  />
                </Link>
                <div className="p-4 bg-gray-200">
                  <h3 className="text-lg text-gray-700 font-semibold">
                    {image.title}
                  </h3>
                  <div className="flex items-center">
                    {Array.from(
                      { length: Math.floor(image.rating) },
                      (_, i) => (
                        <span key={i} className="text-yellow-500">
                          ★
                        </span>
                      )
                    )}
                    {image.rating % 1 !== 0 && (
                      <span className="text-yellow-500">★</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex space-x-2 mt-4">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-4 h-1 rounded-sm ${
                index === currentIndex ? "bg-red-500" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
