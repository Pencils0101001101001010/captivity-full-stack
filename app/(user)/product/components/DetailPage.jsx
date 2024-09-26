"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import ProductModal from "./ProductModal";
import Link from "next/link";

const ProductPage = ({ product }) => {
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [mainImage, setMainImage] = useState(null);

  useEffect(() => {
    if (product.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
      setMainImage(product.variants[0].image);
    }
  }, [product]);

  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);
    setMainImage(variant.image);
  };

  const handleImageClick = (image) => {
    setMainImage(image);
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-center">
        <div className="w-full md:w-1/3 mb-6 md:mb-0">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-red-500">
              {product.name}
            </h1>
            <div className="flex items-center space-x-2 text-sm text-gray-600 flex-wrap">
              <span>Home</span> / <span>headwear</span> /{" "}
              <span>{product.name}</span>
            </div>
          </div>
          {mainImage && (
            <div className="mb-4">
              <Image
                src={mainImage}
                alt={`${product.name} - Main Image`}
                width={700}
                height={700}
                className="w-full h-auto"
              />
            </div>
          )}
          <div className="flex flex-wrap gap-2 justify-center">
            {product.variants &&
              product.variants.map((variant) => (
                <button
                  key={variant.name}
                  onClick={() => handleVariantChange(variant)}
                  className=""
                  aria-label={`Select ${variant.name}`}
                >
                  {variant.type === "image" ? (
                    <Image
                      src={variant.image}
                      alt={variant.name}
                      width={100}
                      height={100}
                      className="w-12 h-12 md:w-16 md:h-16 object-cover opacity-50 hover:opacity-100"
                      onClick={() => handleImageClick(variant.image)}
                    />
                  ) : null}
                </button>
              ))}
          </div>
        </div>
        <div className="w-full md:w-1/3 mt-5 sm:mt-20 text-sm md:text-base text-gray-700 md:pl-6">
          {selectedVariant && (
            <>
              <Link
                href="/login"
                className="font-bold text-red-500 hover:text-gray-700"
              >
                Login or Register
              </Link>{" "}
              to view product prices
              <p className="mt-2">
                <strong>
                  {selectedVariant.type === "Style" ? "Color" : "Color"}:
                </strong>{" "}
                {selectedVariant.name}
              </p>
              {product.variants &&
                product.variants.map((variant) => (
                  <button
                    key={variant.name}
                    onClick={() => handleVariantChange(variant)}
                    className=""
                    aria-label={`Select ${variant.name}`}
                  >
                    {variant.type === "color" ? (
                      <div
                        className="w-8 h-8 m-0.5"
                        title={variant.name}
                        style={{ backgroundColor: variant.hex }}
                      ></div>
                    ) : null}
                  </button>
                ))}
              <div className="flex flex-wrap gap-2 my-4">
                {product.thumbnails &&
                  product.thumbnails.map((thumbnail) => (
                    <button
                      key={thumbnail.name}
                      onClick={() => handleVariantChange(thumbnail)}
                      className="w-12 h-12 md:w-16 md:h-16"
                      aria-label={`Select ${thumbnail.name}`}
                    >
                      <Image
                        src={thumbnail.image}
                        alt={thumbnail.name}
                        width={100}
                        height={100}
                        className="w-full h-full object-cover opacity-50 hover:opacity-100"
                        onClick={() => handleImageClick(thumbnail.image)}
                      />
                    </button>
                  ))}
              </div>
              <p>in stock {selectedVariant.stock}</p>
            </>
          )}
          <div className="flex flex-col space-y-4 mt-6">
            <Link
              href="/login"
              className="w-full md:w-auto px-4 py-2 text-center bg-red-500 hover:bg-red-700 text-white rounded"
            >
              Login
            </Link>
            <button
              className="w-full md:w-auto px-4 py-2 text-center border-red-500 border-2 text-red-500 rounded hover:bg-gray-200 transition-colors"
              onClick={() => setShowModal(true)}
            >
              View Stock
            </button>
          </div>
        </div>
      </div>
      {showModal && (
        <ProductModal product={product} setShowModal={setShowModal} />
      )}
    </div>
  );
};

export default ProductPage;
