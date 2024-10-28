import React from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HomeIcon, TruckIcon } from "lucide-react";
import BackToCustomerPage from "../_components/BackToCustomerButton";

const AddressSelectionPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-20">
      <header className="text-center mb-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-2">Instant Purchase Power</h1>
        <p className="text-xl mb-4">
          Unlock the Speed of Our Quick Order Page Today!
        </p>
        <Button
          asChild
          className="mt-2 bg-green-500 hover:bg-green-600 text-white"
        >
          <Link href={"/customer/shopping/express"}>Quick Order</Link>
        </Button>
      </header>
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between mb-7">
          <span>
            <h1 className="text-2xl font-semibold text-gray-700  ">
              Address Info
            </h1>
          </span>

          <span className="p-2 hover:bg-neutral-100">
            <BackToCustomerPage />
          </span>
        </div>
        <p className="mb-8 text-sm text-gray-500">
          The following addresses will be used on the checkout page by default.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-2 border-dashed">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HomeIcon className="h-5 w-5" />
                Billing Address
              </CardTitle>
              <CardDescription>Manage your billing information</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="default" className="w-full">
                <Link href="/customer/address-info/billing-address">
                  Add Billing Address
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 border-dashed">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TruckIcon className="h-5 w-5" />
                Shipping Address
              </CardTitle>
              <CardDescription>
                Manage your shipping information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="default" className="w-full">
                <Link href="/customer/address-info/shipping-address">
                  Add Shipping Address
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddressSelectionPage;
