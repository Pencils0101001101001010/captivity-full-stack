import React, { useRef, useMemo } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Product } from "@prisma/client";
import { responsive } from "./carouselConfig";
import ProductCard from "./ProductCard";
import { useTouchSwipe } from "./useTouchSwipe";
import { useCarouselStyles } from "./useCarouselStyles";

interface ProductCarouselProps {
  products: Product[];
  title: string;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({
  products,
  title,
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);

  useTouchSwipe(carouselRef);
  useCarouselStyles();

  const groupedProducts = useMemo(() => {
    const grouped = products.reduce(
      (acc, product) => {
        // Extract the base name (everything before the first comma or dash)
        const baseName = product.name.split(/[,-]/)[0].trim();

        if (!acc[baseName]) {
          acc[baseName] = {
            ...product,
            variants: [product],
          };
        } else {
          acc[baseName].variants.push(product);
        }

        return acc;
      },
      {} as Record<string, Product & { variants: Product[] }>
    );

    return Object.values(grouped);
  }, [products]);

  if (groupedProducts.length === 0) {
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
        {groupedProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </Carousel>
    </div>
  );
};

export default ProductCarousel;
