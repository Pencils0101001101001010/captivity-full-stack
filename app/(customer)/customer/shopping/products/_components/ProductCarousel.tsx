import React, { useEffect, useRef } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Product } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { formatPrice, getFirstValidImageUrl } from "../summer/utils";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
    slidesToSlide: 4,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    slidesToSlide: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1,
  },
};

interface ProductCarouselProps {
  products: Product[];
  title: string;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({
  products,
  title,
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    let startX: number;
    let startY: number;
    let startTime: number;
    let isSwiping = false;
    const threshold = 10;
    const restraint = 100;
    const allowedTime = 300;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      startTime = new Date().getTime();
      isSwiping = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!startX || !startY) return;

      const touch = e.touches[0];
      const distX = touch.clientX - startX;
      const distY = touch.clientY - startY;
      const elapsedTime = new Date().getTime() - startTime;

      if (elapsedTime <= allowedTime) {
        if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
          e.preventDefault();
          isSwiping = true;
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isSwiping) {
        e.preventDefault();
      }
      isSwiping = false;
    };

    carousel.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    carousel.addEventListener("touchmove", handleTouchMove, { passive: false });
    carousel.addEventListener("touchend", handleTouchEnd, { passive: false });

    return () => {
      carousel.removeEventListener("touchstart", handleTouchStart);
      carousel.removeEventListener("touchmove", handleTouchMove);
      carousel.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .react-multi-carousel-list {
        overflow: hidden !important;
      }
      .react-multi-carousel-track {
        touch-action: pan-y;
      }
      .react-multiple-carousel__arrow {
        z-index: 10 !important;
      }
      .react-multiple-carousel__arrow--left {
        left: 0 !important;
      }
      .react-multiple-carousel__arrow--right {
        right: 0 !important;
      }
    `;
    document.head.append(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (products.length === 0) {
    return (
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        <p className="text-gray-600">No products available in this category.</p>
      </div>
    );
  }

  return (
    <div className="mb-12 relative overflow-hidden" ref={carouselRef}>
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <Carousel
        swipeable={true}
        draggable={false}
        showDots={true}
        responsive={responsive}
        ssr={true}
        infinite={false}
        autoPlay={false}
        keyBoardControl={true}
        customTransition="transform 300ms ease-in-out"
        transitionDuration={300}
        containerClass="carousel-container"
        removeArrowOnDeviceType={["tablet", "mobile"]}
        dotListClass="custom-dot-list-style"
        itemClass="carousel-item-padding-40-px"
        className="pb-12"
        partialVisible={false}
      >
        {products.map(product => (
          <Link
            href={`/product/${product.id}`}
            key={product.id}
            className="block px-2 pb-4"
          >
            <div className="bg-white rounded-lg shadow-md overflow-hidden h-full transition-transform duration-300 hover:scale-105">
              <div className="relative w-full h-48">
                <Image
                  src={getFirstValidImageUrl(product.imageUrl)}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="p-4">
                <h3
                  className="text-lg font-semibold mb-2 truncate"
                  title={product.name}
                >
                  {product.name}
                </h3>
                <p className="text-gray-600">
                  {formatPrice(product.regularPrice)}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </Carousel>
    </div>
  );
};

export default ProductCarousel;
