"use client";
import { useState, useCallback } from "react";
import { OrderStatus } from "@prisma/client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { VendorOrderResponse } from "./types";

type SuccessResponse = Extract<VendorOrderResponse, { success: true }>;

interface OrderDetailsProps {
  orderId: string;
  storeSlug: string;
  initialData: SuccessResponse;
  updateOrderStatus: (
    orderId: string,
    newStatus: OrderStatus
  ) => Promise<VendorOrderResponse>;
}

const StatusBadge = ({ status }: { status: OrderStatus }) => {
  const colorMap = {
    PENDING: "bg-yellow-100 text-yellow-800",
    PROCESSING: "bg-blue-100 text-blue-800",
    SHIPPED: "bg-purple-100 text-purple-800",
    DELIVERED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
    REFUNDED: "bg-gray-100 text-gray-800",
  };

  return (
    <Badge className={`${colorMap[status]} hover:${colorMap[status]}`}>
      {status}
    </Badge>
  );
};

export default function OrderDetails({
  orderId,
  storeSlug,
  initialData,
  updateOrderStatus,
}: OrderDetailsProps) {
  const [orderData, setOrderData] = useState<SuccessResponse>(initialData);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStatusUpdate = useCallback(
    async (newStatus: OrderStatus) => {
      if (isUpdating) return;

      try {
        setIsUpdating(true);
        setError(null);

        console.log("Updating order status:", { orderId, newStatus });

        const result = await updateOrderStatus(orderId, newStatus);

        if (result.success) {
          setOrderData(prev => ({
            ...prev,
            data: {
              ...prev.data,
              status: newStatus,
              updatedAt: new Date(),
            },
          }));
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to update order status"
        );
      } finally {
        setIsUpdating(false);
      }
    },
    [orderId, updateOrderStatus, isUpdating]
  );

  const order = orderData.data;
  if (!("vendorOrderItems" in order)) return null;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Order #{order.id.slice(-6)}</CardTitle>
          <StatusBadge status={order.status} />
        </div>
      </CardHeader>

      {error && (
        <Alert variant="destructive" className="mx-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">Customer Details</h3>
            <div className="space-y-1 text-sm">
              <p>
                Name: {order.firstName} {order.lastName}
              </p>
              <p>Email: {order.email}</p>
              <p>Phone: {order.phone}</p>
              <p>Company: {order.companyName}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Shipping Address</h3>
            <div className="space-y-1 text-sm">
              <p>{order.streetAddress}</p>
              {order.apartmentSuite && <p>{order.apartmentSuite}</p>}
              <p>
                {order.townCity}, {order.province}
              </p>
              <p>{order.postcode}</p>
              <p>{order.countryRegion}</p>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="font-semibold mb-4">Order Items</h3>
          <div className="space-y-4">
            {order.vendorOrderItems.map(item => (
              <div
                key={item.id}
                className="flex justify-between items-start p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium">
                    {item.vendorVariation.vendorProduct.productName}
                  </p>
                  <p className="text-sm text-gray-600">
                    SKU: {item.vendorVariation.sku} |{" "}
                    {item.vendorVariation.color} | {item.vendorVariation.size}
                  </p>
                </div>
                <div className="text-right">
                  <p>
                    ${item.price.toFixed(2)} × {item.quantity}
                  </p>
                  <p className="text-sm text-gray-600">
                    Total: ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-right">
            <p className="text-lg font-semibold">
              Total: ${order.totalAmount.toFixed(2)}
            </p>
          </div>
        </div>
      </CardContent>

      {order.user?.role === "VENDOR" && (
        <CardFooter className="flex flex-wrap gap-2 justify-end">
          {Object.values(OrderStatus).map(status => (
            <Button
              key={status}
              variant={order.status === status ? "outline" : "default"}
              onClick={() => handleStatusUpdate(status)}
              disabled={isUpdating || order.status === status}
              className="min-w-[120px]"
            >
              {status}
            </Button>
          ))}
        </CardFooter>
      )}
    </Card>
  );
}
