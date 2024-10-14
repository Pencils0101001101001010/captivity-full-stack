"use client";
import React from "react";
import useLatestProducts from "./useLatestProducts";

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
        <ul className="latest-products-list">
          {products.map(product => (
            <li key={product.id} className="latest-product-item">
              <h2>{product.productName}</h2>
              {product.featuredImage && (
                <img
                  src={product.featuredImage.thumbnail}
                  alt={product.productName}
                  width={100}
                />
              )}
              <p>{product.description}</p>
              <p>Price: ${product.sellingPrice.toFixed(2)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LatestProducts;
