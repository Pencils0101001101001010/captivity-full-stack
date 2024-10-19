import React from "react";
import Image from "next/image";

type Product = {
  id: number;
  productName: string;
  sellingPrice: number;
  featuredImage: {
    medium: string;
  } | null;
};

type ProductCardProps = {
  product: Product;
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden h-full">
    <div className="relative w-full pt-[100%]">
      {product.featuredImage ? (
        <Image
          src={product.featuredImage.medium}
          alt={product.productName}
          layout="fill"
          objectFit="cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">No image</span>
        </div>
      )}
    </div>
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2 truncate">
        {product.productName}
      </h2>
      <p className="text-gray-700 text-base font-bold">
        ZAR {product.sellingPrice.toFixed(2)}
      </p>
    </div>
  </div>
);

export default ProductCard;
