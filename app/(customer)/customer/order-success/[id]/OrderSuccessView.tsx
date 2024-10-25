"use client";

import React from "react";
import Link from "next/link";
import { format } from "date-fns";
import { CheckCircle2, Printer, ChevronRight } from "lucide-react";
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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Thank you for your order!
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Order #{order.id.slice(0, 8)}
          </p>
        </div>

        {/* Order Details Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
            <CardDescription>
              Placed on{" "}
              {format(new Date(order.createdAt), "MMMM dd, yyyy 'at' HH:mm")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Shipping Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Shipping Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Contact Information:</p>
                    <p>{`${order.firstName} ${order.lastName}`}</p>
                    <p>{order.email}</p>
                    <p>{order.phone}</p>
                  </div>
                  <div>
                    <p className="font-medium">Shipping Address:</p>
                    <p>{order.companyName}</p>
                    <p>{order.streetAddress}</p>
                    {order.apartmentSuite && <p>{order.apartmentSuite}</p>}
                    <p>{`${order.townCity}, ${order.province} ${order.postcode}`}</p>
                    <p>{order.countryRegion}</p>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Order Summary
                </h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Product
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                          Quantity
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                          Price
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {order.orderItems.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            <div>
                              <p className="font-medium">
                                {item.variation.product.productName}
                              </p>
                              <p className="text-gray-500">
                                {item.variation.size} / {item.variation.color}
                              </p>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-center text-gray-500">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-3 text-sm text-right text-gray-900">
                            R{(item.price * item.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td
                          colSpan={2}
                          className="px-4 py-3 text-sm font-medium text-right text-gray-900"
                        >
                          Total:
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-gray-900 font-bold">
                          R{order.totalAmount.toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm">
              <Printer className="mr-2 h-4 w-4" />
              Print Order
            </Button>
            <Button asChild>
              <Link href="/customer/orders">
                View All Orders
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Next Steps */}
        <div className="text-center text-sm text-gray-600">
          <p>
            A confirmation email has been sent to {order.email}. Please keep
            this for your records.
          </p>
          <p className="mt-2">
            You can track your order status in{" "}
            <Link
              href="/customer/orders"
              className="text-primary hover:text-primary/80 font-medium"
            >
              your orders
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
};
