import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Product } from "@prisma/client";
import { formatDescription } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {product.imageUrl && (
            <div className="aspect-video relative">
              <Image
                src={product.imageUrl}
                alt={product.name}
                width={300}
                height={300}
                priority
                className="w-full rounded-lg h-[500px]"
              />
            </div>
          )}
          <div className="md:grid md:grid-cols-2 md:gap-4 space-y-2 md:space-y-0">
            <div className="space-y-2">
              <p>
                <strong>SKU:</strong> {product.sku}
              </p>
              <p>
                <strong>Type:</strong> {product.type}
              </p>
              <p>
                <strong>Published:</strong> {product.published ? "Yes" : "No"}
              </p>
              <p>
                <strong>Featured:</strong> {product.isFeatured ? "Yes" : "No"}
              </p>
              <p>
                <strong>Visibility:</strong> {product.visibility}
              </p>
              <div>
                <strong>Short Description:</strong>
                <div
                  dangerouslySetInnerHTML={formatDescription(
                    product.shortDescription
                  )}
                  className="mt-2 pl-4 description-content"
                />
              </div>
              <p>
                <strong>Tax Status:</strong> {product.taxStatus}
              </p>
              <p>
                <strong>In Stock:</strong> {product.inStock ? "Yes" : "No"}
              </p>
            </div>
            <div className="space-y-2">
              <p>
                <strong>Backorders Allowed:</strong>{" "}
                {product.backordersAllowed ? "Yes" : "No"}
              </p>
              <p>
                <strong>Sold Individually:</strong>{" "}
                {product.soldIndividually ? "Yes" : "No"}
              </p>
              <p>
                <strong>Allow Reviews:</strong>{" "}
                {product.allowReviews ? "Yes" : "No"}
              </p>
              <p>
                <strong>Categories:</strong> {product.categories}
              </p>
              <p>
                <strong>Tags:</strong> {product.tags}
              </p>
              <p>
                <strong>Position:</strong> {product.position}
              </p>
              {product.attribute1Name && (
                <p>
                  <strong>{product.attribute1Name}:</strong>{" "}
                  {product.attribute1Values}
                </p>
              )}
              {product.attribute2Name && (
                <p>
                  <strong>{product.attribute2Name}:</strong>{" "}
                  {product.attribute2Values}
                </p>
              )}
              {product.regularPrice !== null && (
                <p>
                  <strong>Regular Price:</strong> $
                  {product.regularPrice.toFixed(2)}
                </p>
              )}
              {product.stock !== null && (
                <p>
                  <strong>Stock:</strong> {product.stock}
                </p>
              )}
              <p>
                <strong>Created At:</strong>{" "}
                {product.createdAt.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link href={`/admin/products/headwear/${product.id}/edit`} passHref>
          <Button variant="default">Update</Button>
        </Link>
        <Link href={`/admin/products/headwear/${product.id}/delete`} passHref>
          <Button variant="destructive">Delete</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
