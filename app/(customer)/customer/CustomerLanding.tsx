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
  LogOut,
} from "lucide-react";

const CustomerLandingPage = () => {
  const session = useSession();

  if (session?.user.role !== "CUSTOMER") {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <Card className="w-96 shadow-lg">
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
    { title: "Previous Orders", icon: ShoppingBag },
    { title: "Account Info", icon: User },
    { title: "Address Info", icon: MapPin },
    { title: "View Price List", icon: FileText },
    { title: "Product Images", icon: Image },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 border-b-2 border-blue-500 pb-2">
          My Account
        </h1>
      </header>

      <main>
        <section className="mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white overflow-hidden">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-2">
                Instant Purchase Power
              </h2>
              <p className="mb-4">
                Unlock the Speed of Our Quick Order Page Today!
              </p>
              <Button className="bg-white text-blue-600 hover:bg-blue-100">
                Quick Order
              </Button>
            </CardContent>
          </Card>
        </section>

        <section className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {quickLinks.map((link, index) => (
              <Button
                key={index}
                variant="outline"
                className="flex flex-col items-center justify-center h-24 text-gray-700 hover:bg-blue-50 hover:border-blue-300 transition-all"
              >
                <link.icon className="w-6 h-6 mb-2" />
                <span className="text-sm">{link.title}</span>
              </Button>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <Card>
            <CardContent className="p-6">
              <p className="text-lg mb-4">
                Hello,{" "}
                <span className="font-semibold">
                  {session.user.displayName}
                </span>
                !
              </p>
              <p className="text-gray-600 mb-4">
                From your account dashboard you can view your recent orders,
                manage your shipping and billing addresses, and edit your
                password and account details.
              </p>
              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  className="text-blue-500 hover:bg-blue-50"
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Recent Orders
                </Button>
                <Button
                  variant="outline"
                  className="text-green-500 hover:bg-green-50"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Manage Addresses
                </Button>
                <Button
                  variant="outline"
                  className="text-purple-500 hover:bg-purple-50"
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
              <CardTitle className="flex items-center text-yellow-800">
                <Clock className="w-6 h-6 mr-2" />
                Important Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="font-semibold mb-4">
                Orders are to be collected{" "}
                <span className="text-red-500">24 hours</span> after payment is
                received.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>We do not offer a courier service.</li>
                <li>We do not offer any branding.</li>
              </ul>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="mt-8 text-center">
        <Button variant="ghost" className="text-gray-500 hover:text-red-500">
          <LogOut className="w-4 h-4 mr-2" />
          Log out
        </Button>
      </footer>
    </div>
  );
};

export default CustomerLandingPage;
