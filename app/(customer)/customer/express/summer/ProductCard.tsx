// components/ProductCard.tsx
import React from "react";
import Image from "next/image";
import { Product } from "./types";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="border rounded-lg p-4 shadow-md">
      <Image
        src={product.featuredImage?.medium || "/placeholder.jpg"}
        alt={product.productName}
        width={200}
        height={200}
        className="w-full h-48 object-cover mb-4 rounded"
      />
      <h3 className="text-lg font-semibold mb-2">{product.productName}</h3>
      <p className="text-xl font-bold">R{product.sellingPrice.toFixed(2)}</p>
    </div>
  );
};

export default ProductCard;
