"use client";

import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronUp, ChevronDown } from "lucide-react";
import { TableVariation } from "../_types/table";

interface TableHeaderProps {
  sortField: keyof TableVariation;
  sortDirection: "asc" | "desc";
  onSort: (field: keyof TableVariation) => void;
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
        <TableHead className="cursor-pointer" onClick={() => onSort("color")}>
          Color{" "}
          {sortField === "color" &&
            (sortDirection === "asc" ? (
              <ChevronUp className="inline w-4 h-4" />
            ) : (
              <ChevronDown className="inline w-4 h-4" />
            ))}
        </TableHead>
        <TableHead className="cursor-pointer" onClick={() => onSort("size")}>
          Size{" "}
          {sortField === "size" &&
            (sortDirection === "asc" ? (
              <ChevronUp className="inline w-4 h-4" />
            ) : (
              <ChevronDown className="inline w-4 h-4" />
            ))}
        </TableHead>
        <TableHead>Stock</TableHead>
        <TableHead>Published</TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}
