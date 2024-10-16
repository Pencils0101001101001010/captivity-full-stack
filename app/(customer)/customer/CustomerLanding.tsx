"use client";
import React from "react";
import { useSession } from "../SessionProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Clock,
  ShoppingBag,
  User,
  MapPin,
  FileText,
  Image,
} from "lucide-react";
import LinkButton from "./PagesLinkButton";

const CustomerLandingPage = () => {
  const session = useSession();

  if (session?.user.role !== "CUSTOMER") {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <Card className="w-full max-w-sm mx-4 shadow-lg">
          <CardHeader className="bg-red-500 text-white">
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center py-4">This page is for customers only.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const quickLinks = [
    {
      title: "Previous Orders",
      icon: ShoppingBag,
      href: "/customer/previous-orders",
    },
    { title: "Account Info", icon: User, href: "/customer/account-info" },
    { title: "Address Info", icon: MapPin, href: "/customer/address-info" },
    {
      title: "View Price List",
      icon: FileText,
      href: "/customer/view-price-list",
    },
    { title: "Product Images", icon: Image, href: "/customer/product-images" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
      <header className="mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 border-b-2 border-blue-500 pb-2">
          My Account
        </h1>
      </header>

      <main>
        <section className="mb-6 sm:mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white overflow-hidden">
            <CardContent className="p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-2">
                Instant Purchase Power
              </h2>
              <p className="mb-4 text-sm sm:text-base">
                Unlock the Speed of Our Quick Order Page Today!
              </p>
              <LinkButton
                href="/customer/shopping/products"
                variant="outline"
                className="bg-white text-blue-600 hover:bg-blue-100 text-sm sm:text-base"
              >
                Quick Order
              </LinkButton>
            </CardContent>
          </Card>
        </section>

        <section className="mb-6 sm:mb-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4">
            {quickLinks.map((link, index) => (
              <LinkButton
                key={index}
                href={link.href}
                icon={link.icon}
                variant="outline"
                className="flex flex-col items-center justify-center h-20 sm:h-24 text-gray-700 hover:bg-blue-50 hover:border-blue-300 transition-all"
              >
                <span className="text-xs sm:text-sm text-center">
                  {link.title}
                </span>
              </LinkButton>
            ))}
          </div>
        </section>

        <section className="mb-6 sm:mb-8">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <p className="text-base sm:text-lg mb-3 sm:mb-4">
                Hello,{" "}
                <span className="font-semibold">
                  {session.user.displayName}
                </span>
                !
              </p>
              <p className="text-sm sm:text-base text-gray-600 mb-4">
                From your account dashboard you can view your recent orders,
                manage your shipping and billing addresses, and edit your
                password and account details.
              </p>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <Button
                  variant="outline"
                  className="text-blue-500 hover:bg-blue-50 text-sm sm:text-base"
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Recent Orders
                </Button>
                <Button
                  variant="outline"
                  className="text-green-500 hover:bg-green-50 text-sm sm:text-base"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Manage Addresses
                </Button>
                <Button
                  variant="outline"
                  className="text-purple-500 hover:bg-purple-50 text-sm sm:text-base"
                >
                  <User className="w-4 h-4 mr-2" />
                  Account Details
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <Card>
            <CardHeader className="bg-yellow-100">
              <CardTitle className="flex items-center text-yellow-800 text-base sm:text-lg">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                Important Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <p className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">
                Orders are to be collected{" "}
                <span className="text-red-500">24 hours</span> after payment is
                received.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 sm:space-y-2 text-sm sm:text-base">
                <li>We do not offer a courier service.</li>
                <li>We do not offer any branding.</li>
              </ul>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default CustomerLandingPage;
