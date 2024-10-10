"use client";
import React, { useEffect, useState, useRef } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Product } from "@prisma/client";
import Image from "next/image";
import { fetchNewCollections } from "../actions";
import NewProductsSkeleton from "./NewProductsSkeleton";
import {
  responsive,
  formatPrice,
  getFirstValidImageUrl,
  setupCarouselTouchHandlers,
  addCarouselStyles
} from "./newProductsUtils";

const NewProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const result = await fetchNewCollections();
        if (result.success) {
          setProducts(result.data);
        } else {
          console.error("Failed to fetch new products:", result.error);
        }
      } catch (error) {
        console.error("Error fetching new products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    if (carouselRef.current) {
      const cleanup = setupCarouselTouchHandlers(carouselRef.current);
      return cleanup;
    }
  }, []);

  useEffect(() => {
    const cleanup = addCarouselStyles();
    return cleanup;
  }, []);

  if (isLoading) {
    return <NewProductsSkeleton />;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      <h2 className="text-2xl font-bold mb-6">New Products</h2>
      <div className="relative overflow-hidden" ref={carouselRef}>
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
            <div key={product.id} className="px-2 pb-4">
              <div className="bg-white rounded-lg shadow-md overflow-hidden h-full">
                <div className="relative w-full h-48">
                  <Image
                    src={getFirstValidImageUrl(product.imageUrl)}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2 truncate" title={product.name}>
                    {product.name}
                  </h3>
                  <p className="text-gray-600">
                    {formatPrice(product.regularPrice)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default NewProducts;