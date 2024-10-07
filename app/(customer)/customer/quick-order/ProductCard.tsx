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
  colors: string[];
  sizes: string[];
}

const ProductCard = ({ product }: { product: GroupedProduct }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  const handleMouseEnter = () => {
    if (product.imageUrls.length > 1) {
      setCurrentImageIndex(1);
    }
  };

  const handleMouseLeave = () => {
    setCurrentImageIndex(imageError ? 1 : 0);
  };

  const handleImageError = () => {
    if (currentImageIndex === 0 && product.imageUrls.length > 1) {
      setCurrentImageIndex(1);
      setImageError(true);
    }
  };

  return (
    <Link href={`/customer/quick-order/${product.id}`}>
      <Card
        className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-300"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <CardHeader className="bg-primary text-primary-foreground">
          <h2 className="text-lg font-bold truncate">{product.name}</h2>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative w-full h-64">
            {product.imageUrls.length > 0 ? (
              <Image
                src={product.imageUrls[currentImageIndex]}
                alt={product.name}
                width={200}
                height={200}
                className="transition-opacity duration-300 w-full h-[250px]"
                onError={handleImageError}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                No Image Available
              </div>
            )}
          </div>
          <div className="p-4">
            <p className="font-bold text-2xl text-primary">
              ${product.regularPrice?.toFixed(2)}
            </p>
          </div>
        </CardContent>
        <CardFooter className="bg-secondary">
          <div className="w-full">
            <p className="text-sm text-secondary-foreground">
              Colors: {product.colors.join(", ")}
            </p>
            <p className="text-sm text-secondary-foreground">
              Sizes: {product.sizes.join(", ")}
            </p>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ProductCard;
