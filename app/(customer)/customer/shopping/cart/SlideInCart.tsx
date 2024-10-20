import React from "react";
import { X } from "lucide-react";
import Image from "next/image";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const dummyProducts = [
  { id: 1, name: "Product 1", price: 19.99, image: "/product1.jpg" },
  { id: 2, name: "Product 2", price: 29.99, image: "/product2.jpg" },
  { id: 3, name: "Product 3", price: 39.99, image: "/product3.jpg" },
];

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose }) => {
  const totalCost = dummyProducts.reduce(
    (sum, product) => sum + product.price,
    0
  );

  return (
    <div
      className={`fixed top-0 right-0 h-full w-[450px] bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } z-50 flex flex-col`}
    >
      <div className="p-4 flex-grow overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Your Cart</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-4">
          {dummyProducts.map(product => (
            <div
              key={product.id}
              className="flex items-center space-x-4 pb-4 border-b border-gray-200"
            >
              <Image
                src={product.image}
                alt={product.name}
                width={60}
                height={60}
                className="rounded-md object-cover"
              />
              <div className="flex-grow">
                <p className="font-semibold">{product.name}</p>
                <p className="text-gray-600">R{product.price.toFixed(2)}</p>
              </div>
              <button className="text-red-500 hover:text-red-700">
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="p-4 border-t border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">Subtotal:</span>
          <span className="text-xl font-bold">R{totalCost.toFixed(2)}</span>
        </div>
        <div className="space-y-2">
          <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors">
            Checkout
          </button>
          <button className="w-full bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300 transition-colors">
            View Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartSidebar;
