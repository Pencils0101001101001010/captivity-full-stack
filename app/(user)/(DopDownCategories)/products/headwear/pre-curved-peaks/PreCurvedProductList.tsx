"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchPreCurvedPeaks } from "./actions";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface Product {
  id: number;
  name: string;
  imageUrl: string;
  stock: number | null;
  shortDescription?: string;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      const result = await fetchPreCurvedPeaks();
      if (result?.success) {
        setProducts(result.data || []);
      } else {
        setError(result?.error || "Failed to load products");
      }
      setLoading(false);
    }
    loadProducts();
  }, []);

  if (error) {
    return (
      <div className="container mx-auto my-8 text-center">
        <p className="text-red-500">Error loading products: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto my-8">
      <h1 className="text-3xl font-bold mb-6">Pre-Curved Peaks</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {loading
          ? Array(6)
              .fill(0)
              .map((_, index) => <ProductCardSkeleton key={index} />)
          : products.map((product) => (
              <Link
                href={`/products/headwear/pre-curved-peaks/${product.id}`}
                key={product.id}
              >
                <ProductCard product={product} />
              </Link>
            ))}
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const imageUrls = product.imageUrl.split(",").map((url) => url.trim());
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleMouseEnter = () => {
    if (imageUrls.length > 1) {
      setCurrentImageIndex(1);
    }
  };

  const handleMouseLeave = () => {
    setCurrentImageIndex(0);
  };

  return (
    <Card
      className="overflow-hidden hover:shadow-lg transition-shadow"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative h-48">
        <Image
          src={imageUrls[currentImageIndex]}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          style={{ objectFit: "cover" }}
          priority
        />
      </div>
      <CardContent className="p-4">
        <h2 className="font-semibold text-lg mb-2">{product.name}</h2>
        <Badge
          variant={
            product.stock && product.stock > 0 ? "secondary" : "destructive"
          }
        >
          {product.stock && product.stock > 0 ? "In Stock" : "Out of Stock"}
        </Badge>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <p className="text-sm text-muted-foreground">Click to view details</p>
      </CardFooter>
    </Card>
  );
}

function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-48 w-full" />
      <CardContent className="p-4">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/4" />
      </CardContent>
    </Card>
  );
}
