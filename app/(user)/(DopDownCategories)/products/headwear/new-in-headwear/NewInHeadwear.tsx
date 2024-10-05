"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchNewInHeadwear, fetchHeroImage } from "./actions";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import SearchField from "@/app/(user)/_compnents/SearchField";

interface Product {
  id: number;
  name: string;
  imageUrl: string;
  inStock: Boolean;
  shortDescription?: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

function HeroSection({ imageUrl }: { imageUrl: string }) {
  return (
    <div className="relative w-full h-[350px] mb-8">
      <Image
        src={imageUrl}
        alt="Headwear Hero"
        fill
        style={{ objectFit: "cover" }}
        priority
      />
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <h1 className="text-4xl font-bold text-white">
          Discover Our Headwear Collection
        </h1>
      </div>
    </div>
  );
}

function SideMenu() {
  return (
    <aside className="w-64 pr-8">
      <h2 className="text-xl font-semibold mb-4">Categories</h2>
      <div>
        <Link href="/products/headwear/flat-peaks">Headwear</Link>
      </div>
    </aside>
  );
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [heroImageUrl, setHeroImageUrl] = useState("/hero-image.jpg");

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [productsResult, heroImageResult] = await Promise.all([
        fetchNewInHeadwear(undefined, searchQuery),
        fetchHeroImage(),
      ]);

      if (productsResult?.success) {
        setProducts(productsResult.data || []);
      } else {
        setError(productsResult?.error || "Failed to load products");
      }

      if (heroImageResult.success) {
        setHeroImageUrl(heroImageResult.imageUrl);
      }

      setLoading(false);
    }
    loadData();
  }, [searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  if (error) {
    return (
      <div className="container mx-auto my-8 text-center">
        <p className="text-red-500">Error loading products: {error}</p>
      </div>
    );
  }

  return (
    <section>
      <HeroSection imageUrl={heroImageUrl} />
      <div className="container mx-auto my-8">
        <div className="flex">
          <SideMenu />
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-6">New in Headwear</h1>
            <div className="mb-6">
              <SearchField onSearch={handleSearch} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {loading
                ? Array(6)
                    .fill(0)
                    .map((_, index) => <ProductCardSkeleton key={index} />)
                : products.map((product) => (
                    <Link
                      href={`/products/headwear/${product.id}`}
                      key={product.id}
                    >
                      <ProductCard product={product} />
                    </Link>
                  ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: Product }) {
  const imageUrls = product.imageUrl.split(",").map((url) => url.trim());
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div>
      <Card
        className="overflow-hidden hover:shadow-lg transition-shadow"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative h-48">
          <Image
            src={imageUrls[0]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: "cover" }}
            priority
          />
          {imageUrls.length > 1 && (
            <Image
              src={imageUrls[1]}
              alt={`${product.name} - Image 2`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{
                objectFit: "cover",
                opacity: isHovered ? 1 : 0,
                transition: "opacity 500ms ease-in-out",
              }}
              priority
            />
          )}
        </div>
        <CardContent className="p-4">
          <h4 className="font-semibold text-sm mb-2">{product.name}</h4>
          <Badge
            variant={
              product.inStock && product.inStock === true
                ? "secondary"
                : "destructive"
            }
          >
            {product.inStock && product.inStock === true
              ? "In Stock"
              : "Out of Stock"}
          </Badge>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <p className="text-sm text-muted-foreground">Click to view details</p>
        </CardFooter>
      </Card>
    </div>
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