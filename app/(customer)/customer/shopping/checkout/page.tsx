import React from "react";
import CheckoutForm from "./CheckoutForm";
import { CartData, CartActionResult } from "@/app/(customer)/types";
import { getCart } from "../cart/actions";
import LinkButton from "../products/_components/LinkButton";

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
      <LinkButton
        href="/customer/shopping/products"
        variant="default"
        className="custom-class"
      >
        Back to express shop
      </LinkButton>
      <h1 className="text-3xl font-extrabold mb-8 text-center">
        CHECKOUT PAGE
      </h1>
      <CheckoutForm cartData={cartData} />
    </div>
  );
}

export default CheckoutPage;
