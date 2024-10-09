"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Product } from "@prisma/client";
import Image from "next/image";
import { fetchSummerCollections } from "./actions";
import SummerProductsSkeleton from "./SummerProductsSkeleton";

const responsive = {
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 4, slidesToSlide: 4 },
  tablet: { breakpoint: { max: 1024, min: 464 }, items: 2, slidesToSlide: 2 },
  mobile: { breakpoint: { max: 464, min: 0 }, items: 1, slidesToSlide: 1 },
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

const ProductCarousel = ({
  products,
  title,
}: {
  products: Product[];
  title: string;
}) => {
  if (products.length === 0) {
    return (
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        <p className="text-gray-600">No products available in this category.</p>
      </div>
    );
  }

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
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
                  priority
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

type ProductCategories = {
  Men: Product[];
  Women: Product[];
  Unisex: Product[];
  Kids: Product[];
  New: Product[];
  "T-Shirts": Product[];
  Headwear: Product[];
};

const SummerLanding = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchSummerCollections();

      if (result.success) {
        setProducts(result.data);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      setError("Failed to load products. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const categorizeProducts = useCallback(
    (products: Product[]): ProductCategories => {
      const newProductsData: ProductCategories = {
        Men: [],
        Women: [],
        Unisex: [],
        Kids: [],
        New: [],
        "T-Shirts": [],
        Headwear: [],
      };

      products.forEach(product => {
        const categories = (product.categories || "").toLowerCase();
        const name = (product.name || "").toLowerCase();
        const type = (product.type || "").toLowerCase();

        const isExplicitlyFor = (gender: string) =>
          name.includes(gender) ||
          name.includes(gender === "men" ? "male" : "female") ||
          (gender === "women" &&
            (name.includes("ladies") || name.includes("women's")));

        if (
          categories.includes("new arrivals") ||
          categories.includes("new in")
        ) {
          newProductsData.New.push(product);
        }

        if (categories.includes("kids")) {
          newProductsData.Kids.push(product);
        } else if (
          categories.includes("headwear") ||
          categories.includes("hats") ||
          name.includes("hat") ||
          name.includes("cap") ||
          name.includes("visor")
        ) {
          newProductsData.Headwear.push(product);
        } else if (name.includes("unisex")) {
          newProductsData.Unisex.push(product);
        } else if (isExplicitlyFor("women") || name.includes("ladies")) {
          newProductsData.Women.push(product);
        } else if (isExplicitlyFor("men")) {
          newProductsData.Men.push(product);
        } else if (
          categories.includes("women") &&
          !categories.includes("men")
        ) {
          newProductsData.Women.push(product);
        } else if (
          categories.includes("men") &&
          !categories.includes("women")
        ) {
          newProductsData.Men.push(product);
        } else if (categories.includes("men") && categories.includes("women")) {
          if (name.includes("women") || name.includes("ladies")) {
            newProductsData.Women.push(product);
          } else {
            newProductsData.Men.push(product);
          }
        } else {
          newProductsData.Unisex.push(product);
        }

        if (
          type.includes("t-shirt") ||
          categories.includes("t-shirts") ||
          name.includes("t-shirt")
        ) {
          newProductsData["T-Shirts"].push(product);
        }
      });

      return newProductsData;
    },
    []
  );

  const productsData = useMemo(
    () => categorizeProducts(products),
    [products, categorizeProducts]
  );

  if (isLoading) {
    return <SummerProductsSkeleton />;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Summer Collection</h1>
      {Object.entries(productsData).map(([category, categoryProducts]) => (
        <ProductCarousel
          key={category}
          products={categoryProducts}
          title={`${category} Summer Collection`}
        />
      ))}
    </div>
  );
};

export default SummerLanding;
