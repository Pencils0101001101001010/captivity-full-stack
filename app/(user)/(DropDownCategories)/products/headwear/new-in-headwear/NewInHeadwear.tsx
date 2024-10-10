"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchNewInHeadwear, fetchHeroImage } from "./actions";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import SearchField from "@/app/(user)/_components/SearchField";
import SideMenu from "@/app/(user)/_components/SideMenu";
import { Button } from "@/components/ui/button";
import HeroSection from "@/app/(user)/_components/CategoryHeroSection";

interface Product {
  id: number;
  name: string;
  imageUrl: string;
  inStock: Boolean;
  shortDescription?: string;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [heroImageUrl, setHeroImageUrl] = useState("/hero-image.jpg");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [productsResult, heroImageResult] = await Promise.all([
        fetchNewInHeadwear(undefined, searchQuery, currentPage, 9),
        fetchHeroImage(),
      ]);

      if (productsResult?.success) {
        setProducts(productsResult.data || []);
        setTotalPages(Math.ceil(productsResult.totalCount / 9));
      } else {
        setError(productsResult?.error || "Failed to load products");
      }

      if (heroImageResult.success) {
        setHeroImageUrl(heroImageResult.imageUrl);
      }

      setLoading(false);
    }
    loadData();
  }, [searchQuery, currentPage]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
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
            <div className="mb-6 flex justify-between ">
              <h1 className="text-3xl font-bold mb-6">
                Discover new headwear...
              </h1>{" "}
              <SearchField onSearch={handleSearch} />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
              {loading
                ? Array(9)
                    .fill(0)
                    .map((_, index) => <ProductCardSkeleton key={index} />)
                : products.map(product => (
                    <Link
                      href={`/products/headwear/${product.id}`}
                      key={product.id}
                    >
                      <ProductCard product={product} />
                    </Link>
                  ))}
            </div>
            <div className="mt-8 flex justify-center">
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="mr-2"
              >
                Previous
              </Button>
              <span className="mx-4 self-center">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="ml-2"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: Product }) {
  const imageUrls = product.imageUrl.split(",").map(url => url.trim());
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
        <div className="relative h-48 w-auto">
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
