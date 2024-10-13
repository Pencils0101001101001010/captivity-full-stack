import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CartData } from "../types"; // Adjust the path as necessary

interface SlideInCartProps {
  isOpen: boolean;
  onClose: () => void;
  cartData: CartData | null; // Accept cartData as a prop
}

const SlideInCart: React.FC<SlideInCartProps> = ({
  isOpen,
  onClose,
  cartData,
}) => {
  return (
    <div
      className={`fixed inset-y-0 right-0 w-[450px] bg-white shadow-lg transform ${isOpen ? "translate-x-0" : "translate-x-full"} transition-transform duration-300 ease-in-out z-50`}
    >
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold">Your Cart</h2>
        <Button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={24} color="white" />
        </Button>
      </div>

      <div className="overflow-y-auto h-[calc(100%-180px)] p-4">
        {cartData?.CartItem.length === 0 ? (
          <p className="text-center">Your cart is empty.</p>
        ) : (
          cartData?.CartItem.map(item => {
            const price = item.products.regularPrice ?? 0; // Default to 0 if regularPrice is null
            const quantity = item.quanity || 0; // Default to 0 if quantity is null or undefined
            const total = (quantity * price).toFixed(2); // Calculate total

            return (
              <div
                key={item.id}
                className="flex justify-between items-center mb-4"
              >
                <div>
                  <h3 className="font-semibold">{item.products.name}</h3>
                  <p>
                    {quantity} x R{price.toFixed(2)}
                  </p>
                </div>
                <div>
                  <span className="font-bold">R{total}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
        <div className="grid grid-cols-2 gap-2">
          <Button asChild className="w-full">
            <Link href={"/customer/checkout"}>Checkout</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SlideInCart;
