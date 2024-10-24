// shopping/(product_categories)/summer/page.tsx
import React from "react";
import SummerCollectionPage from "./SummerLanding";
import prisma from "@/lib/prisma";

interface Product {
  id: string;
  name: string;
  imageUrl: string;
  stock: number;
}

async function fetchNewProducts() {
  const newProducts = await prisma.product.findMany({
    where: {
      AND: [
        {
          isPublished: true,
          category: {
            hasSome: ["new-products"],
          },
        },
      ],
    },
    select: {
      id: true,
      productName: true,
      featuredImage: {
        select: {
          medium: true,
          large: true,
        },
      },
      variations: {
        select: {
          quantity: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return newProducts.map(product => ({
    id: product.id,
    name: product.productName,
    imageUrl: `${product.featuredImage?.medium || ""},${product.featuredImage?.large || ""}`,
    stock: product.variations.reduce(
      (total, variation) => total + variation.quantity,
      0
    ),
  }));
}

export default async function SummerPage(): Promise<JSX.Element> {
  const newProducts = await fetchNewProducts();

  return (
    <div>
      <div className="bg-muted border-b border-border mb-6">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-foreground">
            Summer Collection
          </h1>
          <p className="text-muted-foreground mt-1">
            Discover our latest summer styles and seasonal favorites
          </p>
        </div>
      </div>
      <SummerCollectionPage />
    </div>
  );
}
