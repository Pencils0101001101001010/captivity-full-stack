"use client";
import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { Product } from "@prisma/client";
import { ChevronDown } from "lucide-react";
import { formatDescription } from "@/lib/utils";
import Image from "next/image";
import ColorSelector from "./ColorSelector";
import QuantitySelector from "./QuantitySelector";
import AddToCartButton from "./AddToCart";

interface ProductDetailsProps {
  product: Product;
  variants?: Product[];
}

const ProductDetails: React.FC<ProductDetailsProps> = ({
  product,
  variants = [],
}) => {
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [mainImage, setMainImage] = useState<string>("");
  const [availableQuantity, setAvailableQuantity] = useState<number>(0);

  const allProducts = useMemo(
    () => [product, ...variants],
    [product, variants]
  );

  const colors = useMemo(() => {
    return [
      ...new Set(
        allProducts
          .map(p => {
            const parts = p.name.split("-");
            return parts.length > 1 ? parts[1].trim() : "";
          })
          .filter(Boolean)
      ),
    ];
  }, [allProducts]);

  const sizes = useMemo(() => {
    return [
      ...new Set(
        allProducts
          .map(p => {
            const parts = p.name.split("-");
            return parts.length > 2 ? parts[2].trim() : "";
          })
          .filter(Boolean)
      ),
    ];
  }, [allProducts]);

  const images = useMemo(() => {
    return [...new Set(allProducts.flatMap(p => p.imageUrl.split(", ")))];
  }, [allProducts]);

  const renderCount = useRef(0);
  const isInitialized = useRef(false);

  const findImageForColor = useCallback(
    (color: string): string => {
      const normalizedColor = color.toLowerCase().replace(/\s+/g, "");
      console.log(`Searching for image with color: ${normalizedColor}`);

      const matchingImage = images.find(img => {
        const imgName = img.toLowerCase();
        return (
          imgName.includes(normalizedColor) ||
          (normalizedColor === "armybrown" && imgName.includes("brown")) ||
          (normalizedColor === "armygreen" && imgName.includes("green")) ||
          (normalizedColor === "camogreen" && imgName.includes("camo"))
        );
      });

      console.log(`Image found for ${color}: ${matchingImage || "Not found"}`);
      return matchingImage || images[0];
    },
    [images]
  );

  useEffect(() => {
    if (!isInitialized.current && colors.length > 0 && images.length > 0) {
      const initialColor = colors[0];
      console.log("Setting initial color:", initialColor);
      setSelectedColor(initialColor);

      const initialImage = findImageForColor(initialColor);
      console.log("Setting initial image:", initialImage);
      setMainImage(initialImage);

      if (sizes.length > 0) {
        const initialSize = sizes[0];
        console.log("Setting initial size:", initialSize);
        setSelectedSize(initialSize);
      }

      const initialVariant = allProducts.find(
        p =>
          p.name.includes(initialColor) &&
          (sizes.length === 0 || p.name.includes(sizes[0]))
      );
      setAvailableQuantity(initialVariant?.stock || product.stock || 0);
      isInitialized.current = true;
    }
  }, [product, colors, sizes, images, findImageForColor, allProducts]);

  const handleColorChange = useCallback(
    (color: string) => {
      console.log("Color changed to:", color);
      setSelectedColor(color);

      const matchingImage = findImageForColor(color);
      console.log("Setting main image to:", matchingImage);
      setMainImage(matchingImage);

      const matchingVariant = allProducts.find(
        v =>
          v.name.toLowerCase().includes(color.toLowerCase()) &&
          (selectedSize === "" ||
            v.name.toLowerCase().includes(selectedSize.toLowerCase()))
      );
      setAvailableQuantity(matchingVariant?.stock || 0);
    },
    [findImageForColor, selectedSize, allProducts]
  );

  const handleSizeChange = useCallback(
    (size: string) => {
      console.log("Size changed to:", size);
      setSelectedSize(size);

      const matchingVariant = allProducts.find(
        v =>
          v.name.toLowerCase().includes(selectedColor.toLowerCase()) &&
          v.name.toLowerCase().includes(size.toLowerCase())
      );
      setAvailableQuantity(matchingVariant?.stock || 0);
    },
    [selectedColor, allProducts]
  );

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
    "Available Quantity:",
    availableQuantity
  );

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl bg-white p-6 rounded-lg shadow-2xl shadow-black">
        <div className="lg:w-1/2 space-y-4">
          <div className="relative">
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
              isDisabled={availableQuantity === 0}
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
