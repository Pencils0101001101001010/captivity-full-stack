"use client";
import { useEffect, useState } from "react";
import { fetchWomensApparel } from "./actions";
import { SidebarNavigation } from "./sidebar-navigation";
import { ProductGrid } from "./product-grid";
import { HeroSection } from "./hero-section";

interface Product {
  id: string;
  name: string;
  imageUrl: string;
  stock: number;
  shortDescription?: string;
}

export default function WomensApparelProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      const result = await fetchWomensApparel();
      if (result?.success) {
        setProducts(result.data || []);
        if (result.data && result.data.length > 0) {
          setSelectedProduct(result.data[0]);
        }
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
    <div className="w-full">
      {selectedProduct && <HeroSection product={selectedProduct} />}

      <div className="container mx-auto px-4">
        <div className="flex gap-8">
          <SidebarNavigation />
          <ProductGrid
            products={products}
            loading={loading}
            onProductHover={setSelectedProduct}
          />
        </div>
      </div>
    </div>
  );
}
