import React from "react";
import { X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface SlideInCartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: any[]; // Replace 'any' with your actual cart item type
  subtotal: number;
}

const SlideInCart: React.FC<SlideInCartProps> = ({
  isOpen,
  onClose,
  cartItems,
  subtotal,
}) => {
  return (
    <div
      className={`fixed inset-y-0 right-0 w-[450px] bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 flex-grow overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Your Cart</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>
          <div className="space-y-4">
            {cartItems.map((item, index) => (
              <div key={index} className="flex items-center">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={50}
                  height={50}
                  className="mr-2"
                />
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    R{item.price.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 border-t">
          <p className="font-bold mb-4">Subtotal: R{subtotal.toFixed(2)}</p>
          <Button
            variant={"destructive"}
            className="w-full text-white py-2 px-4 rounded mb-2"
          >
            View Basket
          </Button>
          <Button
            variant={"default"}
            className="w-full text-white py-2 px-4 rounded"
          >
            Checkout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SlideInCart;
