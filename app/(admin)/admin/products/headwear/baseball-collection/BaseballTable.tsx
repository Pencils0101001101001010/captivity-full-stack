"use client";
import React, { useEffect, useState } from "react";
import { Product } from "@prisma/client";
import { fetchBaseballCollections } from "./actions";

const BaseballTable = () => {
  const [baseballProducts, setBaseballProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBaseballProducts = async () => {
      setIsLoading(true);
      const result = await fetchBaseballCollections();
      if (result.success) {
        setBaseballProducts(result.data);
        setError(null);
      } else {
        setError(result.error);
      }
      setIsLoading(false);
    };

    loadBaseballProducts();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              SKU
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Stock
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Published
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {baseballProducts.map((product) => (
            <tr key={product.id}>
              <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{product.sku}</td>
              <td className="px-6 py-4 whitespace-nowrap">{product.type}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                ${product.regularPrice?.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {product.stock ?? "N/A"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {product.published ? "Yes" : "No"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BaseballTable;
