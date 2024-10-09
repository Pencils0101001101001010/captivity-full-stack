<!-- "use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Product } from "@prisma/client";
import Image from "next/image";
import { fetchSummerCollections } from "./actions";

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

const fetcher = async () => {
  const categories: ("Men" | "Women" | "Kids" | "New" | "T- Shirts")[] = [
    "Men",
    "Women",
    "Kids",
    "New",
    "T- Shirts",
  ];
  const results = await Promise.all(
    categories.map(category => fetchSummerCollections(undefined, [category]))
  );

  const productsData: { [key: string]: Product[] } = {};
  results.forEach((result, index) => {
    if (result.success) {
      productsData[categories[index]] = result.data;
    } else {
      console.error(
        `Failed to fetch ${categories[index]} products:`,
        result.error
      );
      productsData[categories[index]] = []; // Initialize with empty array on error
    }
  });

  return productsData;
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
    console.log("Fetching data for all categories...");
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
      console.error("Error fetching summer products:", error);
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

        console.log(`Categorizing product: ${product.name}`);
        console.log(`Categories: ${categories}`);
        console.log(`Type: ${type}`);

        const isExplicitlyFor = (gender: string) =>
          name.includes(gender) ||
          name.includes(gender === "men" ? "male" : "female") ||
          name.includes(gender === "women" ? "ladies" : "");

        if (
          categories.includes("new arrivals") ||
          categories.includes("new in")
        ) {
          newProductsData.New.push(product);
          console.log("Added to: New");
        }

        if (categories.includes("kids")) {
          newProductsData.Kids.push(product);
          console.log("Added to: Kids");
        } else if (
          categories.includes("headwear") ||
          categories.includes("hats") ||
          name.includes("hat") ||
          name.includes("cap") ||
          name.includes("visor")
        ) {
          newProductsData.Headwear.push(product);
          console.log("Added to: Headwear");
        } else if (isExplicitlyFor("women")) {
          newProductsData.Women.push(product);
          console.log("Added to: Women");
        } else if (isExplicitlyFor("men")) {
          newProductsData.Men.push(product);
          console.log("Added to: Men");
        } else if (
          (categories.includes("men") && categories.includes("women")) ||
          name.includes("unisex")
        ) {
          newProductsData.Men.push(product);
          newProductsData.Women.push(product);
          newProductsData.Unisex.push(product);
          console.log("Added to: Men, Women, and Unisex");
        } else if (categories.includes("women")) {
          newProductsData.Women.push(product);
          console.log("Added to: Women (based on categories)");
        } else if (categories.includes("men")) {
          newProductsData.Men.push(product);
          console.log("Added to: Men (based on categories)");
        } else {
          newProductsData.Unisex.push(product);
          console.log("Added to: Unisex (default)");
        }

        if (
          type.includes("t-shirt") ||
          categories.includes("t-shirts") ||
          name.includes("t-shirt")
        ) {
          newProductsData["T-Shirts"].push(product);
          console.log("Added to: T-Shirts");
        }

        console.log("---");
      });

      return newProductsData;
    },
    []
  );

  const productsData = useMemo(
    () => categorizeProducts(products),
    [products, categorizeProducts]
  );

  console.log("Rendering SummerLanding");

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
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

export default SummerLanding; -->
