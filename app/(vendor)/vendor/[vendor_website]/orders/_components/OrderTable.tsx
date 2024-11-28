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
    return <div className="text-red-500 p-4">{error}</div>;
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
        <div className="text-lg text-gray-500">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-sm text-gray-500">Total Orders</div>
          <div className="text-2xl font-semibold">{totalOrders}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-sm text-gray-500">Pending</div>
          <div className="text-2xl font-semibold">{stats.pending}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-sm text-gray-500">Processing</div>
          <div className="text-2xl font-semibold">{stats.processing}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-sm text-gray-500">Total Amount</div>
          <div className="text-2xl font-semibold">
            R{totalAmount.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Warning Alert */}
      {oldOrders.length > 0 && selectedTimeFilter !== "old" && (
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            You have {oldOrders.length} pending orders that are older than one
            week
          </AlertDescription>
        </Alert>
      )}

      {/* Filters Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm border space-y-4">
        {/* Search, Status, and Customer Type Filters */}
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search orders..."
              value={searchQuery}
              onChange={e => searchOrders(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={selectedStatus}
            onValueChange={value =>
              filterOrders(undefined, undefined, value as StatusFilter)
            }
          >
            <SelectTrigger className="w-40">
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
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Customer Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="vendor">My Orders</SelectItem>
              <SelectItem value="customer">Customer Orders</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Time Filter */}
        <Tabs
          value={selectedTimeFilter}
          onValueChange={value => filterOrders(undefined, value as TimeFilter)}
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

        {/* Price Range Filter */}
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

      {/* Orders Table */}
      <div className="rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <button
                  onClick={() => handleSort("date")}
                  className="flex items-center space-x-1 hover:text-gray-700"
                >
                  <span>Order ID</span>
                  <ArrowUpDown className="h-4 w-4" />
                </button>
              </TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>
                <button
                  onClick={() => handleSort("amount")}
                  className="flex items-center space-x-1 hover:text-gray-700"
                >
                  <span>Total Amount</span>
                  <ArrowUpDown className="h-4 w-4" />
                </button>
              </TableHead>
              <TableHead>
                <button
                  onClick={() => handleSort("status")}
                  className="flex items-center space-x-1 hover:text-gray-700"
                >
                  <span>Status</span>
                  <ArrowUpDown className="h-4 w-4" />
                </button>
              </TableHead>
              <TableHead>Collection Method</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead>Order Type</TableHead>
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
                      <p className="text-sm text-gray-500">
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
                          ? "bg-purple-100 text-purple-800"
                          : "bg-blue-100 text-blue-800"
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
        <div className="flex items-center justify-between p-4 border-t">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Rows per page:</span>
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
            <span className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => setPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* No Results Message */}
      {filteredOrders.length === 0 && !loading && (
        <div className="text-center py-6 text-gray-500">
          No orders found for the selected filters
        </div>
      )}
    </div>
  );
};

export default OrdersTable;
