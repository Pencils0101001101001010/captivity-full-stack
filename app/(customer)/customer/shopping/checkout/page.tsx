import React from "react";
import CheckoutForm from "./CheckoutForm";

async function CheckoutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold mb-8 text-center">
        CHECKOUT PAGE
      </h1>
      <CheckoutForm />
    </div>
  );
}

export default CheckoutPage;
