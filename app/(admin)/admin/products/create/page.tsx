import React from "react";
import ProductForm from "./ProductForm";

const Page = () => {
  return (
    <div className="flex flex-col items-center justify-center p-5">
      <h1 className="text-2xl font-bold">Create Product Form</h1>
      <ProductForm />
    </div>
  );
};

export default Page;
