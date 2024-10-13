import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { CartData } from "../../../types"; // Adjust the path as necessary

interface SlideInCartProps {
  isOpen: boolean;
  onClose: () => void;
  cartData: CartData | null;
}

const SlideInCart: React.FC<SlideInCartProps> = ({
  isOpen,
  onClose,
  cartData,
}) => {
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const handleImageError = (imageUrl: string) => {
    setFailedImages(prev => new Set(prev).add(imageUrl));
  };

  const userName = cartData?.users.username;

  const getAttributeValue = (product: any, attributeName: string) => {
    const attributeKey = `attribute${attributeName}Default`;
    return product[attributeKey] || "N/A";
  };

  return (
    <div
      className={`fixed inset-y-0 right-0 w-[450px] bg-white shadow-lg transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } transition-transform duration-300 ease-in-out z-50`}
    >
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold">Cart Owner: {userName}</h2>
        <Button onClick={onClose} variant="ghost" size="icon">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="overflow-y-auto h-[calc(100%-180px)] p-4">
        {!cartData || cartData.CartItem.length === 0 ? (
          <p className="text-center">Your cart is empty.</p>
        ) : (
          cartData.CartItem.map((item, index) => {
            const price = item.products.regularPrice ?? 0;
            const quantity = item.quanity || 0;
            const total = (quantity * price).toFixed(2);
            const imageUrl = item.products.imageUrl;
            const color = getAttributeValue(item.products, "1");
            const size = getAttributeValue(item.products, "2");

            const firstImageUrl = imageUrl?.split(",")?.[0]?.trim();

            return (
              <div
                key={item.id}
                className="flex flex-col mb-4 p-4 border rounded-lg"
              >
                <div className="flex items-stretch mb-2">
                  <div className="w-1/3 min-w-[80px] max-w-[120px] aspect-square relative mr-4">
                    {firstImageUrl && !failedImages.has(firstImageUrl) ? (
                      <Image
                        src={firstImageUrl}
                        alt={item.products.name}
                        fill
                        sizes="(max-width: 120px) 100vw, 120px"
                        style={{ objectFit: "cover" }}
                        className="rounded-md"
                        onError={() => handleImageError(firstImageUrl)}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
                        <span className="text-xs text-gray-500">No image</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-grow flex flex-col justify-between">
                    <div>
                      <Button
                        asChild
                        variant="link"
                        className="p-0 h-auto font-semibold text-left"
                      >
                        <Link
                          href={`/customer/shopping/cart/${item.products.id}`}
                        >
                          {item.products.name}
                        </Link>
                      </Button>
                      <div className="flex flex-col gap-1 mt-1">
                        <p className="text-sm text-gray-600">
                          {item.products.attribute1Name}: {color}
                        </p>
                        {item.products.attribute2Name && (
                          <p className="text-sm text-gray-600">
                            {item.products.attribute2Name}: {size}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between items-end mt-2">
                      <p className="text-sm">
                        {quantity} x R{price.toFixed(2)}
                      </p>
                      <span className="font-bold">R{total}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
        <div className="grid grid-cols-2 gap-2">
          <Button asChild className="w-full">
            <Link href="/customer/checkout">Checkout</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SlideInCart;
