import React from "react";
import ProductsDetails from "./ProductsDetails";
import { fetchProductById } from "./actions";

type PageProps = {
  params: {
    id: string;
  };
};

const Page: React.FC<PageProps> = async ({ params }) => {
  const productId = parseInt(params.id, 10);
  const result = await fetchProductById(productId);

  if (!result.success) {
    return <div>Error: {result.error}</div>;
  }

  return (
    <div>
      <ProductsDetails product={result.data} />
    </div>
  );
};

export default Page;
