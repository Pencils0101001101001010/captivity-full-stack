// components/CategoryCarousel.tsx
import React from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import ProductCard from './ProductCard';
import { Product } from './types';

interface CategoryCarouselProps {
  title: string;
  products: Product[];
}

const CategoryCarousel: React.FC<CategoryCarouselProps> = ({ title, products }) => {
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  };

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <Carousel 
        responsive={responsive}
        infinite={true}
        keyBoardControl={true}
        customTransition="all .5"
        transitionDuration={500}
        containerClass="carousel-container"
        removeArrowOnDeviceType={["tablet", "mobile"]}
        dotListClass="custom-dot-list-style"
        itemClass="px-2 pb-4"
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </Carousel>
    </div>
  );
};

export default CategoryCarousel;