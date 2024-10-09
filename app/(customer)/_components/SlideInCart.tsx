import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface SlideInCartProps {
  isOpen: boolean;
  onClose: () => void;
}

const SlideInCart: React.FC<SlideInCartProps> = ({ isOpen, onClose }) => {
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
      <div className="overflow-y-auto h-[calc(100%-180px)] p-4"></div>
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
