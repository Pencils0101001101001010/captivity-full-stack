"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Pencil,
  Trash2,
  Eye,
  ChevronUp,
  ChevronDown,
  Search,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TableProduct = {
  id: string;
  productName: string;
  sellingPrice: number;
  variations: {
    color: string;
    size: string;
    quantity: number;
  }[];
  isPublished: boolean;
  createdAt: Date;
};

interface ProductTableProps {
  products: TableProduct[];
  collectionName: string;
  onTogglePublish: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onEdit: (id: string) => void;
  onView: (id: string) => void;
}

export default function ProductTable({
  products,
  collectionName,
  onTogglePublish,
  onDelete,
  onEdit,
  onView,
}: ProductTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof TableProduct>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [filterPublished, setFilterPublished] = useState<
    "all" | "published" | "unpublished"
  >("all");

  // Calculate totals for each product
  const calculateTotals = (variations: TableProduct["variations"]) => {
    const totalQuantity = variations.reduce(
      (sum, var_) => sum + var_.quantity,
      0
    );
    const uniqueColors = new Set(variations.map(var_ => var_.color)).size;
    const uniqueSizes = new Set(variations.map(var_ => var_.size)).size;
    return { totalQuantity, uniqueColors, uniqueSizes };
  };

  // Sort and filter products
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.productName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesPublished =
        filterPublished === "all"
          ? true
          : filterPublished === "published"
            ? product.isPublished
            : !product.isPublished;

      return matchesSearch && matchesPublished;
    })
    .sort((a, b) => {
      if (sortField === "sellingPrice") {
        return sortDirection === "asc"
          ? a.sellingPrice - b.sellingPrice
          : b.sellingPrice - a.sellingPrice;
      }
      if (sortField === "createdAt") {
        return sortDirection === "asc"
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return sortDirection === "asc"
        ? a[sortField].toString().localeCompare(b[sortField].toString())
        : b[sortField].toString().localeCompare(a[sortField].toString());
    });

  const toggleSort = (field: keyof TableProduct) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{collectionName} Products</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-500" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-64"
            />
          </div>
          <Select
            value={filterPublished}
            onValueChange={(value: "all" | "published" | "unpublished") =>
              setFilterPublished(value)
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Products</SelectItem>
              <SelectItem value="published">Published Only</SelectItem>
              <SelectItem value="unpublished">Unpublished Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer"
                onClick={() => toggleSort("productName")}
              >
                Product Name{" "}
                {sortField === "productName" &&
                  (sortDirection === "asc" ? (
                    <ChevronUp className="inline w-4 h-4" />
                  ) : (
                    <ChevronDown className="inline w-4 h-4" />
                  ))}
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => toggleSort("sellingPrice")}
              >
                Price{" "}
                {sortField === "sellingPrice" &&
                  (sortDirection === "asc" ? (
                    <ChevronUp className="inline w-4 h-4" />
                  ) : (
                    <ChevronDown className="inline w-4 h-4" />
                  ))}
              </TableHead>
              <TableHead>Colors</TableHead>
              <TableHead>Sizes</TableHead>
              <TableHead>Total Stock</TableHead>
              <TableHead>Published</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map(product => {
              const { totalQuantity, uniqueColors, uniqueSizes } =
                calculateTotals(product.variations);
              return (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">
                    {product.productName}
                  </TableCell>
                  <TableCell>R{product.sellingPrice.toFixed(2)}</TableCell>
                  <TableCell>{uniqueColors}</TableCell>
                  <TableCell>{uniqueSizes}</TableCell>
                  <TableCell>{totalQuantity}</TableCell>
                  <TableCell>
                    <Switch
                      checked={product.isPublished}
                      onCheckedChange={() => onTogglePublish(product.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onView(product.id)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(product.id)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(product.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
