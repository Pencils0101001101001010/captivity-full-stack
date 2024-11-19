"use client";

import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "@/app/(vendor)/SessionProvider";
import useVendorCartStore from "./useCartStore";
import {
  VendorCart,
  VendorVariation,
  VendorProduct,
  VendorDynamicPricing,
} from "@prisma/client";

type VendorProductWithDetails = VendorProduct & {
  featuredImage?: {
    medium: string;
  } | null;
  dynamicPricing: VendorDynamicPricing[];
};

type VendorVariationWithProduct = VendorVariation & {
  vendorProduct: VendorProductWithDetails;
};

type VendorCartItem = {
  id: string;
  vendorCartId: string;
  vendorVariationId: string;
  quantity: number;
  vendorVariation: VendorVariationWithProduct;
};

type VendorCartWithItems = VendorCart & {
  vendorCartItems: VendorCartItem[];
};

interface User {
  id: string;
  username: string;
  displayName: string;
  role: string;
}

interface SessionData {
  user: User | null;
}

const VendorViewCart = () => {
  const { cart, updateCartItemQuantity, removeFromCart } = useVendorCartStore();
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());
  const { user } = useSession() as SessionData;

  if (
    !user ||
    !["VENDOR", "VENDORCUSTOMER", "APPROVEDVENDORCUSTOMER"].includes(user.role)
  ) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-semibold mb-4">
          Please login to view your vendor cart
        </h1>
        <Link
          href="/vendor/auth/login"
          className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:bg-primary/90"
        >
          Login as Vendor Customer
        </Link>
      </div>
    );
  }

  if (!cart || !cart.vendorCartItems || cart.vendorCartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-semibold mb-4">
          Your Vendor Cart is Empty
        </h1>
        <Link
          href="/vendor/shopping"
          className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:bg-primary/90"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  const cartItems = (cart as VendorCartWithItems).vendorCartItems;

  const calculateItemPrice = (item: VendorCartItem) => {
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

  const subtotal = cartItems.reduce(
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold mb-8">
          {user?.username
            ? `${user.displayName}'s Vendor Cart`
            : "Vendor Shopping Cart"}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items Section */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map(item => {
            const itemTotal = calculateItemPrice(item);
            const basePrice = item.vendorVariation.vendorProduct.sellingPrice;
            const hasDiscount = itemTotal < basePrice * item.quantity;

            return (
              <div
                key={item.id}
                className="flex gap-4 bg-card p-6 rounded-lg shadow"
              >
                <div className="relative w-32 h-32">
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

                <div className="flex-1">
                  <h3 className="text-xl font-medium text-card-foreground">
                    {item.vendorVariation.vendorProduct.productName}
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    {item.vendorVariation.color} / {item.vendorVariation.size}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    SKU: {item.vendorVariation.sku}
                    {item.vendorVariation.sku2 &&
                      ` / ${item.vendorVariation.sku2}`}
                  </p>

                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center gap-4">
                      <select
                        value={item.quantity}
                        onChange={e =>
                          handleUpdateQuantity(item.id, Number(e.target.value))
                        }
                        disabled={updatingItems.has(item.id)}
                        className="border rounded-md px-3 py-2 bg-background text-foreground"
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
                        className="text-destructive hover:text-destructive/90 disabled:opacity-50 flex items-center gap-2"
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
                            <Trash2 size={20} />
                            <span>Remove</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-xl font-semibold text-card-foreground">
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

        {/* Cart Summary Section */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg shadow p-6 sticky top-4">
            <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>

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
              <div className="flex justify-between font-semibold text-lg text-card-foreground">
                <span>Total</span>
                <span>R{total.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                href="/vendor/shopping/checkout"
                className="block w-full bg-primary text-primary-foreground text-center py-3 rounded-md font-medium hover:bg-primary/90"
              >
                Proceed to Checkout
              </Link>
              <Link
                href="/vendor/shopping"
                className="block w-full bg-secondary text-secondary-foreground text-center py-3 rounded-md font-medium hover:bg-secondary/90"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorViewCart;
