// ProductCard.tsx

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@prisma/client";
import { formatPrice, getFirstValidImageUrl } from "../../summer/utils";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => (
  <Link
    href={`/customer/shopping/products/${product.id}`}
    className="block px-2 pb-4"
  >
    <div className="bg-white rounded-lg shadow-md overflow-hidden h-full transition-transform duration-300 hover:scale-105">
      <div className="relative w-full h-48">
        <Image
          src={getFirstValidImageUrl(product.imageUrl)}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover"
          priority
        />
      </div>
      <div className="p-4">
        <h3
          className="text-lg font-semibold mb-2 truncate"
          title={product.name}
        >
          {product.name}
        </h3>
        <p className="text-gray-600">{formatPrice(product.regularPrice)}</p>
      </div>
    </div>
  </Link>
);

export default ProductCard;
