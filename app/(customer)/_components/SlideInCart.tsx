import React, { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/app/CartContext";
import Link from "next/link";

interface SlideInCartProps {
  isOpen: boolean;
  onClose: () => void;
}

const SlideInCart: React.FC<SlideInCartProps> = ({ isOpen, onClose }) => {
  const { cartItems, cartTotal, fetchCartData } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      fetchCartData().finally(() => setIsLoading(false));
    }
  }, [isOpen, fetchCartData]);

  return (
    <div
      className={`fixed inset-y-0 right-0 w-80 bg-white shadow-lg transform ${isOpen ? "translate-x-0" : "translate-x-full"} transition-transform duration-300 ease-in-out z-50`}
    >
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold">Your Cart</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>
      </div>
      <div className="overflow-y-auto h-[calc(100%-180px)] p-4">
        {isLoading && <p>Updating cart...</p>}
        {!isLoading && cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          cartItems.map(item => (
            <div key={item.id} className="flex items-center mb-4 border-b pb-2">
              <Image
                src={item.imageUrl}
                alt={item.name}
                width={50}
                height={50}
                className="rounded"
              />
              <div className="ml-4 flex-grow">
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm">
                  {item.quantity} x R{item.price.toFixed(2)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
        <p className="text-lg font-semibold mb-4">
          Subtotal: R{cartTotal.toFixed(2)}
        </p>
        <div className="grid grid-cols-2 gap-2">
          <Button
            asChild
            variant="outline"
            className="w-full"
            onClick={onClose}
          >
            <Link href={"/customer/cart"}>View basket</Link>
          </Button>
          <Button asChild className="w-full">
            <Link href={"/customer/checkout"}>Checkout</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SlideInCart;
