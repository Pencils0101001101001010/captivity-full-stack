"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { fetchProductById } from "./actions";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Product {
  id: number;
  name: string;
  shortDescription: string;
  imageUrl: string;
  stock: number | null;
}

export default function ProductDetail() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProductDetails() {
      console.log("Params:", params); // Debugging log

      // Check if params is an object and has a productid property
      if (params && typeof params === "object" && "productid" in params) {
        const id = params.productid;
        console.log("Product ID:", id); // Debugging log

        if (id && typeof id === "string") {
          try {
            setLoading(true);
            const productResult = await fetchProductById(id);
            console.log("Product Result:", productResult); // Debugging log
            if (productResult.success && productResult.data) {
              setProduct(productResult.data as Product);
            } else {
              setError(productResult.error || "Product not found");
            }
          } catch (err) {
            console.error("Error fetching product:", err); // Debugging log
            setError("Failed to load product details.");
          } finally {
            setLoading(false);
          }
        } else {
          console.error("Invalid product ID:", id); // Debugging log
          setError("Invalid product ID");
          setLoading(false);
        }
      } else {
        console.error("Product ID is missing from params"); // Debugging log
        setError("Product ID is missing");
        setLoading(false);
      }
    }

    loadProductDetails();
  }, [params]);

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

  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <div className="relative h-[400px] w-full">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              <Badge
                className="mb-4"
                variant={
                  product.stock && product.stock > 0
                    ? "secondary"
                    : "destructive"
                }
              >
                {product.stock && product.stock > 0
                  ? "In Stock"
                  : "Out of Stock"}
              </Badge>
              <p className="text-lg mb-6">{product.shortDescription}</p>
            </div>
          </div>
        </CardContent>
      </Card>
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
