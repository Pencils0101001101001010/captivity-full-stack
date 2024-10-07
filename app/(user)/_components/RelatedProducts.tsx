import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';

interface RelatedProduct {
  id: number;
  name: string;
  imageUrl: string;
  regularPrice: number | null;
}

interface RelatedProductsProps {
  products: RelatedProduct[];
}

const RelatedProductCard: React.FC<{ product: RelatedProduct }> = ({ product }) => {
  return (
    <Link href={`/products/headwear/${product.id}`}>
      <Card className="h-full">
        <CardContent className="p-4 flex flex-col h-full">
          <div className="relative h-40 mb-2 flex-grow">
            <Image
              src={product.imageUrl}
              alt={product.name}
              className="rounded-lg object-cover"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <h3 className="text-sm font-semibold mb-1 line-clamp-2">{product.name}</h3>
          {/* Uncomment if you want to display the price */}
          {/* {product.regularPrice && (
            <p className="text-sm">${product.regularPrice.toFixed(2)}</p>
          )} */}
        </CardContent>
      </Card>
    </Link>
  );
};

const RelatedProducts: React.FC<RelatedProductsProps> = ({ products }) => {
  if (products.length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Related Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {products.map((product) => (
          <RelatedProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;