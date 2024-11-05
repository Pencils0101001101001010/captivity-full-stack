"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import Image from "next/image";
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

const TableTitle = React.memo(({ title }: { title: string }) => (
  <h2 className="text-4xl font-bold">{title} Products</h2>
));
TableTitle.displayName = "TableTitle";

const ProductImage = React.memo(
  ({ src, alt }: { src: string; alt: string }) => (
    <div className="relative w-16 h-16 rounded-md overflow-hidden">
      <Image src={src} alt={alt} fill className="object-cover" />
    </div>
  )
);
ProductImage.displayName = "ProductImage";

const ProductTableRow = React.memo(
  ({
    product,
    isToggling,
    isDeleting,
    onTogglePublish,
    onView,
    onEdit,
    onDelete,
  }: {
    product: TableProduct;
    isToggling: boolean;
    isDeleting: boolean;
    onTogglePublish: (id: string) => Promise<void>;
    onView: (id: string) => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => Promise<void>;
  }) => {
    const totalsRef = useRef(calculateTotals(product.variations));
    const firstVariationImage = product.variations[0]?.variationImageURL;

    const handleToggle = useCallback(() => {
      onTogglePublish(product.id);
    }, [product.id, onTogglePublish]);

    const handleDelete = useCallback(() => {
      onDelete(product.id);
    }, [product.id, onDelete]);

    return (
      <TableRow className={isDeleting ? "opacity-50" : ""}>
        <TableCell>
          {firstVariationImage && (
            <ProductImage src={firstVariationImage} alt={product.productName} />
          )}
        </TableCell>
        <TableCell className="font-medium">{product.productName}</TableCell>
        <TableCell>R{product.sellingPrice.toFixed(2)}</TableCell>
        <TableCell>{totalsRef.current.uniqueColors}</TableCell>
        <TableCell>{totalsRef.current.uniqueSizes}</TableCell>
        <TableCell>{totalsRef.current.totalQuantity}</TableCell>
        <TableCell>
          {isToggling ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Switch
              checked={product.isPublished}
              onCheckedChange={handleToggle}
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
  }
);
ProductTableRow.displayName = "ProductTableRow";

type FilterState = {
  searchTerm: string;
  filterPublished: "all" | "published" | "unpublished";
  sortField: keyof TableProduct;
  sortDirection: "asc" | "desc";
  currentPage: number;
};

export default function ProductTable({
  products,
  collectionName,
  onTogglePublish,
  onDelete,
  onEdit,
  onView,
}: ProductTableProps) {
  const itemsPerPage = useRef(6);
  const loadingTogglesRef = useRef(new Set<string>());
  const loadingDeletesRef = useRef(new Set<string>());
  const [updateCount, setUpdateCount] = useState(0);

  const [filters, setFilters] = useState<FilterState>({
    searchTerm: "",
    filterPublished: "all",
    sortField: "createdAt",
    sortDirection: "desc",
    currentPage: 1,
  });

  // Handlers
  const handleTogglePublish = useCallback(
    async (id: string) => {
      loadingTogglesRef.current.add(id);
      setUpdateCount(c => c + 1);

      try {
        await onTogglePublish(id);
      } finally {
        loadingTogglesRef.current.delete(id);
        setUpdateCount(c => c + 1);
      }
    },
    [onTogglePublish]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      loadingDeletesRef.current.add(id);
      setUpdateCount(c => c + 1);

      try {
        await onDelete(id);
      } finally {
        loadingDeletesRef.current.delete(id);
        setUpdateCount(c => c + 1);
      }
    },
    [onDelete]
  );

  const handleSearchChange = useCallback((term: string) => {
    setFilters(prev => ({
      ...prev,
      searchTerm: term,
      currentPage: 1,
    }));
  }, []);

  const handleFilterChange = useCallback(
    (value: FilterState["filterPublished"]) => {
      setFilters(prev => ({
        ...prev,
        filterPublished: value,
        currentPage: 1,
      }));
    },
    []
  );

  const handleSort = useCallback((field: keyof TableProduct) => {
    setFilters(prev => ({
      ...prev,
      sortField: field,
      sortDirection:
        prev.sortField === field && prev.sortDirection === "asc"
          ? "desc"
          : "asc",
      currentPage: 1,
    }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters(prev => ({
      ...prev,
      currentPage: page,
    }));
  }, []);

  // Memoized computations
  const computedData = useMemo(() => {
    const filtered = filterProducts(
      products,
      filters.searchTerm,
      filters.filterPublished
    );
    const sorted = sortProducts(
      filtered,
      filters.sortField,
      filters.sortDirection
    );
    const totalPages = Math.ceil(sorted.length / itemsPerPage.current);
    const startIndex = (filters.currentPage - 1) * itemsPerPage.current;
    const endIndex = Math.min(startIndex + itemsPerPage.current, sorted.length);

    return {
      filteredProducts: filtered,
      sortedProducts: sorted,
      paginationInfo: {
        totalPages,
        startIndex,
        endIndex,
        paginatedProducts: sorted.slice(startIndex, endIndex),
      },
    };
  }, [products, filters]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <TableTitle title={collectionName} />
        <TableFilters
          searchTerm={filters.searchTerm}
          onSearchChange={handleSearchChange}
          filterPublished={filters.filterPublished}
          onFilterChange={handleFilterChange}
        />
      </div>

      <div className="border rounded-md m-8 shadow-2xl shadow-black">
        <Table>
          <ProductTableHeader
            sortField={filters.sortField}
            sortDirection={filters.sortDirection}
            onSort={handleSort}
          />
          <TableBody>
            {computedData.paginationInfo.paginatedProducts.map(product => (
              <ProductTableRow
                key={product.id}
                product={product}
                isToggling={loadingTogglesRef.current.has(product.id)}
                isDeleting={loadingDeletesRef.current.has(product.id)}
                onTogglePublish={handleTogglePublish}
                onView={onView}
                onEdit={onEdit}
                onDelete={handleDelete}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      <TablePagination
        currentPage={filters.currentPage}
        totalPages={computedData.paginationInfo.totalPages}
        startIndex={computedData.paginationInfo.startIndex}
        endIndex={computedData.paginationInfo.endIndex}
        totalItems={computedData.sortedProducts.length}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
