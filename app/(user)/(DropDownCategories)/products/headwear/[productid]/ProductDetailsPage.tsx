"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductWithFeaturedImage } from "./ProductTypes";
import { Variation } from "@prisma/client";
import { fetchProductById } from "./actions"; // Make sure this path is correct
import { useParams } from "next/navigation";
import Link from "next/link";
import RelatedProducts from "@/app/(user)/_components/RelatedProducts";

const ProductDetail: React.FC = () => {
  const params = useParams();
  const id = params?.productid as string;

  const [product, setProduct] = useState<ProductWithFeaturedImage | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      if (id) {
        setLoading(true);
        setError(null);
        try {
          const result = await fetchProductById(Number(id));
          if (result.success && result.data) {
            setProduct(result.data);
            setMainImage(result.data.featuredImage?.large || "");
            if (result.data.variations.length > 0) {
              setSelectedColor(result.data.variations[0].color);
              setSelectedSize(result.data.variations[0].size);
            }
          } else {
            setError(result.error || "Failed to fetch product");
          }
        } catch (err) {
          setError("An unexpected error occurred while fetching the product.");
        } finally {
          setLoading(false);
        }
      }
    };

    loadProduct();
  }, [id]);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    const variation = product?.variations.find(v => v.color === color);
    if (variation) {
      setMainImage(variation.variationImageURL);
    }
  };

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
  };

  const handleThumbnailClick = (imageUrl: string) => {
    setMainImage(imageUrl);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>Product not found</div>;

  const availableColors = Array.from(
    new Set(product.variations.map(v => v.color))
  );
  const availableSizes = Array.from(
    new Set(product.variations.map(v => v.size))
  );

  const selectedVariation = product.variations.find(
    v => v.color === selectedColor && v.size === selectedSize
  );

  return (
    <div className="container mx-auto my-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="relative h-96 w-full mb-4">
            <Image
              src={mainImage || "/placeholder-image.jpg"}
              alt={product.productName}
              fill
              style={{ objectFit: "cover" }}
              className="rounded-lg"
            />
          </div>
          <div className="overflow-x-auto hide-scrollbar">
            <div className="flex space-x-2 w-max">
              {product.variations.map((variation: Variation) => (
                <button
                  key={variation.id}
                  onClick={() =>
                    handleThumbnailClick(variation.variationImageURL)
                  }
                  className="relative h-24 w-24 flex-shrink-0"
                >
                  <Image
                    src={variation.variationImageURL}
                    alt={`${product.productName} - ${variation.color}`}
                    fill
                    style={{ objectFit: "cover" }}
                    className="rounded-md"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.productName}</h1>
          <p className="text-2xl font-semibold mb-4">
            R{product.sellingPrice.toFixed(2)}
          </p>

          <div className="mb-4">
            <label className="block mb-2">Color:</label>
            <div className="flex space-x-2">
              {availableColors.map(color => (
                <button
                  key={color}
                  onClick={() => handleColorChange(color)}
                  className={`w-8 h-8 rounded-full ${
                    selectedColor === color
                      ? "ring-2 ring-offset-2 ring-black"
                      : ""
                  }`}
                  style={{ backgroundColor: color.toLowerCase() }}
                />
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-2">Size:</label>
            <Select value={selectedSize || ""} onValueChange={handleSizeChange}>
              {availableSizes.map(size => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </Select>
          </div>

          <Button className="w-full mb-4">
            <Link href="/login">Login</Link>
          </Button>

          <Tabs defaultValue="description">
            <TabsList>
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
            </TabsList>
            <TabsContent value="description">
              <div dangerouslySetInnerHTML={{ __html: product.description }} />
            </TabsContent>
            <TabsContent value="features">
              <ul className="list-disc pl-5">
                <li>6 Panel Unstructured</li>
                <li>Embroidered Eyelets</li>
                <li>Pre-Curved Peak</li>
                <li>Low Profile</li>
              </ul>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
