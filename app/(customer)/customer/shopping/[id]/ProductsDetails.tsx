"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

type Variation = {
  id: number;
  name: string;
  color: string;
  size: string;
  sku: string;
  sku2: string;
  variationImageURL: string;
  quantity: number;
  productId: number; // Added this line
};

type ProductsDetailsProps = {
  product: Product;
};

const ProductsDetails: React.FC<ProductsDetailsProps> = ({ product }) => {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [availableStock, setAvailableStock] = useState<number>(0);
  const [activeVariation, setActiveVariation] = useState<Variation | null>(
    null
  );

  useEffect(() => {
    if (product.featuredImage) {
      setCurrentImage(product.featuredImage.medium);
    }
    if (product.variations.length > 0) {
      setActiveVariation(product.variations[0]);
    }
  }, [product]);

  useEffect(() => {
    const matchingVariation = product.variations.find(
      v => v.color === selectedColor && v.size === selectedSize
    );
    setAvailableStock(matchingVariation ? matchingVariation.quantity : 0);
  }, [selectedColor, selectedSize, product.variations]);

  const availableColors = [...new Set(product.variations.map(v => v.color))];
  const availableSizes = [...new Set(product.variations.map(v => v.size))];

  const uniqueVariations = availableColors
    .map(color => product.variations.find(v => v.color === color))
    .filter((v): v is Variation => v !== undefined);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    const variation = product.variations.find(v => v.color === color);
    if (variation) {
      setCurrentImage(variation.variationImageURL);
      setActiveVariation(variation);
    }
  };

  const handleThumbnailClick = (variation: Variation) => {
    setCurrentImage(variation.variationImageURL);
    setSelectedColor(variation.color);
    setActiveVariation(variation);
  };

  const handleAddToCart = () => {
    console.log("Added to cart:", {
      product,
      selectedColor,
      selectedSize,
      quantity,
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Product Details</h1>
      <h2 className="text-xl mb-4">{product.productName}</h2>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          {currentImage && (
            <Image
              src={currentImage}
              alt={product.productName}
              width={400}
              height={400}
              className="mb-4 rounded-lg object-cover"
            />
          )}
          <div className="grid grid-cols-5 gap-2 mb-4">
            {uniqueVariations.map(variation => (
              <button
                key={variation.id}
                className={`w-full aspect-square ${
                  activeVariation?.id === variation.id
                    ? "ring-2 ring-blue-500 ring-offset-2"
                    : "hover:ring-2 hover:ring-gray-300 hover:ring-offset-2"
                }`}
                onClick={() => handleThumbnailClick(variation)}
              >
                <Image
                  src={variation.variationImageURL}
                  alt={variation.name}
                  width={80}
                  height={80}
                  className="rounded-md object-cover w-full h-full"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1">
          <div
            className="mb-4"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />

          <p className="text-2xl font-bold mb-4">
            R{product.sellingPrice.toFixed(2)}
          </p>

          <div className="mb-4">
            <label className="block font-bold mb-2">Color</label>
            <div className="flex flex-wrap gap-2">
              {availableColors.map(color => (
                <button
                  key={color}
                  className={`px-3 py-1 border rounded-md ${selectedColor === color ? "bg-blue-500 text-white" : ""}`}
                  onClick={() => handleColorChange(color)}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="size" className="block font-bold mb-2">
              Size
            </label>
            <select
              id="size"
              className="w-full p-2 border rounded-md"
              value={selectedSize || ""}
              onChange={e => setSelectedSize(e.target.value)}
            >
              <option value="">Select a size</option>
              {availableSizes.map(size => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="quantity" className="block font-bold mb-2">
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              className="w-full p-2 border rounded-md"
              value={quantity}
              onChange={e =>
                setQuantity(
                  Math.min(Math.max(1, Number(e.target.value)), availableStock)
                )
              }
              min="1"
              max={availableStock}
            />
          </div>

          <p className="mb-4">{availableStock} in stock</p>

          <button
            className="w-full bg-blue-600 text-white py-2 rounded-md mb-2 hover:bg-blue-700 transition-colors"
            onClick={handleAddToCart}
            disabled={!selectedColor || !selectedSize || availableStock === 0}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductsDetails;
