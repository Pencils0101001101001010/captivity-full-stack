import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

interface GroupedProduct {
  id: number;
  name: string;
  imageUrls: string[];
  regularPrice: number | null;
}

const ProductCard = ({ product }: { product: GroupedProduct }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  // Switch to the second image on hover (if it exists)
  const handleMouseEnter = () => {
    if (product.imageUrls.length > 1 && !imageError) {
      setCurrentImageIndex(1); // Switch to second image if available and no error
    }
  };

  // Revert back to the first image on mouse leave
  const handleMouseLeave = () => {
    setCurrentImageIndex(0); // Always return to first image on mouse leave
  };

  // If the first image errors, try the second one
  const handleImageError = () => {
    if (currentImageIndex === 0 && product.imageUrls.length > 1) {
      setCurrentImageIndex(1); // Try second image if the first one errors
    } else {
      setImageError(true); // If all images fail, set error to true
    }
  };

  return (
    <Link href={`/customer/quick-order/${product.id}`}>
      <Card
        className="h-full w-[300px] overflow-hidden hover:shadow-lg transition-shadow duration-300"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <CardHeader className="bg-primary text-primary-foreground">
          <h2 className="text-lg font-bold truncate">{product.name}</h2>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative w-full h-64">
            {product.imageUrls.length > 0 && !imageError ? (
              <Image
                src={product.imageUrls[currentImageIndex]} // Display current image
                alt={product.name}
                width={300}
                height={250}
                layout="responsive"
                objectFit="cover"
                className="transition-opacity duration-300 w-full h-full"
                onError={handleImageError}
              />
            ) : (
              // Fallback if no image is available or if all images fail to load
              <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                No Image Available
              </div>
            )}
          </div>
          <div className="p-4">
            <p className="font-bold text-2xl text-primary">
              {product.regularPrice
                ? `$${product.regularPrice.toFixed(2)}`
                : "Price Unavailable"}
            </p>
          </div>
        </CardContent>
        <CardFooter className="bg-secondary">Rating</CardFooter>
      </Card>
    </Link>
  );
};

export default ProductCard;
