import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import SummerCollectionPage from "./SummerLanding";
import FilterSidebar from "./_components/FilterSidebar";
import SearchSection from "./_components/SearchSection";
import ProductCarousel from "./_components/ProductCarousel";
import prisma from "@/lib/prisma";

interface PageProps {
  newProducts: {
    id: string;
    name: string;
    imageUrl: string;
    stock: number;
  }[];
}

// This is a server component
export async function generateStaticParams() {
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

  return {
    props: {
      newProducts: newProducts.map(product => ({
        id: product.id,
        name: product.productName,
        imageUrl: `${product.featuredImage?.medium || ""},${product.featuredImage?.large || ""}`,
        stock: product.variations.reduce(
          (total, variation) => total + variation.quantity,
          0
        ),
      })),
    },
  };
}

export default async function SummerPage() {
  const { props } = await generateStaticParams();
  const { newProducts } = props;

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header Section */}
      <div className="bg-muted border-b border-border">
        <div className="container mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-muted-foreground mb-4">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <Link
              href="/collections"
              className="hover:text-primary transition-colors"
            >
              Collections
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-foreground font-medium">
              Summer Collection
            </span>
          </div>

          {/* Page Title */}
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Summer Collection
              </h1>
              <p className="text-muted-foreground mt-1">
                Discover our latest summer styles and seasonal favorites
              </p>
            </div>
            <div className="text-right text-muted-foreground">
              <p className="text-sm">Season: Summer 2024</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Column */}
          <div className="w-full lg:w-[300px] lg:flex-shrink-0">
            {/* Search - Desktop Only */}
            <div className="hidden lg:block mb-6">
              <SearchSection />
            </div>

            {/* Filters */}
            <FilterSidebar />

            {/* New Products Carousel */}
            {newProducts.length > 0 && (
              <div className="mt-14">
                <ProductCarousel
                  products={newProducts}
                  className="bg-card rounded-lg shadow-2xl shadow-black"
                />
              </div>
            )}
          </div>

          {/* Main Content Column */}
          <div className="flex-1">
            {/* Search - Mobile Only */}
            <div className="lg:hidden mb-6">
              <SearchSection />
            </div>

            {/* Collection Grid */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-4xl font-semibold text-foreground">
                  Summer Collection
                </h2>
              </div>
              <SummerCollectionPage />
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-muted mt-16 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Stay Updated
            </h2>
            <p className="text-muted-foreground mb-6">
              Subscribe to our newsletter for exclusive summer collection
              updates and special offers.
            </p>
            <div className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-md border border-border bg-background"
              />
              <button className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
