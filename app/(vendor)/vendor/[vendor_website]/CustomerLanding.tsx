"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  FileText,
  MapPin,
  User,
  ShoppingCart,
  CreditCard,
  Truck,
  Camera,
  LayoutGrid,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { useSession } from "../../SessionProvider";
import { useParams } from "next/navigation";
import Header from "./_components/Header";

const CustomerLanding = () => {
  const { user } = useSession();
  const params = useParams();
  const vendorWebsite = params?.vendor_website as string;

  return (
    <div className="container mx-auto p-4 max-w-4xl bg-background">
      <Header />
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">
              Welcome {user.displayName}
            </h2>
            <p className="text-muted-foreground">
              Last login: Today at 10:30 AM
            </p>
          </div>
        </div>
      </div>

      <nav className="mb-5">
        <ul className="flex flex-wrap justify-between bg-card shadow-2xl shadow-black rounded-lg p-2">
          {[
            {
              icon: ShoppingCart,
              label: "Previous Orders",
              href: `/vendor/${vendorWebsite}/previous-orders`,
            },
            {
              icon: User,
              label: "Account Info",
              href: `/vendor/${vendorWebsite}/account-info`,
            },
            {
              icon: MapPin,
              label: "Address Info",
              href: `/vendor/${vendorWebsite}/address-info`,
            },
            {
              icon: CreditCard,
              label: "Price List",
              href: `/vendor/${vendorWebsite}/price-list`,
            },
            {
              icon: Camera,
              label: "Product Images",
              href: `/vendor/${vendorWebsite}/product-images`,
            },
          ].map(({ icon: Icon, label, href }) => (
            <li key={label}>
              <Link key={href} href={href}>
                <Button variant="ghost" className="flex items-center">
                  <Icon className="mr-2 h-4 w-4" />
                  {label}
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <Card className="mb-8 shadow-2xl shadow-black">
        <CardHeader>
          <CardTitle>Account Overview</CardTitle>
          <CardDescription>
            Manage your account details and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" asChild>
              <Link href={`/vendor/${vendorWebsite}/order-success`}>
                <FileText className="mr-2 h-4 w-4" />
                View Recent Order
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/vendor/${vendorWebsite}/address-info`}>
                <Truck className="mr-2 h-4 w-4" />
                Manage Addresses
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/vendor/${vendorWebsite}/account-info`}>
                <Settings className="mr-2 h-4 w-4" />
                Account Settings
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link
                href={`/vendor/${vendorWebsite}/shopping/product_categories/summer`}
              >
                <LayoutGrid className="mr-2 h-4 w-4" />
                Product Catalog
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8 bg-card shadow-2xl shadow-black">
        <CardHeader className="bg-accent">
          <CardTitle className="flex items-center text-accent-foreground">
            <Clock className="mr-2" /> Order Collection Time
          </CardTitle>
        </CardHeader>
        <CardContent className="mt-4">
          <div className="flex items-center text-lg space-x-2">
            <Truck className="text-green-500" />
            <span>Orders are to be collected</span>
            <Badge variant="outline" className="font-bold text-destructive">
              24 hours
            </Badge>
            <span>after payment received.</span>
          </div>

          <div className="space-y-2 mt-4">
            <div className="flex items-center">
              <Badge variant="secondary" className="mr-2">
                Note
              </Badge>
              <span className="text-muted-foreground">
                We do not offer a courier service.
              </span>
            </div>
            <div className="flex items-center">
              <Badge variant="secondary" className="mr-2">
                Note
              </Badge>
              <span className="text-muted-foreground">
                We do not offer any branding.
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <footer className="mt-8 text-center text-sm text-muted-foreground border-t border-border pt-4">
        <p>&copy; 2024 Your Company Name. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default CustomerLanding;