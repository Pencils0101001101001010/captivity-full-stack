// components/ProductCard.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "../types";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Link href={`/customer/express/${product.id}`} passHref>
      <div className="bg-white rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
        <div className="relative h-48 w-full">
          <Image
            src={product.featuredImage?.medium || "/placeholder.jpg"}
            alt={product.productName}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2 truncate">
            {product.productName}
          </h3>
          <p className="text-xl font-bold text-blue-600">
            R{product.sellingPrice.toFixed(2)}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
