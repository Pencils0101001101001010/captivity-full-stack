// app/(vendor)/vendor/[vendor_website]/orders/_components/OrderTable.tsx
"use client";

import React, { useEffect, useCallback } from "react";
import { useSession } from "@/app/(vendor)/SessionProvider";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format, subWeeks } from "date-fns";
import { VendorOrder } from "../../shop_product/checkout/_lib/types";
import useVendorOrderStore, { PriceRange } from "../_store/useOrderStore";

const getStatusColor = (status: string): string => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    case "PROCESSING":
      return "bg-blue-100 text-blue-800";
    case "SHIPPED":
      return "bg-green-100 text-green-800";
    case "DELIVERED":
      return "bg-green-500 text-white";
    case "CANCELLED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

type TimeFilter = "all" | "recent" | "old";

const OrderTable: React.FC = () => {
  const session = useSession();
  const params = useParams();
  const vendorWebsite = params?.vendor_website as string;
  const [timeFilter, setTimeFilter] = React.useState<TimeFilter>("all");

  const {
    currentOrder,
    filteredOrders,
    loading,
    error,
    selectedPriceRange,
    fetchOrder,
    filterByPriceRange,
    getOrdersByAge,
  } = useVendorOrderStore();

  const initializeTable = useCallback(async () => {
    await fetchOrder();
  }, [fetchOrder]);

  const initializeFilter = useCallback(() => {
    if (currentOrder && !selectedPriceRange) {
      filterByPriceRange("less_than_twoK");
    }
  }, [currentOrder, filterByPriceRange, selectedPriceRange]);

  useEffect(() => {
    initializeTable();
  }, [initializeTable]);

  useEffect(() => {
    initializeFilter();
  }, [initializeFilter]);

  // If not authenticated or not a vendor, don't render the table
  if (!session || session?.user?.role !== "VENDOR") {
    return null;
  }

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  const { oldOrders, recentOrders } = getOrdersByAge();
  let displayOrders = filteredOrders.length > 0 ? filteredOrders : [];

  // Apply time filter
  switch (timeFilter) {
    case "recent":
      displayOrders = displayOrders.filter(
        order => new Date(order.createdAt) > subWeeks(new Date(), 1)
      );
      break;
    case "old":
      displayOrders = displayOrders.filter(
        order => new Date(order.createdAt) <= subWeeks(new Date(), 1)
      );
      break;
    // 'all' shows everything
  }

  if (!currentOrder) {
    return <div className="text-gray-500 p-4">No orders found</div>;
  }

  return (
    <div className="space-y-6">
      {/* Old Orders Warning */}
      {oldOrders.length > 0 && timeFilter !== "old" && (
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            You have {oldOrders.length} orders that are older than one week
          </AlertDescription>
        </Alert>
      )}

      {/* Time Filter Tabs */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <Tabs
          defaultValue="all"
          value={timeFilter}
          className="w-full mb-4"
          onValueChange={value => setTimeFilter(value as TimeFilter)}
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="recent">
              Recent ({recentOrders.length})
            </TabsTrigger>
            <TabsTrigger value="old">
              Older than 1 Week ({oldOrders.length})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Price Range Tabs */}
        <Tabs
          defaultValue="less_than_twoK"
          value={selectedPriceRange || "less_than_twoK"}
          className="w-full"
          onValueChange={value => filterByPriceRange(value as PriceRange)}
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="less_than_twoK">Less than R2K</TabsTrigger>
            <TabsTrigger value="two_to_fiveK">R2K - R5K</TabsTrigger>
            <TabsTrigger value="greater_than_fiveK">Above R5K</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Orders Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Collection Method</TableHead>
              <TableHead>Branch</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayOrders.map((order: VendorOrder) => (
              <TableRow key={order.id}>
                <TableCell>
                  <Link
                    href={`/vendor/${vendorWebsite}/orders/customer/${order.id}`}
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    {order.id}
                  </Link>
                </TableCell>
                <TableCell>
                  {format(new Date(order.createdAt), "MMM dd, yyyy")}
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p className="font-medium">{`${order.firstName} ${order.lastName}`}</p>
                    <p className="text-sm text-gray-500">{order.companyName}</p>
                  </div>
                </TableCell>
                <TableCell>{order.vendorOrderItems.length}</TableCell>
                <TableCell>R{order.totalAmount.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>{order.methodOfCollection}</TableCell>
                <TableCell>{order.vendorBranch}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* No Results Message */}
      {displayOrders.length === 0 && (
        <div className="text-center py-6 text-gray-500">
          No orders found for the selected filters
        </div>
      )}
    </div>
  );
};

export default OrderTable;
