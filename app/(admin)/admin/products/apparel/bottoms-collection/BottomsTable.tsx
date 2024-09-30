"use client";
import React, { useEffect, useState } from "react";
import { Product } from "@prisma/client";
import { Eye, Pencil, Trash } from "lucide-react";
import Link from "next/link";
import SearchField from "@/app/(admin)/_components/SearchField";
import { fetchBottomsCollections } from "./actions";

const BottomsTable = () => {
  const [bottomsProducts, setBottomsProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadBottomsProducts = async () => {
      setIsLoading(true);
      const result = await fetchBottomsCollections(undefined, searchQuery);
      if (result.success) {
        setBottomsProducts(result.data);
        setError(null);
      } else {
        setError(result.error);
      }
      setIsLoading(false);
    };

    loadBottomsProducts();
  }, [searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="overflow-x-auto">
      <div className="m-6 flex space-x-9 items-center">
        <h1 className="text-2xl font-extrabold">BOTTOMS COLLECTION</h1>
        <div className="w-52">
          <SearchField onSearch={handleSearch} />
        </div>
      </div>

      <table className="min-w-full bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
              SKU
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
              Stock
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
              Published
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 text-black">
          {bottomsProducts.map((product) => (
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
                    href={`/admin/products/apparel/${product.id}`}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <Eye size={18} />
                  </Link>
                  <Link
                    href={`/admin/products/apparel/${product.id}/edit`}
                    className="text-green-600 hover:text-green-900"
                  >
                    <Pencil size={18} />
                  </Link>
                  <Link
                    href={`/admin/products/apparel/${product.id}/delete`}
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
  );
};

export default BottomsTable;
