import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface CategoryProduct {
  id: number;
  name: string;
  sku: string;
  stock: number | null;
  regularPrice: number | null;
  attribute1Default?: string | null;
  attribute2Default?: string | null;
  inStock: boolean;
}

interface ProductDetailsModalProps {
  categoryProducts: CategoryProduct[];
  attribute1Name: string | null;
  attribute2Name?: string | null;
}

const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  categoryProducts,
  attribute1Name,
  attribute2Name,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">View Details</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Product Details</DialogTitle>
        </DialogHeader>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                {attribute1Name && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {attribute1Name}
                  </th>
                )}
                {attribute2Name && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {attribute2Name}
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categoryProducts.map(product => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.sku}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.stock !== null ? product.stock : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.regularPrice !== null
                      ? `R${product.regularPrice.toFixed(2)}`
                      : "N/A"}
                  </td>
                  {attribute1Name && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.attribute1Default || "N/A"}
                    </td>
                  )}
                  {attribute2Name && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.attribute2Default || "N/A"}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsModal;
