"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp } from "lucide-react";
import { fetchMensApparel } from "./actions";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface Product {
  id: string;
  name: string;
  imageUrl: string;
  stock: number;
  shortDescription?: string;
}

export default function MensApparelProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      const result = await fetchMensApparel();
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
      {/* Hero Image Section */}
      {selectedProduct && (
        <div className="w-full h-[300px] relative mb-8">
          <Image
            src={selectedProduct.imageUrl.split(",")[1].trim()}
            alt={selectedProduct.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
            <div className="container mx-auto">
              <h1 className="text-3xl font-bold text-white">
                {selectedProduct.name}
              </h1>
            </div>
          </div>
        </div>
      )}

      {/* Main Content with Sidebars */}
      <div className="container mx-auto px-4">
        <div className="flex gap-8">
          {/* Left Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <nav className="space-y-6">
              {/* Collections Dropdown */}
              <div className="border-b pb-4">
                <button
                  onClick={() => setIsCollectionsOpen(!isCollectionsOpen)}
                  className="flex items-center justify-between w-full text-left font-semibold text-lg mb-2 hover:text-gray-700"
                >
                  COLLECTIONS
                  {isCollectionsOpen ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </button>
                <div
                  className={`transition-all duration-200 ease-in-out ${
                    isCollectionsOpen ? "max-h-96" : "max-h-0 overflow-hidden"
                  }`}
                >
                  <ul className="space-y-2 pt-2">
                    <li>
                      <Link
                        href="/collections/signature"
                        className="text-gray-600 hover:text-gray-900 block"
                      >
                        Signature
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/collections/camo"
                        className="text-gray-600 hover:text-gray-900 block"
                      >
                        Camo
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/collections/winter"
                        className="text-gray-600 hover:text-gray-900 block"
                      >
                        Winter
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/collections/baseball"
                        className="text-gray-600 hover:text-gray-900 block"
                      >
                        Baseball
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/collections/fashion"
                        className="text-gray-600 hover:text-gray-900 block"
                      >
                        Fashion
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/collections/sport"
                        className="text-gray-600 hover:text-gray-900 block"
                      >
                        Sport
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/collections/industrial"
                        className="text-gray-600 hover:text-gray-900 block"
                      >
                        Industrial
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/collections/leisure"
                        className="text-gray-600 hover:text-gray-900 block"
                      >
                        Leisure
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/collections/kids"
                        className="text-gray-600 hover:text-gray-900 block"
                      >
                        Kids
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/collections/african"
                        className="text-gray-600 hover:text-gray-900 block"
                      >
                        African
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              {/* APPAREL Section */}
              <div>
                <h3 className="font-semibold text-lg mb-3">APPAREL</h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/apparel/new"
                      className="text-gray-600 hover:text-gray-900"
                    >
                      New in Apparel
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/apparel/men"
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Men
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/apparel/women"
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Women
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/apparel/kids"
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Kids
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/apparel/t-shirts"
                      className="text-gray-600 hover:text-gray-900"
                    >
                      T-Shirts
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/apparel/golfers"
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Golfers
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/apparel/hoodies"
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Hoodies
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/apparel/jackets"
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Jackets
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/apparel/bottoms"
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Bottoms
                    </Link>
                  </li>
                </ul>
              </div>

              {/* HEADWEAR Section */}
              <div>
                <h3 className="font-semibold text-lg mb-3">HEADWEAR</h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/headwear/new"
                      className="text-gray-600 hover:text-gray-900"
                    >
                      New in Headwear
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/headwear/flat-peaks"
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Flat Peaks
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/headwear/pre-curved-peaks"
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Pre-Curved Peaks
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/headwear/hats"
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Hats
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/headwear/multifunctional"
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Multifunctional Headwear
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/headwear/beanies"
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Beanies
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/headwear/trucker-caps"
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Trucker Caps
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/headwear/bucket-hats"
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Bucket Hats
                    </Link>
                  </li>
                </ul>
              </div>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
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
                        onHover={() => setSelectedProduct(product)}
                      />
                    </Link>
                  ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function ProductCard({
  product,
  onHover,
}: {
  product: Product;
  onHover: () => void;
}) {
  const imageUrls = product.imageUrl.split(",").map(url => url.trim());
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleMouseEnter = () => {
    onHover();
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
        <h4 className="font-semibold text-sm mb-2">{product.name}</h4>
        <Badge variant={product.stock > 0 ? "secondary" : "destructive"}>
          {product.stock > 0 ? "In Stock" : "Out of Stock"}
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
