import Link from "next/link";
import { ProductCard, ProductCardSkeleton } from "./product-card";

interface Product {
  id: string;
  name: string;
  imageUrl: string;
  stock: number;
  shortDescription?: string;
}

interface ProductGridProps {
  products: Product[];
  loading: boolean;
  onProductHover: (product: Product) => void;
}

export function ProductGrid({
  products,
  loading,
  onProductHover,
}: ProductGridProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Men</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading
          ? Array(6)
              .fill(0)
              .map((_, index) => <ProductCardSkeleton key={index} />)
          : products.map(product => (
              <Link
                href={`/products/headwear/pre-curved-peaks/${product.id}`}
                key={product.id}
              >
                <ProductCard
                  product={product}
                  onHover={() => onProductHover(product)}
                />
              </Link>
            ))}
      </div>
    </div>
  );
}
