"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";

const images = [
  {
    src: "/alaska-puffer.jpg",
    title: "Alaska Puffer Jacket",
    link: "/products/puffer-jacket",
  },
  {
    src: "/Banner-Web.jpg",
    title: "Long Sleeve Golfer",
    link: "/products/long-sleeve-golfer",
  },
  {
    src: "/Web-banner-(1).jpg",
    title: "Ice Beanie",
    link: "/products/ice-beanie",
  },
  {
    src: "/web-banner.jpg",
    title: "Basic Crew Neck",
    link: "/products/basic-sweater",
  },
];

export default function CarouselPlugin() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);

  const startCarousel = () => {
    intervalRef.current = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
    }, 4000);
  };

  const stopCarousel = () => {
    clearInterval(intervalRef.current);
  };

  useEffect(() => {
    startCarousel();
    return () => stopCarousel();
  }, []);

  return (
    <div
      className="relative overflow-hidden w-full h-full"
      onMouseEnter={stopCarousel}
      onMouseLeave={startCarousel}
    >
      <div
        className="flex transition-transform duration-500"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-full h-full flex items-center justify-center"
            style={{ cursor: "pointer" }}
          >
            <Link href={image.link}>
              <Image
                src={image.src}
                alt={image.title}
                width={1903}
                height={438}
                priority
              />
            </Link>
          </div>
        ))}
      </div>
      <section className="flex my-4">
        <div className="absolute bottom-4 w-full flex justify-center">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-1 w-1 mx-1 rounded-full ${
                currentIndex === index ? "bg-red-600" : "bg-gray-400"
              }`}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
