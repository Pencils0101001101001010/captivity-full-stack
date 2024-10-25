"use client";

import React from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
  CheckCircle2,
  Printer,
  ChevronRight,
  Package,
  Mail,
  Clock,
  Building,
  Phone,
  MapPin,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface OrderSuccessViewProps {
  order: {
    id: string;
    createdAt: string;
    totalAmount: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    companyName: string;
    streetAddress: string;
    apartmentSuite?: string;
    townCity: string;
    province: string;
    postcode: string;
    countryRegion: string;
    orderItems: Array<{
      quantity: number;
      price: number;
      variation: {
        size: string;
        color: string;
        product: {
          productName: string;
        };
      };
    }>;
  };
}

export const OrderSuccessView: React.FC<OrderSuccessViewProps> = ({
  order,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header with Animation */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-green-100 rounded-full animate-ping" />
              <CheckCircle2 className="relative h-20 w-20 text-green-500 animate-bounce" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Thank you for your order!
          </h1>
          <p className="text-lg text-gray-600">
            Order #{" "}
            <span className="font-mono font-medium">
              {order.id.slice(0, 8)}
            </span>
          </p>
        </div>

        {/* Order Status Timeline */}
        <div className="mb-8">
          <div className="relative">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-between">
              <div className="flex items-center space-x-2">
                <span className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </span>
                <span className="text-sm font-medium text-gray-900">
                  Order Placed
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <Package className="h-5 w-5 text-gray-400" />
                </span>
                <span className="text-sm font-medium text-gray-400">
                  Processing
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-gray-400" />
                </span>
                <span className="text-sm font-medium text-gray-400">Ready</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Details Card */}
        <Card className="mb-8 shadow-2xl shadow-black hover:shadow-2xl transition-shadow duration-300">
          <CardHeader className="border-b border-gray-100">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Order Details</CardTitle>
                <CardDescription className="flex items-center mt-1">
                  <Clock className="h-4 w-4 mr-1" />
                  {format(
                    new Date(order.createdAt),
                    "MMMM dd, yyyy 'at' HH:mm"
                  )}
                </CardDescription>
              </div>
              <div className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                Processing
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="space-y-8">
              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center text-gray-900">
                    <Building className="h-5 w-5 mr-2 text-gray-400" />
                    Customer Information
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">
                        {order.firstName} {order.lastName}
                      </span>
                    </p>
                    <p className="text-sm flex items-center text-gray-600">
                      <Mail className="h-4 w-4 mr-2" />
                      {order.email}
                    </p>
                    <p className="text-sm flex items-center text-gray-600">
                      <Phone className="h-4 w-4 mr-2" />
                      {order.phone}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center text-gray-900">
                    <MapPin className="h-5 w-5 mr-2 text-gray-400" />
                    Shipping Address
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <p className="text-sm font-medium">{order.companyName}</p>
                    <p className="text-sm text-gray-600">
                      {order.streetAddress}
                    </p>
                    {order.apartmentSuite && (
                      <p className="text-sm text-gray-600">
                        {order.apartmentSuite}
                      </p>
                    )}
                    <p className="text-sm text-gray-600">
                      {order.townCity}, {order.province} {order.postcode}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.countryRegion}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Package className="h-5 w-5 mr-2 text-gray-400" />
                  Order Summary
                </h3>
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Product
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Quantity
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {order.orderItems.map((item, index) => (
                          <tr
                            key={index}
                            className="hover:bg-gray-50 transition-colors duration-150"
                          >
                            <td className="px-6 py-4">
                              <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-900">
                                  {item.variation.product.productName}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {item.variation.size} / {item.variation.color}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-center text-gray-500">
                              {item.quantity}
                            </td>
                            <td className="px-6 py-4 text-sm text-right font-medium">
                              R{(item.price * item.quantity).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-gray-50">
                          <td
                            colSpan={2}
                            className="px-6 py-4 text-sm font-medium text-right"
                          >
                            Total Amount:
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="text-lg font-bold text-gray-900">
                              R{order.totalAmount.toFixed(2)}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="border-t border-gray-100 mt-6 flex justify-between items-center">
            <div className="flex space-x-3">
              <Button variant="outline" size="sm" className="shadow-sm">
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
              <Button variant="outline" size="sm" className="shadow-sm">
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </div>
            <Button asChild className="shadow-sm">
              <Link href="/customer/previous-orders">
                View All Orders
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Next Steps */}
        <div className="text-center space-y-4 mt-8 ">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 shadow-2xl shadow-black">
            <p className="text-sm text-blue-800">
              A confirmation email has been sent to{" "}
              <span className="font-medium">{order.email}</span>
            </p>
            <p className="text-sm text-blue-600 mt-2">
              You can track your order status in{" "}
              <Link
                href="/customer/previous-orders"
                className="font-medium underline hover:text-blue-800 transition-colors"
              >
                your orders
              </Link>
            </p>
          </div>

          <div className="flex justify-center space-x-6 text-sm">
            <Link
              href="/support"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Need Help?
            </Link>
            <Link
              href="/faq"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              FAQs
            </Link>
            <Link
              href="/returns"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Returns Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
