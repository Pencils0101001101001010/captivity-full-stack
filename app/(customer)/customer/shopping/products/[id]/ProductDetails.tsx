"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Product } from "@prisma/client";
import { ChevronDown, ChevronLeft } from "lucide-react";
import { formatDescription } from "@/lib/utils";
import Image from "next/image";
import ColorSelector from "./ColorSelector";
import QuantitySelector from "./QuantitySelector";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ProductDetailsProps {
  product: Product;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [mainImage, setMainImage] = useState<string>("");
  const [availableQuantity, setAvailableQuantity] = useState<number>(0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const colors = [
    ...new Set(
      product.attribute1Values ? product.attribute1Values.split(", ") : []
    ),
  ];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const sizes = [
    ...new Set(
      product.attribute2Values ? product.attribute2Values.split(", ") : []
    ),
  ];
  const images = product.imageUrl.split(", ");

  const renderCount = useRef(0);
  const isInitialized = useRef(false);

  useEffect(() => {
    console.log("ProductDetails useEffect running");
    if (!isInitialized.current) {
      const initialColor = product.attribute1Default || colors[0] || "";
      console.log("Setting initial color:", initialColor);
      setSelectedColor(initialColor);

      const initialImage =
        images.find(img =>
          img.toLowerCase().includes(initialColor.toLowerCase())
        ) || images[0];
      console.log("Setting initial image:", initialImage);
      setMainImage(initialImage);

      if (sizes.length > 0) {
        const initialSize = product.attribute2Default || sizes[0];
        console.log("Setting initial size:", initialSize);
        setSelectedSize(initialSize);
      }

      setAvailableQuantity(product.stock || 0);
      isInitialized.current = true;
    }
  }, [product, colors, sizes, images]);

  const updateMainImageAndColor = useCallback(
    (newImage: string) => {
      console.log("updateMainImageAndColor called with image:", newImage);
      setMainImage(newImage);

      // Find the color that matches the new image
      const matchingColor = colors.find(color =>
        newImage.toLowerCase().includes(color.toLowerCase())
      );

      if (matchingColor) {
        console.log("Matching color found:", matchingColor);
        setSelectedColor(matchingColor);
      } else {
        console.log("No matching color found for image:", newImage);
      }
    },
    [colors]
  );

  const handleColorChange = useCallback(
    (color: string) => {
      console.log("handleColorChange called with color:", color);
      setSelectedColor(color);

      // Find the image that matches the new color
      const matchingImage =
        images.find(img => img.toLowerCase().includes(color.toLowerCase())) ||
        images[0];

      setMainImage(matchingImage);
    },
    [images]
  );

  const handleSizeChange = useCallback((size: string) => {
    console.log("Size changed to:", size);
    setSelectedSize(size);
  }, []);

  const handleQuantityChange = useCallback((newQuantity: number) => {
    console.log("Quantity changed to:", newQuantity);
    setQuantity(newQuantity);
  }, []);

  renderCount.current += 1;
  console.log(`ProductDetails rendering (count: ${renderCount.current})`);
  console.log(
    "Current state - Color:",
    selectedColor,
    "Size:",
    selectedSize,
    "Quantity:",
    quantity,
    "Main Image:",
    mainImage
  );
  console.log("Available sizes:", sizes);

  return (
    <>
      {/* Back to Express Shop Button at the Top */}
      <div className="ml-[-20px] mr-4 mb-8">
        <Button asChild variant="default" className="mb-4 ">
          <Link
            href="/customer/shopping/products"
            className="flex items-center"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Express Shop
          </Link>
        </Button>
      </div>

      {/* Product Details Section */}
      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl bg-white p-6 rounded-lg shadow-2xl shadow-black">
        <div className="lg:w-1/2 space-y-4">
          {mainImage && (
            <Image
              src={mainImage}
              alt={product.name}
              width={400}
              height={400}
              className="w-full h-auto object-cover rounded-lg shadow-md"
              priority
            />
          )}
          <div className="flex gap-2 overflow-x-auto">
            {images.map((img, index) => (
              <Image
                key={index}
                src={img}
                alt={`${product.name} - view ${index + 1}`}
                width={80}
                height={80}
                className="w-20 h-20 object-cover rounded cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
                onClick={() => updateMainImageAndColor(img)}
                priority
              />
            ))}
          </div>
        </div>
        <div className="lg:w-1/2 space-y-6">
          <h2 className="text-3xl font-bold text-gray-800">{product.name}</h2>
          <div
            dangerouslySetInnerHTML={formatDescription(
              product.shortDescription
            )}
            className="mt-2 pl-4 description-content"
          />

          <div className="space-y-4">
            {colors.length > 0 && (
              <ColorSelector
                colors={colors}
                selectedColor={selectedColor}
                onColorChange={handleColorChange}
              />
            )}

            {sizes.length > 0 && (
              <div className="w-full max-w-xs">
                <label className="block text-sm font-medium text-gray-700">
                  Size
                </label>
                <div className="mt-1 relative">
                  <select
                    value={selectedSize}
                    onChange={e => handleSizeChange(e.target.value)}
                    className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  >
                    {sizes.map(size => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div>
              </div>
            )}

            <QuantitySelector
              availableQuantity={availableQuantity}
              selectedQuantity={quantity}
              onQuantityChange={handleQuantityChange}
            />
          </div>

          <div className="mt-6 space-y-2 text-sm text-gray-600">
            <p>
              <span className="font-semibold">SKU:</span> {product.sku}
            </p>
            <p>
              <span className="font-semibold">Categories:</span>{" "}
              {product.categories}
            </p>
            {product.tags && (
              <p>
                <span className="font-semibold">Tags:</span> {product.tags}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(ProductDetails);
