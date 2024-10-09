import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface ProductVariant {
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
  categoryProducts: ProductVariant[];
  attribute1Name?: string | null;
  attribute2Name?: string | null;
}

export default function ProductDetailsModal({
  categoryProducts,
  attribute1Name = "Color",
  attribute2Name = "Size",
}: ProductDetailsModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="ml-2">
          View All Variants
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Product Variants</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[500px] w-full rounded-md border p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>SKU</TableHead>
                {attribute1Name && <TableHead>{attribute1Name}</TableHead>}
                {attribute2Name && <TableHead>{attribute2Name}</TableHead>}
                <TableHead>Stock</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categoryProducts.map(product => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.sku}</TableCell>
                  {attribute1Name && (
                    <TableCell>{product.attribute1Default || "-"}</TableCell>
                  )}
                  {attribute2Name && (
                    <TableCell>{product.attribute2Default || "-"}</TableCell>
                  )}
                  <TableCell>
                    {product.stock !== null ? product.stock : "N/A"}
                  </TableCell>
                  <TableCell>
                    {product.regularPrice
                      ? `R${product.regularPrice.toFixed(2)}`
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={product.inStock ? "default" : "secondary"}>
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
