import React from "react";
import ProductCollections from "./ProductCollections";
import NewProducts from "./_components/NewProducts";

const Page = () => {
  return (
    <div className="flex flex-col space-y-6">
      <ProductCollections />
      <NewProducts />
    </div>
  );
};

export default Page;
