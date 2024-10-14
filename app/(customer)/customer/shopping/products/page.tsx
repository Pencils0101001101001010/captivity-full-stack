import React from "react";
import Collections from "./Collections";
import LatestProducts from "./LatestProducts";

const Page = () => {
  return (
    <div className="flex flex-col gap-5">
      <Collections />
      <div>
        <LatestProducts />
      </div>
      
    </div>
  );
};

export default Page;
