"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { fetchProductById } from "./actions";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDescription } from "@/lib/utils";
import RelatedProducts from "@/app/(user)/_components/RelatedProducts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";

interface Thumbnail {
  id: number;
  name: string;
  imageUrl: string;
  stock: number | null;
  regularPrice: number | null;
  attribute1Default?: string;
  attribute2Default?: string;
}

interface Product {
  id: number;
  name: string;
  shortDescription: string;
  mainImage: string;
  thumbnails: Thumbnail[];
  stock: number | null;
  inStock: boolean;
  regularPrice: number | null;
  attribute1Name: string | null;
  attribute1Values: string | null;
  attribute2Name: string | null;
  attribute2Values: string | null;
  attribute1Default: string | null;
  attribute2Default: string | null;
  sku: string;
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
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [selectedThumbnail, setSelectedThumbnail] = useState<number | null>(
    null
  );
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function loadProductDetails() {
      if (params && typeof params === "object" && "productid" in params) {
        const id = params.productid;

        if (id && typeof id === "string") {
          try {
            setLoading(true);
            const result = await fetchProductById(id);
            if (result.success && result.data) {
              setProduct(result.data as Product);
              setCurrentImage(result.data.mainImage);
              setSelectedThumbnail(result.data.id);
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

  const handleThumbnailClick = (image: string, id: number) => {
    setCurrentImage(image);
    setSelectedThumbnail(id);
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

  if (!product) {
    return (
      <div className="container mx-auto p-8 text-center">
        <p>Product not found.</p>
      </div>
    );
  }

  const selectedProduct =
    selectedThumbnail === product.id
      ? product
      : product.thumbnails.find(t => t.id === selectedThumbnail) || product;

  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <div className="relative h-[400px] w-full mb-4">
                <Image
                  src={currentImage || product.mainImage}
                  alt={selectedProduct.name}
                  className="rounded-lg object-cover"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                />
              </div>
              <div className="max-w-[700px] overflow-x-auto">
                <div className="flex gap-2 pb-2 min-w-0 items-center">
                  {[
                    { id: product.id, imageUrl: product.mainImage },
                    ...product.thumbnails,
                  ].map(item => (
                    <div
                      key={item.id}
                      className={`relative h-20 w-20 cursor-pointer transition-all duration-200 flex-shrink-0`}
                      onClick={() =>
                        handleThumbnailClick(item.imageUrl, item.id)
                      }
                    >
                      <Image
                        src={item.imageUrl}
                        alt={`Product view ${item.id}`}
                        className="rounded object-cover"
                        fill
                        // title={item.name || `Product view ${item.id}`}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-4">
                {selectedProduct.name}
              </h1>
              {/* {selectedProduct.regularPrice && (
                <p className="text-xl font-semibold mb-4">
                  Price: R{selectedProduct.regularPrice.toFixed(2)}
                </p>
              )} */}
              <div className="mb-4">
                <Badge
                  variant={
                    selectedProduct.stock && selectedProduct.stock > 0
                      ? "default"
                      : "secondary"
                  }
                >
                  {selectedProduct.stock && selectedProduct.stock > 0
                    ? "In Stock"
                    : "Out of Stock"}
                </Badge>
                {selectedProduct.stock !== null && (
                  <span className="ml-2 text-sm text-gray-600">
                    {selectedProduct.stock} available
                  </span>
                )}
              </div>
              <div className="mb-4">
                {product.attribute1Name &&
                  selectedProduct.attribute1Default && (
                    <div>
                      <span className="font-semibold">
                        {product.attribute1Name}:{" "}
                      </span>
                      <span>{selectedProduct.attribute1Default}</span>
                    </div>
                  )}
                {product.attribute2Name &&
                  selectedProduct.attribute2Default && (
                    <div>
                      <span className="font-semibold">
                        {product.attribute2Name}:{" "}
                      </span>
                      <span>{selectedProduct.attribute2Default}</span>
                    </div>
                  )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="quantity"
                  className="block text-sm font-medium text-gray-700"
                >
                  Quantity
                </label>
                <Input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={e =>
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  min="1"
                  className="mt-1"
                />
              </div>

              <Button asChild className="w-full mb-4">
                <Link href="/login">Login</Link>
              </Button>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="description">
                  <AccordionTrigger>Features</AccordionTrigger>
                  <AccordionContent>
                    <div
                      dangerouslySetInnerHTML={formatDescription(
                        product.shortDescription
                      )}
                      className="description-content"
                    />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="specs">
                  <AccordionTrigger>Box Specification</AccordionTrigger>
                  <AccordionContent>
                    <p>Box specifications information goes here.</p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Use the new RelatedProducts component */}
      <RelatedProducts products={relatedProducts} />
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
