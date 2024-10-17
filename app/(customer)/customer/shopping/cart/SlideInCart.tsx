import React from "react";
import { ShoppingCart, X } from "lucide-react";
import Image from "next/image";
import { ExtendedCartItem } from "@/app/(customer)/types";
import LinkButton from "../../PagesLinkButton";

interface SlideInCartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: ExtendedCartItem[];
}

const SlideInCart: React.FC<SlideInCartProps> = ({
  isOpen,
  onClose,
  cartItems = [],
}) => {
  const total =
    cartItems?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;

  return (
    <div
      className={`fixed inset-y-0 right-0 w-[450px] bg-white shadow-lg transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } transition-transform duration-300 ease-in-out z-50 flex flex-col`}
    >
      <div className="flex-grow overflow-y-auto">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Your Cart</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>
          <div className="mb-4">
            {cartItems && cartItems.length > 0 ? (
              cartItems.map(item => (
                <div
                  key={`${item.productId}-${item.variationId}`}
                  className="flex items-center mb-4"
                >
                  <Image
                    src={item.image}
                    alt={item.productName}
                    width={50}
                    height={50}
                    className="mr-4"
                  />
                  <div className="flex-grow">
                    <h3 className="font-semibold">{item.productName}</h3>
                    <p className="text-sm text-gray-600">
                      {item.variationName}
                    </p>
                    <p className="text-sm">Quantity: {item.quantity}</p>
                  </div>
                  <span className="font-bold">R{item.price.toFixed(2)}</span>
                </div>
              ))
            ) : (
              <p>Your cart is empty</p>
            )}
          </div>
        </div>
      </div>
      <div className="p-4 border-t border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <span className="font-bold">Total:</span>
          <span className="font-bold">R{total.toFixed(2)}</span>
        </div>
        <LinkButton
          href="/customer/shopping/checkout"
          icon={ShoppingCart}
          variant="destructive"
          className="w-full"
        >
          Checkout
        </LinkButton>
        <div className="mt-6">
          <LinkButton
            href="/customer/shopping/cart"
            icon={ShoppingCart}
            variant="default"
            className="w-full"
          >
            Go to Cart
          </LinkButton>
        </div>
      </div>
    </div>
  );
};

export default SlideInCart;
