import React from "react";
import Collections from "./Collections";
import LatestProducts from "./LatestProducts";

const CustomerExpressLandingPage = () => {
  return (
    <div className="flex flex-col gap-5">
      <Collections />
      <div>
        <LatestProducts />
      </div>
    </div>
  );
};

export default CustomerExpressLandingPage;
