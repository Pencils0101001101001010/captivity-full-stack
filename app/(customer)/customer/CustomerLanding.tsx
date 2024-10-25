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
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { getOrder } from "./shopping/checkout/actions";

const LandingPage = () => {
  const [latestOrderId, setLatestOrderId] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestOrder = async () => {
      try {
        const result = await getOrder();
        if (result.success && result.data) {
          setLatestOrderId(result.data.id);
        }
      } catch (error) {
        console.error("Error fetching latest order:", error);
      }
    };

    fetchLatestOrder();
  }, []);

  return (
    <div className="container mx-auto p-4 max-w-4xl bg-gray-50">
      <header className="text-center mb-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-2">Instant Purchase Power</h1>
        <p className="text-xl mb-4">
          Unlock the Speed of Our Quick Order Page Today!
        </p>
        <Button
          asChild
          className="mt-2 bg-green-500 hover:bg-green-600 text-white"
        >
          <Link href={"/customer/shopping/product_categories/summer"}>
            Quick Order
          </Link>
        </Button>
      </header>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div>
            <h2 className="text-2xl font-semibold">Welcome, Jaco!</h2>
            <p className="text-gray-600">Last login: Today at 10:30 AM</p>
          </div>
        </div>
        <Button variant="outline">
          <LogOut className="mr-2 h-4 w-4" /> Log out
        </Button>
      </div>

      <nav className="mb-8">
        <ul className="flex flex-wrap justify-between bg-white shadow-md rounded-lg p-2">
          {[
            {
              icon: ShoppingCart,
              label: "Previous Orders",
              href: "/customer/previous-orders",
            },
            {
              icon: User,
              label: "Account Info",
              href: "/customer/account-info",
            },
            {
              icon: MapPin,
              label: "Address Info",
              href: "/customer/address-info",
            },
            {
              icon: CreditCard,
              label: "Price List",
              href: "/customer/price-list",
            },
            {
              icon: Camera,
              label: "Product Images",
              href: "/customer/product-images",
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

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Account Overview</CardTitle>
          <CardDescription>
            Manage your account details and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" asChild>
              <Link
                href={
                  latestOrderId
                    ? `/customer/order-success/${latestOrderId}`
                    : "/customer/orders"
                }
              >
                <FileText className="mr-2 h-4 w-4" />
                View Recent Order
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/customer/address-info">
                <Truck className="mr-2 h-4 w-4" />
                Manage Addresses
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/customer/account-info">
                <Settings className="mr-2 h-4 w-4" />
                Account Settings
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/customer/shopping/product_categories/summer">
                <LayoutGrid className="mr-2 h-4 w-4" />
                Product Catalog
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8 bg-white shadow-md">
        <CardHeader className="bg-blue-50">
          <CardTitle className="flex items-center text-blue-700">
            <Clock className="mr-2" /> Order Collection Time
          </CardTitle>
        </CardHeader>
        <CardContent className="mt-4">
          <p className="text-lg flex items-center">
            <Truck className="mr-2 text-green-500" />
            Orders are to be collected{" "}
            <Badge variant="outline" className="ml-2 text-red-500 font-bold">
              24 hours
            </Badge>{" "}
            after payment received.
          </p>
          <ul className="list-none mt-4">
            <li className="flex items-center mt-2">
              <Badge variant="secondary" className="mr-2">
                Note
              </Badge>
              We do not offer a courier service.
            </li>
            <li className="flex items-center mt-2">
              <Badge variant="secondary" className="mr-2">
                Note
              </Badge>
              We do not offer any branding.
            </li>
          </ul>
        </CardContent>
      </Card>

      <footer className="mt-8 text-center text-sm text-gray-500 border-t pt-4">
        <p>&copy; 2024 Your Company Name. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
