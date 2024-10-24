// OrderList.tsx
"use client";

import { Order } from "./types";
import { formatDate, getStatusColor } from "@/lib/utils";
import Link from "next/link";
import { OrderStatus } from "@prisma/client";

interface OrderHistoryProps {
  orders?: Order[];
  error?: string;
}

export function OrderHistory({ orders, error }: OrderHistoryProps) {
  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }

  if (!orders?.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-300 mb-4">No order has been made yet.</p>
        <Link
          href="/products"
          className="inline-block bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-md"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div key={order.id} className="bg-gray-800 rounded-lg p-6 shadow-sm">
          {/* Order Header */}
          <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
            <div>
              <h3 className="text-lg font-medium text-gray-200">
                Order #{order.referenceNumber || order.id.slice(-8)}
              </h3>
              <p className="text-sm text-gray-400">
                Placed on {formatDate(order.createdAt)}
              </p>
              <p className="text-sm text-gray-400">
                Collection Method: {order.methodOfCollection}
              </p>
              <p className="text-sm text-gray-400">
                Branch: {order.captivityBranch}
              </p>
              {order.salesRep && (
                <p className="text-sm text-gray-400">
                  Sales Rep: {order.salesRep}
                </p>
              )}
            </div>
            <div className="flex flex-col items-end">
              <span className="text-lg font-medium text-gray-200">
                R{order.totalAmount.toFixed(2)}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                  order.status
                )}`}
              >
                {order.status}
              </span>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="mb-4 text-sm text-gray-400">
            <p className="font-medium text-gray-300 mb-2">Delivery Address:</p>
            <p>
              {order.firstName} {order.lastName}
            </p>
            <p>{order.companyName}</p>
            <p>{order.streetAddress}</p>
            {order.apartmentSuite && <p>{order.apartmentSuite}</p>}
            <p>
              {order.townCity}, {order.province}
            </p>
            <p>{order.postcode}</p>
            <p>{order.countryRegion}</p>
            <p className="mt-2">Phone: {order.phone}</p>
            <p>Email: {order.email}</p>
          </div>

          {/* Order Items */}
          <div className="divide-y divide-gray-700">
            {order.orderItems.map((item) => (
              <div key={item.id} className="py-4 flex items-center gap-4">
                <div className="flex-shrink-0 w-20 h-20">
                  <img
                    src={item.variation.variationImageURL || "/placeholder.png"}
                    alt={item.variation.name}
                    className="w-full h-full object-cover rounded"
                  />
                </div>
                <div className="flex-grow">
                  <h4 className="text-gray-200">{item.variation.name}</h4>
                  <p className="text-sm text-gray-400">
                    {item.variation.color} / {item.variation.size}
                  </p>
                  <p className="text-sm text-gray-400">
                    SKU: {item.variation.sku}
                    {item.variation.sku2 && ` / ${item.variation.sku2}`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-gray-200">R{item.price.toFixed(2)}</p>
                  <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Notes */}
          {order.orderNotes && (
            <div className="mt-4 p-4 bg-gray-700/20 rounded-md">
              <p className="text-sm font-medium text-gray-300 mb-1">Order Notes:</p>
              <p className="text-sm text-gray-400">{order.orderNotes}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}