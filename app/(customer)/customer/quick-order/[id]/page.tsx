import React from "react";
import ProductCard from "./ProductCard";
import prisma from "@/lib/prisma";

interface PageProps {
  params: { id: string };
}

async function getProduct(id: number) {
  const product = await prisma.product.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      inStock: true,
      attribute1Values: true,
      attribute2Values: true,
      regularPrice: true,
      imageUrl: true,
    },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
}

export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    select: { id: true },
  });

  return products.map(product => ({
    id: product.id.toString(),
  }));
}

const Page: React.FC<PageProps> = async ({ params }) => {
  const productId = Number(params.id);

  if (isNaN(productId)) {
    throw new Error("Invalid product ID");
  }

  const product = await getProduct(productId);

  return (
    <div>
      <ProductCard product={product} />
    </div>
  );
};

export default Page;
