"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TableFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterPublished: "all" | "published" | "unpublished";
  onFilterChange: (value: "all" | "published" | "unpublished") => void;
}

export function TableFilters({
  searchTerm,
  onSearchChange,
  filterPublished,
  onFilterChange,
}: TableFiltersProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Search className="w-4 h-4 text-gray-500" />
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={e => onSearchChange(e.target.value)}
          className="w-64"
        />
      </div>
      <Select value={filterPublished} onValueChange={onFilterChange}>
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
  );
}
