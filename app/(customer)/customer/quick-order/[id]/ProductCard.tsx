"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import AddToCart from "./AddToCart";

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    inStock: boolean;
    attribute1Values: string | null;
    attribute2Values: string | null;
    regularPrice: number | null;
    imageUrl: string;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [selectedAttr1, setSelectedAttr1] = useState<string>("");
  const [selectedAttr2, setSelectedAttr2] = useState<string>("");
  const [availableStock, setAvailableStock] = useState<number>(5); // Set initial stock to 5
  const [selectedQuantity, setSelectedQuantity] = useState<string>("1");

  const attr1Values = product.attribute1Values
    ? product.attribute1Values.split(",").map(s => s.trim())
    : [];
  const attr2Values = product.attribute2Values
    ? product.attribute2Values.split(",").map(s => s.trim())
    : [];

  useEffect(() => {
    if (attr1Values.length > 0) setSelectedAttr1(attr1Values[0]);
    if (attr2Values.length > 0) setSelectedAttr2(attr2Values[0]);
  }, []);

  // Remove the useEffect that was randomly setting the stock

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
        <Badge variant={product.inStock ? "default" : "destructive"}>
          {product.inStock ? "In Stock" : "Out of Stock"}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="aspect-square relative w-full mb-4">
          <Image
            src={product.imageUrl}
            alt={product.name}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="space-y-2">
          {attr1Values.length > 0 && (
            <Select onValueChange={value => setSelectedAttr1(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Attribute 1" />
              </SelectTrigger>
              <SelectContent>
                {attr1Values.map(attr => (
                  <SelectItem key={attr} value={attr}>
                    {attr}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {attr2Values.length > 0 && (
            <Select onValueChange={value => setSelectedAttr2(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Attribute 2" />
              </SelectTrigger>
              <SelectContent>
                {attr2Values.map(attr => (
                  <SelectItem key={attr} value={attr}>
                    {attr}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <p>Available Stock: {availableStock}</p>
          <Select onValueChange={value => setSelectedQuantity(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Quantity" />
            </SelectTrigger>
            <SelectContent>
              {[...Array(availableStock)].map((_, i) => (
                <SelectItem key={i + 1} value={(i + 1).toString()}>
                  {i + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-2xl font-bold">
            ${product.regularPrice?.toFixed(2) ?? "N/A"}
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <AddToCart quantity={parseInt(selectedQuantity)} />
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
