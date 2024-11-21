// app/vendor/[vendor_website]/layout.tsx
import type { Metadata } from "next";
import { validateRequest } from "@/auth";
import React from "react";
import Footer from "./_components/Footer";

interface LayoutProps {
  children: React.ReactNode;
  params: {
    vendor_website: string;
  };
}

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
    <>
      <div className="max-w-[1903px] mx-auto px-4">{children}</div>
      {/* <Footer /> */}
    </>
  );
}
