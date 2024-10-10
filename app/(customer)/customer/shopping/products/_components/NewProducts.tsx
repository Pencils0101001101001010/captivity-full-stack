"use client";
import React, { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Product } from "@prisma/client";
import Image from "next/image";
import { fetchNewCollections } from "../actions";
import NewProductsSkeleton from "./NewProductsSkeleton";

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

const formatPrice = (price: number | null) =>
  price === null ? "Price not available" : `R${price.toFixed(2)}`;

const getFirstValidImageUrl = (imageUrl: string | null) => {
  if (!imageUrl) return "/placeholder-image.jpg";
  const urls = imageUrl.split(",").map(url => url.trim());
  return (
    urls.find(url => url && !url.endsWith("404")) || "/placeholder-image.jpg"
  );
};

const NewProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) {
    return <NewProductsSkeleton />;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      <h2 className="text-2xl font-bold mb-6">New Products</h2>
      <Carousel
        swipeable={true}
        draggable={false}
        showDots={true}
        responsive={responsive}
        ssr={true}
        infinite={true}
        autoPlay={false}
        keyBoardControl={true}
        customTransition="all .5s"
        transitionDuration={500}
        containerClass="carousel-container"
        removeArrowOnDeviceType={["tablet", "mobile"]}
        dotListClass="custom-dot-list-style"
        itemClass="carousel-item-padding-40-px"
      >
        {products.map(product => (
          <div key={product.id} className="px-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600">
                  {formatPrice(product.regularPrice)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default NewProducts;
