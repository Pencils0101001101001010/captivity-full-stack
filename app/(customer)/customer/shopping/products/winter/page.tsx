import React from "react";

import LinkButton from "../_components/LinkButton";
import WinterCollections from "./WinterCollection";

const SummerCollectionPage = () => {
  return (
    <div>
      <LinkButton
        href="/customer/shopping/products"
        variant="default"
        className="custom-class"
      >
        Back to express
      </LinkButton>
      <h1>
        <WinterCollections />
      </h1>
    </div>
  );
};

export default SummerCollectionPage;
