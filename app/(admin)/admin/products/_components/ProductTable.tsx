"use client";

import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { ProductTableHeader } from "./TableHeader";
import { TableActions } from "./TableActions";
import { TableFilters } from "./TableFilters";
import { TablePagination } from "./TablePagination";
import { ProductTableProps, TableVariation } from "../_types/table";
import { filterProducts, sortProducts } from "../_utils/tableUtils";

export default function ProductTable({
  products,
  collectionName,
  onTogglePublish,
  onDelete,
  onEdit,
  onView,
}: ProductTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof TableVariation>("createdAt");
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

    const productId = localProducts.find(v => v.id === id)?.productId;
    if (!productId) return;

    // Optimistic update for all variations of the same product
    setLocalProducts(prevProducts =>
      prevProducts.map(variation =>
        variation.productId === productId
          ? { ...variation, isPublished: !variation.isPublished }
          : variation
      )
    );

    try {
      await onTogglePublish(productId);
    } catch (error) {
      // Revert on error
      setLocalProducts(prevProducts =>
        prevProducts.map(variation =>
          variation.productId === productId
            ? { ...variation, isPublished: !variation.isPublished }
            : variation
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

    const productId = localProducts.find(v => v.id === id)?.productId;
    if (!productId) return;

    // Optimistic update for all variations of the same product
    setLocalProducts(prevProducts =>
      prevProducts.filter(variation => variation.productId !== productId)
    );

    try {
      await onDelete(productId);
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

  useEffect(() => {
    setLocalProducts(products);
  }, [products]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterPublished]);

  const handleSort = (field: keyof TableVariation) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  // Enhanced filter function
  const filterLocalProducts = (products: TableVariation[]) => {
    return products.filter(variation => {
      if (filterPublished !== "all") {
        const isPublishedMatch =
          filterPublished === "published"
            ? variation.isPublished
            : !variation.isPublished;
        if (!isPublishedMatch) return false;
      }

      if (!searchTerm) return true;

      const searchLower = searchTerm.toLowerCase();
      return (
        variation.productName.toLowerCase().includes(searchLower) ||
        variation.name.toLowerCase().includes(searchLower) ||
        variation.color.toLowerCase().includes(searchLower) ||
        variation.size.toLowerCase().includes(searchLower) ||
        variation.sku.toLowerCase().includes(searchLower) ||
        variation.sku2.toLowerCase().includes(searchLower)
      );
    });
  };

  const filteredProducts = filterLocalProducts(localProducts);
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

      <div className="border rounded-md m-8 shadow-2xl shadow-black">
        <Table>
          <ProductTableHeader
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
          <TableBody>
            {paginatedProducts.map(variation => {
              const isToggling = loadingToggles.has(variation.id);
              const isDeleting = loadingDeletes.has(variation.id);

              return (
                <TableRow
                  key={variation.id}
                  className={isDeleting ? "opacity-50" : ""}
                >
                  <TableCell>
                    {variation.variationImageURL && (
                      <div className="relative w-16 h-16 rounded-md overflow-hidden">
                        <Image
                          src={variation.variationImageURL}
                          alt={variation.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    <div>
                      <div>{variation.productName}</div>
                      <div className="text-sm text-gray-500">
                        {variation.name}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>R{variation.sellingPrice.toFixed(2)}</TableCell>
                  <TableCell>{variation.color}</TableCell>
                  <TableCell>{variation.size}</TableCell>
                  <TableCell>{variation.quantity}</TableCell>
                  <TableCell>
                    {isToggling ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Switch
                        checked={variation.isPublished}
                        onCheckedChange={() =>
                          handleTogglePublish(variation.id)
                        }
                        disabled={isToggling || isDeleting}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <TableActions
                      id={variation.productId}
                      isDeleting={isDeleting}
                      isToggling={isToggling}
                      onView={onView}
                      onEdit={onEdit}
                      onDelete={() => handleDelete(variation.id)}
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
