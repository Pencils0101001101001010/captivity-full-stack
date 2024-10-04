"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { fetchProductById } from "./actions";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import RelatedProducts from "@/app/(user)/_compnents/RelatedProducts";

interface Product {
  id: number;
  name: string;
  shortDescription: string;
  mainImage: string;
  thumbnails: string[];
  stock: number | null;
  inStock: boolean;
  regularPrice: number | null;
  attribute1Name?: string;
  attribute1Values?: string;
  attribute2Name?: string;
  attribute2Values?: string;
}

interface RelatedProduct {
  id: number;
  name: string;
  imageUrl: string;
  regularPrice: number | null;
}

export default function ProductDetail() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentVariant, setCurrentVariant] = useState<Product | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  useEffect(() => {
    async function loadProductDetails() {
      if (params && typeof params === "object" && "productid" in params) {
        const id = params.productid;

        if (id && typeof id === "string") {
          try {
            setLoading(true);
            const result = await fetchProductById(id);
            if (result.success && result.data) {
              const mainProduct = result.data as Product;
              setProduct(mainProduct);
              setCurrentVariant(mainProduct);
              setCurrentImage(mainProduct.mainImage);
              setRelatedProducts(result.relatedProducts || []);
            } else {
              setError(result.error || "Product not found");
            }
          } catch (err) {
            console.error("Error fetching product:", err);
            setError("Failed to load product details.");
          } finally {
            setLoading(false);
          }
        } else {
          setError("Invalid product ID");
          setLoading(false);
        }
      }
    }

    loadProductDetails();
  }, [params]);

  const handleThumbnailClick = async (image: string) => {
    setLoading(true);
    try {
      const variantIdMatch = image.match(/\/product[-_](\d+)/);
      if (variantIdMatch && variantIdMatch[1]) {
        const variantId = variantIdMatch[1];
        const result = await fetchProductById(variantId);

        if (result.success && result.data) {
          setCurrentVariant(result.data as Product);
        }
      } else {
        setCurrentVariant(product);
      }
      setCurrentImage(image);
    } catch (err) {
      console.error("Error fetching variant details:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (error) {
    return (
      <div className="container mx-auto p-8 text-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!product || !currentVariant) {
    return (
      <div className="container mx-auto p-8 text-center">
        <p>Product not found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <div className="relative h-[400px] w-full mb-4">
                <Image
                  src={currentImage || currentVariant.mainImage}
                  alt={currentVariant.name}
                  className="rounded-lg object-cover fill"
                  width={500}
                  height={500}
                />
              </div>
              <div className="max-w-[500px] overflow-x-auto">
                <div className="flex gap-2 pb-2 min-w-0 items-center justify-center">
                  {[currentVariant.mainImage, ...currentVariant.thumbnails].map(
                    (image, index) => (
                      <div
                        key={index}
                        className={`relative h-20 w-20 cursor-pointer transition-all duration-200 flex-shrink-0`}
                        onClick={() => handleThumbnailClick(image)}
                      >
                        <Image
                          src={image}
                          alt={`Product view ${index + 1}`}
                          className="rounded object-cover fill"
                          width={60}
                          height={60}
                        />
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-4">{currentVariant.name}</h1>
              {currentVariant.regularPrice && (
                <p className="text-xl font-semibold mb-4">
                  ${currentVariant.regularPrice.toFixed(2)}
                </p>
              )}
              <div className="mb-4">
                <Badge
                  variant={currentVariant.inStock ? "default" : "secondary"}
                >
                  {currentVariant.inStock ? "In Stock" : "Out of Stock"}
                </Badge>
                {currentVariant.stock !== null && (
                  <span className="ml-2 text-sm text-gray-600">
                    {currentVariant.stock} available
                  </span>
                )}
              </div>
              <div className="mb-4">
                {currentVariant.attribute1Name && (
                  <div className="mb-2">
                    <span className="font-semibold">
                      {currentVariant.attribute1Name}:{" "}
                    </span>
                    <span>{currentVariant.attribute1Values}</span>
                  </div>
                )}
                {currentVariant.attribute2Name && (
                  <div>
                    <span className="font-semibold">
                      {currentVariant.attribute2Name}:{" "}
                    </span>
                    <span>{currentVariant.attribute2Values}</span>
                  </div>
                )}
              </div>
              <p className="text-lg mb-6">{currentVariant.shortDescription}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {relatedProducts.length > 0 && (
        <RelatedProducts products={relatedProducts} />
      )}
    </div>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-8">
            <Skeleton className="flex-1 h-[400px]" />
            <div className="flex-1">
              <Skeleton className="h-10 w-3/4 mb-4" />
              <Skeleton className="h-6 w-1/4 mb-4" />
              <Skeleton className="h-24 w-full mb-6" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
