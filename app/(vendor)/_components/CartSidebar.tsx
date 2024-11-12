"use client";
import { ShoppingBag, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartSidebar = ({ isOpen, onClose }: CartSidebarProps) => {
  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 transition-opacity duration-300 z-50",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full bg-background shadow-xl transform transition-transform duration-300 ease-in-out z-50",
          "w-[400px] sm:w-[400px] md:w-[450px]", // Responsive widths
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
            <h2 className="text-lg sm:text-xl font-semibold">Shopping Cart</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 hover:bg-accent rounded-full transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Cart content */}
        <div className="flex flex-col h-[calc(100%-140px_sm:calc(100%-180px)] overflow-y-auto">
          {/* Empty state */}
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <ShoppingBag className="w-12 h-12 sm:w-16 sm:h-16 mb-3 sm:mb-4" />
            <p className="text-base sm:text-lg">Your cart is empty</p>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 border-t bg-background p-3 sm:p-4 space-y-3 sm:space-y-4">
          <div className="flex justify-between text-base sm:text-lg font-semibold">
            <span>Total</span>
            <span>$0.00</span>
          </div>
          <button
            className={cn(
              "w-full bg-primary text-primary-foreground py-2.5 sm:py-3 rounded-md",
              "hover:bg-primary/90 transition-colors",
              "text-sm sm:text-base font-medium"
            )}
            onClick={() => {
              /* Handle checkout */
            }}
          >
            Checkout
          </button>
        </div>
      </div>
    </>
  );
};

export default CartSidebar;
