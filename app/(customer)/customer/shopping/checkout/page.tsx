import React from "react";
import CheckoutForm from "./CheckoutForm";
import { CartData, CartActionResult } from "@/app/(customer)/types";
import { getCart } from "../cart/actions";

async function CheckoutPage() {
  const cartResult: CartActionResult<CartData> = await getCart();

  if (!cartResult.success) {
    return (
      <div className="text-center py-8 text-red-500">
        Error: {cartResult.error}
      </div>
    );
  }

  if (!cartResult.data) {
    return (
      <div className="text-center py-8">Unable to retrieve cart data.</div>
    );
  }

  const cartData: CartData = cartResult.data;

  if (cartData.items.length === 0) {
    return <div className="text-center py-8">Your cart is empty.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>
      <CheckoutForm cartData={cartData} />
    </div>
  );
}

export default CheckoutPage;
