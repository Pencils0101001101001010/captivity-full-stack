import React from "react";
import Collections from "./Collections";
import LatestProducts from "./LatestProducts";

const Page = () => {
  return (
    <div className="flex flex-col gap-5">
      <Collections />
      <LatestProducts />
    </div>
  );
};

export default Page;
