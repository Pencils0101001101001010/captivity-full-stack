"use client";
import React from "react";
import useLatestProducts from "./useLatestProducts";
import Image from "next/image";

const LatestProducts = () => {
  const { products, loading, error } = useLatestProducts();

  if (loading) {
    return <div>Loading latest products...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Latest Products</h1>
      {products.length === 0 ? (
        <p>No new products available.</p>
      ) : (
        <ul className="grid grid-cols-3 space-x-4 space-y-4">
          {products.map(product => (
            <li key={product.id} className=" bg-slate-300 p-5 rounded-xl">
              <h2>{product.productName}</h2>
              {product.featuredImage && (
                <Image
                  src={product.featuredImage.thumbnail}
                  alt={product.productName}
                  width={100}
                  height={100}
                />
              )}
              <div dangerouslySetInnerHTML={{ __html: product.description }} />
              <p>Price: R{product.sellingPrice.toFixed(2)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LatestProducts;
