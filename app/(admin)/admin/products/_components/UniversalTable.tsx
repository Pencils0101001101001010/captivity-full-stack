"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCollectionsStore } from "../useCollectionsStore";

interface FeaturedImage {
  thumbnail: string;
  medium: string;
  large: string;
}

interface Product {
  id: string;
  productName: string;
  category: string[];
  description: string;
  sellingPrice: number;
  isPublished: boolean;
  featuredImage?: FeaturedImage | null;
}

type ProductTableProps = {
  products: Product[];
  isLoading?: boolean;
};

export function ProductTable({
  products,
  isLoading = false,
}: ProductTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [publishFilter, setPublishFilter] = useState<
    "all" | "published" | "unpublished"
  >("all");
  const { toggleProductStatus } = useCollectionsStore();

  // Items per page
  const ITEMS_PER_PAGE = 8;

  // Enhanced search function that checks all searchable fields
  const searchProduct = (product: Product, query: string) => {
    const searchTerm = query.toLowerCase().trim();

    // If search is empty, return true to show all products
    if (!searchTerm) return true;

    // Array of all searchable values
    const searchableValues = [
      product.productName,
      product.id,
      product.sellingPrice.toString(),
      product.isPublished ? "published" : "unpublished",
      // Add any additional fields you want to search through
    ];

    // Return true if any value includes the search term
    return searchableValues.some(value =>
      value.toLowerCase().includes(searchTerm)
    );
  };

  // Filter products based on search query and publish status
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = searchProduct(product, searchQuery);

      const matchesPublishFilter =
        publishFilter === "all" ||
        (publishFilter === "published" && product.isPublished) ||
        (publishFilter === "unpublished" && !product.isPublished);

      return matchesSearch && matchesPublishFilter;
    });
  }, [products, searchQuery, publishFilter]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  // Reset to first page when search query changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle publish toggle
  const handlePublishToggle = async (productId: string) => {
    await toggleProductStatus(productId);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search all fields..."
            value={searchQuery}
            onChange={e => handleSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>

        {/* Publish Filter */}
        <Select
          value={publishFilter}
          onValueChange={(value: "all" | "published" | "unpublished") =>
            setPublishFilter(value)
          }
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Products</SelectItem>
            <SelectItem value="published">Published Only</SelectItem>
            <SelectItem value="unpublished">Unpublished Only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Product Id</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : paginatedProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No products found
                </TableCell>
              </TableRow>
            ) : (
              paginatedProducts.map(product => (
                <TableRow key={product.id}>
                  <TableCell>
                    {product.featuredImage &&
                    product.featuredImage.thumbnail ? (
                      <div className="relative h-12 w-12">
                        <Image
                          src={product.featuredImage.thumbnail}
                          alt={product.productName}
                          fill
                          className="rounded-md object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted">
                        <ImageIcon className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    {product.productName}
                  </TableCell>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>R{product.sellingPrice.toFixed(2)}</TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "rounded-full px-2 py-1 text-xs font-semibold",
                        product.isPublished
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      )}
                    >
                      {product.isPublished ? "Published" : "Unpublished"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Switch
                      checked={product.isPublished}
                      onCheckedChange={() => handlePublishToggle(product.id)}
                      aria-label="Toggle publish status"
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
