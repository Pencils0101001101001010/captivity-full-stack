import React from "react";
import ProductCollections from "./Categories";
import NewProducts from "./_components/NewProducts";

const Page = () => {
  return (
    <div className="flex flex-col space-y-10">
      <ProductCollections />
      <NewProducts />
    </div>
  );
};

export default Page;
