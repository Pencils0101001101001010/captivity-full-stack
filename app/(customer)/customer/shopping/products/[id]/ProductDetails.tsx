"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Product } from "@prisma/client";
import { ChevronDown, ChevronLeft } from "lucide-react";
import { formatDescription } from "@/lib/utils";
import Image from "next/image";
import ColorSelector from "./ColorSelector";
import QuantitySelector from "./QuantitySelector";
import AddToCartButton from "./AddToCart";

interface ProductDetailsProps {
  product: Product;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [mainImage, setMainImage] = useState<string>("");
  const [availableQuantity, setAvailableQuantity] = useState<number>(0);
  const [hasMatchingImage, setHasMatchingImage] = useState<boolean>(true);
  const [isOutOfStock, setIsOutOfStock] = useState<boolean>(false);

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
    console.log("Available images:", images);
  }, [images]);

  const findImageForColor = useCallback(
    (color: string): string | null => {
      const normalizedColor = color.toLowerCase().replace(/\s+/g, "");
      console.log(`Normalized color: ${normalizedColor}`);

      const matchingImage = images.find(img => {
        const imgName = img.toLowerCase();
        const imgNameParts = imgName.split("-");
        const lastPart = imgNameParts[imgNameParts.length - 1].split(".")[0];

        console.log(`Checking image: ${imgName}, Last part: ${lastPart}`);

        const match =
          imgName.includes(normalizedColor) ||
          normalizedColor.includes(lastPart) ||
          (color === "Bottle" && imgName.includes("green")) ||
          (color === "Navy" && imgName.includes("blue"));

        console.log(`Match result: ${match}`);
        return match;
      });

      console.log(
        `Finding image for color: ${color}, Result: ${matchingImage || "Not found"}`
      );
      return matchingImage || null;
    },
    [images]
  );

  useEffect(() => {
    console.log("ProductDetails useEffect running");
    if (!isInitialized.current) {
      const initialColor = product.attribute1Default || colors[0] || "";
      console.log("Setting initial color:", initialColor);
      setSelectedColor(initialColor);

      const initialImage = findImageForColor(initialColor);
      console.log("Setting initial image:", initialImage);
      setMainImage(initialImage || images[0]);
      setHasMatchingImage(!!initialImage);

      if (sizes.length > 0) {
        const initialSize = product.attribute2Default || sizes[0];
        console.log("Setting initial size:", initialSize);
        setSelectedSize(initialSize);
      }

      const stockQuantity = product.stock || 0;
      setAvailableQuantity(stockQuantity);
      setIsOutOfStock(stockQuantity === 0);
      isInitialized.current = true;
    }
  }, [product, colors, sizes, images, findImageForColor]);

  const handleColorChange = useCallback(
    (color: string) => {
      console.log("handleColorChange called with color:", color);
      setSelectedColor(color);

      const matchingImage = findImageForColor(color);
      console.log("Setting main image to:", matchingImage);
      setMainImage(matchingImage || images[0]);
      setHasMatchingImage(!!matchingImage);
      setIsOutOfStock(availableQuantity === 0);
    },
    [findImageForColor, images, availableQuantity]
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
    mainImage,
    "Has Matching Image:",
    hasMatchingImage,
    "Is Out of Stock:",
    isOutOfStock
  );
  console.log("Available sizes:", sizes);

  return (
    <>
      {/* Product Details Section */}
      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl bg-white p-6 rounded-lg shadow-2xl shadow-black">
        <div className="lg:w-1/2 space-y-4">
          <div className="relative">
            {mainImage && (
              <Image
                src={mainImage}
                alt={product.name}
                width={400}
                height={400}
                className={`w-full h-auto object-cover rounded-lg shadow-md ${
                  isOutOfStock || !hasMatchingImage ? "filter blur-sm" : ""
                }`}
                priority
              />
            )}
            {(isOutOfStock || !hasMatchingImage) && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-white bg-black bg-opacity-50 px-4 py-2 rounded">
                  No Stock
                </span>
              </div>
            )}
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {images.map((img, index) => (
              <Image
                key={index}
                src={img}
                alt={`${product.name} - view ${index + 1}`}
                width={80}
                height={80}
                className="w-20 h-20 object-cover rounded cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
                onClick={() => {
                  setMainImage(img);
                  setHasMatchingImage(true);
                  const matchingColor = colors.find(color =>
                    img.toLowerCase().includes(color.toLowerCase())
                  );
                  if (matchingColor) setSelectedColor(matchingColor);
                }}
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

            <AddToCartButton
              productId={product.id}
              isDisabled={isOutOfStock || !hasMatchingImage}
              quantity={quantity}
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
