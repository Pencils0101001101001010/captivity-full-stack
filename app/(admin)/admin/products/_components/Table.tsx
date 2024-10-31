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
  ChevronLeft,
  ChevronRight,
  Loader2,
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
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingToggles, setLoadingToggles] = useState<Set<string>>(new Set());
  const [loadingDeletes, setLoadingDeletes] = useState<Set<string>>(new Set());
  const [localProducts, setLocalProducts] = useState(products);
  const itemsPerPage = 6;

  // Handle toggle with loading state
  const handleTogglePublish = async (id: string) => {
    setLoadingToggles(prev => new Set([...prev, id]));

    // Optimistic update
    setLocalProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === id
          ? { ...product, isPublished: !product.isPublished }
          : product
      )
    );

    try {
      await onTogglePublish(id);
    } catch (error) {
      // Revert on error
      setLocalProducts(prevProducts =>
        prevProducts.map(product =>
          product.id === id
            ? { ...product, isPublished: !product.isPublished }
            : product
        )
      );
    } finally {
      setLoadingToggles(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  // Handle delete with loading state
  const handleDelete = async (id: string) => {
    setLoadingDeletes(prev => new Set([...prev, id]));

    // Optimistic update
    setLocalProducts(prevProducts =>
      prevProducts.filter(product => product.id !== id)
    );

    try {
      await onDelete(id);
    } catch (error) {
      // Revert on error
      setLocalProducts(products);
    } finally {
      setLoadingDeletes(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

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

  // Update localProducts when products prop changes
  React.useEffect(() => {
    setLocalProducts(products);
  }, [products]);

  // Sort and filter products
  const filteredProducts = localProducts
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

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const toggleSort = (field: keyof TableProduct) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  // Reset to first page when search or filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterPublished]);

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
            {paginatedProducts.map(product => {
              const { totalQuantity, uniqueColors, uniqueSizes } =
                calculateTotals(product.variations);
              const isToggling = loadingToggles.has(product.id);
              const isDeleting = loadingDeletes.has(product.id);

              return (
                <TableRow
                  key={product.id}
                  className={isDeleting ? "opacity-50" : ""}
                >
                  <TableCell className="font-medium">
                    {product.productName}
                  </TableCell>
                  <TableCell>R{product.sellingPrice.toFixed(2)}</TableCell>
                  <TableCell>{uniqueColors}</TableCell>
                  <TableCell>{uniqueSizes}</TableCell>
                  <TableCell>{totalQuantity}</TableCell>
                  <TableCell>
                    {isToggling ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Switch
                        checked={product.isPublished}
                        onCheckedChange={() => handleTogglePublish(product.id)}
                        disabled={isToggling || isDeleting}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onView(product.id)}
                        disabled={isDeleting}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(product.id)}
                        disabled={isDeleting}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      {isDeleting ? (
                        <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(product.id)}
                          className="text-red-500 hover:text-red-700"
                          disabled={isToggling}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-500">
          Showing {startIndex + 1} to{" "}
          {Math.min(startIndex + itemsPerPage, filteredProducts.length)} of{" "}
          {filteredProducts.length} products
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
          <div className="flex items-center gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <Button
                key={i}
                variant={currentPage === i + 1 ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage(page => Math.min(totalPages, page + 1))
            }
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
