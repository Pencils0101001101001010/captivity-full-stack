"use client";

import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type SlideInCartProps = {
  isOpen: boolean;
  onClose: () => void;
};

const SlideInCart: React.FC<SlideInCartProps> = ({ isOpen, onClose }) => {
  // Dummy data for cart items
  const cartItems = [
    {
      id: 1,
      name: "Black Baseball Cap",
      price: 299.99,
      quantity: 2,
      image: "/api/placeholder/100/100",
      color: "Black",
      size: "One Size",
    },
    {
      id: 2,
      name: "White T-Shirt",
      price: 399.99,
      quantity: 1,
      image: "/api/placeholder/100/100",
      color: "White",
      size: "L",
    },
    {
      id: 3,
      name: "Red Hoodie",
      price: 599.99,
      quantity: 1,
      image: "/api/placeholder/100/100",
      color: "Red",
      size: "XL",
    },
  ];

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 100.0; // Fixed shipping cost
  const total = subtotal + shipping;

  return (
    <div
      className={`fixed inset-y-0 right-0 w-full md:w-[450px] bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center text-black">
          <p className="text-3xl font-semibold">Shopping Cart</p>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-800 rounded-full"
          >
            <X size={24} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {cartItems.map(item => (
            <div
              key={item.id}
              className="flex gap-4 border-b border-gray-200 py-4"
            >
              <div className="relative w-20 h-20">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover rounded"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-800">{item.name}</h3>
                <p className="text-sm text-gray-600">
                  {item.color} / {item.size}
                </p>
                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center border rounded">
                    <button className="px-2 py-1 border-r hover:bg-gray-100">
                      -
                    </button>
                    <span className="px-4 py-1">{item.quantity}</span>
                    <button className="px-2 py-1 border-l hover:bg-gray-100">
                      +
                    </button>
                  </div>
                  <p className="font-medium">R{item.price.toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="border-t p-4 bg-gray-50">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>R{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>R{shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>R{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-2">
            <Link
              href="/checkout"
              className="block w-full bg-red-600 text-white text-center py-3 rounded-md font-medium hover:bg-red-700"
            >
              Checkout Now
            </Link>
            <Link
              href="/cart"
              className="block w-full bg-gray-800 text-white text-center py-3 rounded-md font-medium hover:bg-gray-900"
            >
              View Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlideInCart;
