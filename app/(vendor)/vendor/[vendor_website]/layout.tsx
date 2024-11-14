// app/vendor/[vendor_website]/layout.tsx
import type { Metadata } from "next";
import SessionProvider from "@/app/(vendor)/SessionProvider";
import { validateRequest } from "@/auth";
import React from "react";
import CarouselPlugin from "./welcome/CarouselPlugin";

interface LayoutProps {
  children: React.ReactNode;
  params: {
    vendor_website: string;
  };
}

// Generate metadata for the page
export async function generateMetadata({
  params,
}: LayoutProps): Promise<Metadata> {
  const vendorWebsite = params.vendor_website;

  return {
    title: `${vendorWebsite} Store`,
    description: `Welcome to ${vendorWebsite}'s store`,
  };
}

export default async function VendorWebsiteLayout({
  children,
  params,
}: LayoutProps) {
  const session = await validateRequest();

  return (
    <SessionProvider value={{ user: session?.user || null }}>
      <div className="min-h-screen flex flex-col bg-white">
        <main className="flex-grow">
          <div className="max-w-[1903px] mx-auto">
            <div className="my-4">
              <CarouselPlugin />
            </div>
            {children}
          </div>
        </main>
      </div>
    </SessionProvider>
  );
}
