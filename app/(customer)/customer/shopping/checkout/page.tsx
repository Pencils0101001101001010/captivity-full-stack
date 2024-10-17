import React from "react";
import CheckoutForm from "./CheckoutForm";
import { ExtendedCartItem } from "@/app/(customer)/types";

const CheckoutPage: React.FC = () => {
  // You would typically fetch this data from your state management solution or API
  const cartItems: ExtendedCartItem[] = [
    // Your cart items here
  ];

  return (
    <div>
      <h1>Checkout</h1>
      <CheckoutForm/>
    </div>
  );
};

export default CheckoutPage;
