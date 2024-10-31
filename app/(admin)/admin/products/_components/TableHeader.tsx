"use client";

import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronUp, ChevronDown } from "lucide-react";
import { TableProduct } from "../_types/table";

interface TableHeaderProps {
  sortField: keyof TableProduct;
  sortDirection: "asc" | "desc";
  onSort: (field: keyof TableProduct) => void;
}

export function ProductTableHeader({
  sortField,
  sortDirection,
  onSort,
}: TableHeaderProps) {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Image</TableHead>
        <TableHead
          className="cursor-pointer"
          onClick={() => onSort("productName")}
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
          onClick={() => onSort("sellingPrice")}
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
  );
}
