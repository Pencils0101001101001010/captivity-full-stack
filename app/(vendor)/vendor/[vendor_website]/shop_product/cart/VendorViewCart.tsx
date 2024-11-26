"use client";

import React, { useState, useEffect } from "react";
import { Trash2, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "@/app/(vendor)/SessionProvider";
import useVendorCartStore from "./useCartStore";
import { useParams, useRouter } from "next/navigation";

// Import your types
import type {
  VendorCart,
  VendorCartItem,
  VendorVariation,
  VendorProduct,
  VendorDynamicPricing,
} from "../checkout/_lib/types"; // Adjust path as needed

// Calculate price helper
const calculateItemPrice = (item: VendorCartItem): number => {
  const basePrice = item.vendorVariation.vendorProduct.sellingPrice;
  const dynamicPricing = item.vendorVariation.vendorProduct.dynamicPricing;

  if (!dynamicPricing?.length) return basePrice * item.quantity;

  const applicableRule = dynamicPricing.find(rule => {
    const from = parseInt(rule.from);
    const to = parseInt(rule.to);
    return item.quantity >= from && item.quantity <= to;
  });

  if (!applicableRule) return basePrice * item.quantity;

  if (applicableRule.type === "fixed_price") {
    return parseFloat(applicableRule.amount) * item.quantity;
  } else {
    const discount = parseFloat(applicableRule.amount) / 100;
    return basePrice * item.quantity * (1 - discount);
  }
};

const VendorViewCart: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const vendorWebsite = params?.vendor_website as string;

  // Access cart state and actions from the store
  const cart = useVendorCartStore(state => state.cart) as VendorCart | null;
  const fetchCart = useVendorCartStore(state => state.initialize);
  const updateCartItemQuantity = useVendorCartStore(
    state => state.updateQuantity
  );
  const removeFromCart = useVendorCartStore(state => state.removeItem);

  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());
  const { user } = useSession();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleContinueShopping = () => {
    if (vendorWebsite) {
      router.push(
        `/vendor/${vendorWebsite}/shopping/product_categories/summer`
      );
    }
  };

  if (
    !user ||
    !["VENDOR", "VENDORCUSTOMER", "APPROVEDVENDORCUSTOMER"].includes(user.role)
  ) {
    return (
      <div className="container mx-auto px-4 py-8 sm:py-16 text-center">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-4">
          Please login to view your vendor cart
        </h1>
        <Link
          href="/vendor/auth/login"
          className="inline-block bg-primary text-primary-foreground px-4 sm:px-6 py-2 sm:py-3 rounded-md font-medium hover:bg-primary/90"
        >
          Login as Vendor Customer
        </Link>
      </div>
    );
  }

  if (cart === null) {
    return (
      <div className="container mx-auto px-4 py-8 sm:py-16 text-center">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-4">
          Loading cart...
        </h1>
      </div>
    );
  }

  if (!cart.vendorCartItems || cart.vendorCartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 sm:py-16 text-center">
        <div className="space-y-4">
          <ShoppingBag className="w-12 h-12 mx-auto text-muted-foreground" />
          <h1 className="text-2xl sm:text-3xl font-semibold">
            Your Vendor Cart is Empty
          </h1>
          <button
            onClick={handleContinueShopping}
            className="inline-block bg-primary text-primary-foreground px-4 sm:px-6 py-2 sm:py-3 rounded-md font-medium hover:bg-primary/90 mt-4"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const subtotal = cart.vendorCartItems.reduce(
    (sum, item) => sum + calculateItemPrice(item),
    0
  );

  const shipping = 0;
  const total = subtotal + shipping;

  const handleUpdateQuantity = async (
    cartItemId: string,
    newQuantity: number
  ) => {
    setUpdatingItems(prev => new Set(prev).add(cartItemId));
    await updateCartItemQuantity(cartItemId, newQuantity);
    setUpdatingItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(cartItemId);
      return newSet;
    });
  };

  const handleRemoveItem = async (cartItemId: string) => {
    setRemovingItems(prev => new Set(prev).add(cartItemId));
    await removeFromCart(cartItemId);
    setRemovingItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(cartItemId);
      return newSet;
    });
  };

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-0">
          {user?.username
            ? `${user.username}'s Vendor Cart`
            : "Vendor Shopping Cart"}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.vendorCartItems.map(item => {
            const itemTotal = calculateItemPrice(item);
            const basePrice = item.vendorVariation.vendorProduct.sellingPrice;
            const hasDiscount = itemTotal < basePrice * item.quantity;

            return (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row gap-4 bg-card p-4 sm:p-6 rounded-lg shadow"
              >
                <div className="relative w-full sm:w-32 h-48 sm:h-32 shrink-0">
                  <Image
                    src={
                      item.vendorVariation.variationImageURL ||
                      "/api/placeholder/100/100"
                    }
                    alt={item.vendorVariation.vendorProduct.productName}
                    fill
                    className="object-cover rounded"
                  />
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-lg sm:text-xl font-medium text-card-foreground">
                      {item.vendorVariation.vendorProduct.productName}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {item.vendorVariation.color} / {item.vendorVariation.size}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      SKU: {item.vendorVariation.sku}
                      {item.vendorVariation.sku2 &&
                        ` / ${item.vendorVariation.sku2}`}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
                      <select
                        value={item.quantity}
                        onChange={e =>
                          handleUpdateQuantity(item.id, Number(e.target.value))
                        }
                        disabled={updatingItems.has(item.id)}
                        className="border rounded-md px-3 py-2 bg-background text-foreground w-full sm:w-auto"
                      >
                        {[...Array(item.vendorVariation.quantity)].map(
                          (_, i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1}
                            </option>
                          )
                        )}
                      </select>

                      <button
                        className="text-destructive hover:text-destructive/90 disabled:opacity-50 flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start"
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={
                          removingItems.has(item.id) ||
                          updatingItems.has(item.id)
                        }
                      >
                        {removingItems.has(item.id) ? (
                          <span className="text-sm">Removing...</span>
                        ) : (
                          <>
                            <Trash2 className="w-4 h-4" />
                            <span>Remove</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="text-right w-full sm:w-auto">
                      <p className="text-lg sm:text-xl font-semibold text-card-foreground">
                        R{itemTotal.toFixed(2)}
                      </p>
                      {hasDiscount && (
                        <p className="text-sm text-muted-foreground line-through">
                          R{(basePrice * item.quantity).toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg shadow p-4 sm:p-6 sticky top-4">
            <h2 className="text-xl sm:text-2xl font-semibold mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>R{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>R{shipping.toFixed(2)}</span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>R{total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() =>
                router.push(`/vendor/${vendorWebsite}/shop_product/checkout`)
              }
              className="w-full bg-primary text-primary-foreground px-4 sm:px-6 py-3 rounded-md font-medium hover:bg-primary/90"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorViewCart;
