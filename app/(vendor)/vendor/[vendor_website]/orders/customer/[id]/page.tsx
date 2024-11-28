import { Card } from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getVendorOrderById, updateOrderStatus } from "./actions";
import OrderDetails from "./OrderDetails";
import { OrderStatus } from "@prisma/client";
import { VendorOrderResponse } from "./types";

interface OrderDetailsPageProps {
  params: {
    id: string;
    vendor_website: string;
  };
}

export default async function OrderDetailsPage({
  params,
}: OrderDetailsPageProps) {
  const { id, vendor_website } = params;

  if (!id || !vendor_website) {
    return notFound();
  }

  const vendor = await prisma.user.findFirst({
    where: {
      storeSlug: vendor_website,
      role: "VENDOR",
    },
  });

  if (!vendor) {
    return (
      <div className="container mx-auto p-6">
        <Card className="max-w-4xl mx-auto p-6">
          <h1 className="text-xl font-semibold text-red-600 mb-2">
            Store Not Found
          </h1>
          <p className="text-gray-600">
            Sorry, the store you are looking for does not exist or may have been
            removed.
          </p>
        </Card>
      </div>
    );
  }

  const orderData = await getVendorOrderById(id);

  if (!orderData.success) {
    return (
      <div className="container mx-auto p-6">
        <Card className="max-w-4xl mx-auto p-6">
          <h1 className="text-xl font-semibold text-red-600 mb-2">
            Error Loading Order
          </h1>
          <p className="text-gray-600">{orderData.error}</p>
        </Card>
      </div>
    );
  }

  async function handleStatusUpdate(orderId: string, newStatus: OrderStatus) {
    "use server";
    await updateOrderStatus(orderId, newStatus);
  }

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        <OrderDetails
          order={orderData.data}
          storeSlug={vendor_website}
          onUpdateStatus={handleStatusUpdate}
        />
      </div>
    </div>
  );
}
