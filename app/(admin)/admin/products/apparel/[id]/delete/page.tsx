import React from "react";
import DeleteProduct from "./DeleteProduct";
import { Product } from "@prisma/client";

const Page = () => {
  return (
    <div className="flex justify-center items-center flex-col">
      <DeleteProduct />
    </div>
  );
};

export default Page;
