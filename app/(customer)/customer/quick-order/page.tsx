import React from "react";
import ProductList from "./ProductList";

const Page = () => {
  return (
    <div>
      <h1 className="text-4xl font-bold  border-b-2 pb- m-4">Quick Order</h1>
      <ProductList />
    </div>
  );
};

export default Page;
