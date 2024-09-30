"use client";
import React, { useEffect, useState } from "react";
import { Product } from "@prisma/client";
import { fetchLeisureCollections } from "./actions";
import SearchField from "@/app/(admin)/_components/SearchField";
import Link from "next/link";
import { Eye, Pencil, Trash } from "lucide-react";

const LeisureTable = () => {
  const [leisureProducts, setLeisureProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const loadLeisureProducts = async (query: string = "") => {
    setIsLoading(true);
    const result = await fetchLeisureCollections(undefined, query);
    if (result.success) {
      setLeisureProducts(result.data);
      setError(null);
    } else {
      setError(result.error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadLeisureProducts();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    loadLeisureProducts(query);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div className="overflow-x-auto mt-4">
        <div className="m-6 flex space-x-9 items-center">
          <h1 className="text-2xl font-extrabold">LEISURE COLLECTION</h1>
          <div className="w-52">
            <SearchField onSearch={handleSearch} />
          </div>
        </div>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leisureProducts.map((product) => (
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
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-6">
                    <Link
                      href={`/admin/products/headwear/${product.id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Eye size={18} />
                    </Link>
                    <Link
                      href={`/admin/products/headwear/${product.id}/edit`}
                      className="text-green-600 hover:text-green-900"
                    >
                      <Pencil size={18} />
                    </Link>
                    <Link
                      href={`/admin/products/headwear/${product.id}/delete`}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash size={18} />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeisureTable;
