"use client";

import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { ProductTableHeader } from "./TableHeader";
import { TableActions } from "./TableActions";
import { TableFilters } from "./TableFilters";
import { TablePagination } from "./TablePagination";
import { ProductTableProps, TableProduct } from "../_types/table";
import {
  calculateTotals,
  filterProducts,
  sortProducts,
} from "../_utils/tableUtils";

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

  // Update localProducts when products prop changes
  useEffect(() => {
    setLocalProducts(products);
  }, [products]);

  // Reset to first page when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterPublished]);

  const handleSort = (field: keyof TableProduct) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const filteredProducts = filterProducts(
    localProducts,
    searchTerm,
    filterPublished
  );
  const sortedProducts = sortProducts(
    filteredProducts,
    sortField,
    sortDirection
  );

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = sortedProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-4xl font-bold">{collectionName} Products</h2>
        <TableFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterPublished={filterPublished}
          onFilterChange={setFilterPublished}
        />
      </div>

      <div className="border rounded-md m-8 ">
        <Table>
          <ProductTableHeader
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
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
                    <TableActions
                      id={product.id}
                      isDeleting={isDeleting}
                      isToggling={isToggling}
                      onView={onView}
                      onEdit={onEdit}
                      onDelete={handleDelete}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        startIndex={startIndex}
        endIndex={Math.min(startIndex + itemsPerPage, sortedProducts.length)}
        totalItems={sortedProducts.length}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
