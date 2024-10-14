import React from "react";
import SummerCollections from "./SummerCollections";
import LinkButton from "../_components/LinkButton";

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
        <SummerCollections />
      </h1>
    </div>
  );
};

export default SummerCollectionPage;
