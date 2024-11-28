"use client";

import React, { useEffect } from "react";
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
import {
  AlertTriangle,
  ArrowUpDown,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { VendorOrder } from "../../shop_product/checkout/_lib/types";
import useVendorOrderStore, {
  PriceRange,
  TimeFilter,
  StatusFilter,
  CustomerTypeFilter,
  SortField,
  SortDirection,
} from "../_store/useOrderStore";
import { OrderStatus } from "@prisma/client";

const PAGE_SIZES = [10, 20, 50, 100];

const getStatusColor = (status: string): string => {
  const colors = {
    PENDING:
      "bg-[#FEF3C7] text-[#92400E] dark:bg-[#78350F] dark:text-[#FEF3C7]",
    PROCESSING:
      "bg-[#DBEAFE] text-[#1E40AF] dark:bg-[#1E3A8A] dark:text-[#DBEAFE]",
    SHIPPED:
      "bg-[#D1FAE5] text-[#065F46] dark:bg-[#064E3B] dark:text-[#D1FAE5]",
    DELIVERED: "bg-[#6EE7B7] text-[#064E3B] dark:bg-[#059669] dark:text-white",
    CANCELLED:
      "bg-[#FEE2E2] text-[#991B1B] dark:bg-[#7F1D1D] dark:text-[#FEE2E2]",
    REFUNDED:
      "bg-[#E5E7EB] text-[#1F2937] dark:bg-[#374151] dark:text-[#E5E7EB]",
  };
  return (
    colors[status as keyof typeof colors] || "bg-muted text-muted-foreground"
  );
};

const StatCard = ({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) => (
  <div className="bg-card p-4 rounded-lg shadow-sm border border-border">
    <div className="text-sm text-muted-foreground">{title}</div>
    <div className="text-xl sm:text-2xl font-semibold text-card-foreground">
      {value}
    </div>
  </div>
);

const OrdersTable = () => {
  const session = useSession();
  const params = useParams();
  const vendorWebsite = params?.vendor_website as string;

  const {
    currentOrders,
    filteredOrders,
    loading,
    error,
    selectedPriceRange,
    selectedTimeFilter,
    selectedStatus,
    selectedCustomerType,
    sortDirection,
    sortField,
    totalOrders,
    totalAmount,
    currentPage,
    itemsPerPage,
    totalPages,
    searchQuery,
    fetchOrders,
    filterOrders,
    sortOrders,
    searchOrders,
    setPage,
    setItemsPerPage,
    getOrdersByAge,
    getOrderStats,
  } = useVendorOrderStore();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (!session || session?.user?.role !== "VENDOR") {
    return null;
  }

  if (error) {
    return <div className="text-destructive p-4">{error}</div>;
  }

  const { oldOrders, recentOrders } = getOrdersByAge();
  const stats = getOrderStats();

  const handleSort = (field: SortField) => {
    const newDirection: SortDirection =
      field === sortField && sortDirection === "asc" ? "desc" : "asc";
    sortOrders(field, newDirection);
  };

  if (loading && !currentOrders.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-muted-foreground">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard title="Total Orders" value={totalOrders} />
        <StatCard title="Pending" value={stats.pending} />
        <StatCard title="Processing" value={stats.processing} />
        <StatCard title="Total Amount" value={`R${totalAmount.toFixed(2)}`} />
      </div>

      {/* Warning Alert */}
      {oldOrders.length > 0 && selectedTimeFilter !== "old" && (
        <Alert
          variant="destructive"
          className="bg-[#FFFBEB] dark:bg-[#78350F]/10 border-[#F59E0B] dark:border-[#F59E0B]/30"
        >
          <AlertTriangle className="h-4 w-4 text-[#D97706] dark:text-[#F59E0B]" />
          <AlertDescription className="text-[#92400E] dark:text-[#FCD34D]">
            You have {oldOrders.length} pending orders that are older than one
            week
          </AlertDescription>
        </Alert>
      )}

      {/* Filters Section */}
      <div className="bg-card p-4 rounded-lg shadow-sm border border-border space-y-4">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              value={searchQuery}
              onChange={e => searchOrders(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-4 flex-col sm:flex-row">
            <Select
              value={selectedStatus}
              onValueChange={value =>
                filterOrders(undefined, undefined, value as StatusFilter)
              }
            >
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {Object.values(OrderStatus).map(status => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedCustomerType}
              onValueChange={value =>
                filterOrders(
                  undefined,
                  undefined,
                  undefined,
                  value as CustomerTypeFilter
                )
              }
            >
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Customer Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="vendor">My Orders</SelectItem>
                <SelectItem value="customer">Customer Orders</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Time Filter */}
        <div className="overflow-x-auto">
          <Tabs
            value={selectedTimeFilter}
            onValueChange={value =>
              filterOrders(undefined, value as TimeFilter)
            }
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
        </div>

        {/* Price Range Filter */}
        <div className="overflow-x-auto">
          <Tabs
            value={selectedPriceRange}
            onValueChange={value => filterOrders(value as PriceRange)}
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="less_than_twoK">Less than R2K</TabsTrigger>
              <TabsTrigger value="two_to_fiveK">R2K - R5K</TabsTrigger>
              <TabsTrigger value="greater_than_fiveK">Above R5K</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-lg border border-border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[100px]">
                <button
                  onClick={() => handleSort("date")}
                  className="flex items-center space-x-1 hover:text-accent-foreground"
                >
                  <span>Order ID</span>
                  <ArrowUpDown className="h-4 w-4" />
                </button>
              </TableHead>
              <TableHead className="min-w-[120px]">Date</TableHead>
              <TableHead className="min-w-[200px]">Customer</TableHead>
              <TableHead className="min-w-[80px]">Items</TableHead>
              <TableHead className="min-w-[120px]">
                <button
                  onClick={() => handleSort("amount")}
                  className="flex items-center space-x-1 hover:text-accent-foreground"
                >
                  <span>Total Amount</span>
                  <ArrowUpDown className="h-4 w-4" />
                </button>
              </TableHead>
              <TableHead className="min-w-[120px]">
                <button
                  onClick={() => handleSort("status")}
                  className="flex items-center space-x-1 hover:text-accent-foreground"
                >
                  <span>Status</span>
                  <ArrowUpDown className="h-4 w-4" />
                </button>
              </TableHead>
              <TableHead className="min-w-[150px]">Collection Method</TableHead>
              <TableHead className="min-w-[120px]">Branch</TableHead>
              <TableHead className="min-w-[100px]">Order Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map(
              (
                order: VendorOrder & {
                  user?: { role: string; storeSlug: string | null };
                }
              ) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <Link
                      href={`/vendor/${vendorWebsite}/orders/customer/${order.id}`}
                      className="text-primary hover:text-primary/80 underline"
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
                      <p className="text-sm text-muted-foreground">
                        {order.companyName}
                      </p>
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
                  <TableCell>
                    <Badge
                      className={
                        order.user?.storeSlug?.includes("-customer-")
                          ? "bg-[#F3E8FF] text-[#6B21A8] dark:bg-[#581C87] dark:text-[#F3E8FF]"
                          : "bg-[#DBEAFE] text-[#1E40AF] dark:bg-[#1E3A8A] dark:text-[#DBEAFE]"
                      }
                    >
                      {order.user?.storeSlug?.includes("-customer-")
                        ? "Customer"
                        : "Vendor"}
                    </Badge>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-border gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              Rows per page:
            </span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={value => setItemsPerPage(Number(value))}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZES.map(size => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-6">
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-md hover:bg-accent disabled:opacity-50"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => setPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-md hover:bg-accent disabled:opacity-50"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* No Results Message */}
      {filteredOrders.length === 0 && !loading && (
        <div className="text-center py-6 text-muted-foreground">
          No orders found for the selected filters
        </div>
      )}
    </div>
  );
};

export default OrdersTable;
