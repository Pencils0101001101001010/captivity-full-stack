import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
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

const RelatedProducts: React.FC<RelatedProductsProps> = ({ products }) => {
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Related Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link href={`/product/${product.id}`} key={product.id}>
            <Card className="h-full transition-shadow hover:shadow-lg">
              <CardContent className="p-4">
                <div className="relative h-48 mb-4">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    className="rounded-lg object-cover"
                    fill
                  />
                </div>
                <h3 className="text-lg font-semibold mb-2 line-clamp-2">{product.name}</h3>
                {product.regularPrice && (
                  <p className="text-sm font-medium">${product.regularPrice.toFixed(2)}</p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;