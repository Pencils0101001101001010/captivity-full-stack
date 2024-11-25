"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { Prisma, UserRole } from "@prisma/client";

interface AuthUser {
  id: string;
  role: UserRole;
  storeSlug: string | null;
}

interface BaseActionResult {
  success: boolean;
  message: string;
  error?: string;
}

interface CustomerListResult extends BaseActionResult {
  data?: {
    customers: CustomerData[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCustomers: number;
      pageSize: number;
    };
  };
}

interface CustomerDetailResult extends BaseActionResult {
  data?: CustomerDetailData;
}

interface CustomerData {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  companyName: string;
  streetAddress: string;
  addressLine2?: string | null;
  suburb?: string | null;
  townCity: string;
  postcode: string;
  country: string;
  storeSlug: string | null;
  createdAt: Date;
  totalOrders: number;
  totalSpent: number;
}

interface CustomerDetailData extends CustomerData {
  recentOrders: Array<{
    id: string;
    totalAmount: number;
    status: string;
    createdAt: Date;
  }>;
}

export async function getVendorCustomers(
  searchQuery?: string,
  sortBy: "name" | "orders" | "spent" = "name",
  sortDirection: Prisma.SortOrder = "asc",
  page = 1,
  pageSize = 10
): Promise<CustomerListResult> {
  try {
    const { user } = (await validateRequest()) as { user: AuthUser | null };

    if (!user) {
      return {
        success: false,
        message: "Authentication required",
        error: "Please login to access customer data",
      };
    }

    if (user.role !== "VENDOR") {
      return {
        success: false,
        message: "Unauthorized access",
        error: "Only vendors can access customer data",
      };
    }

    if (!user.storeSlug) {
      return {
        success: false,
        message: "Store not found",
        error: "Vendor store configuration is missing",
      };
    }

    const skip = (page - 1) * pageSize;

    // Build the where clause with proper Prisma types
    const whereClause: Prisma.UserWhereInput = {
      storeSlug: {
        startsWith: `${user.storeSlug}-customer-`,
      },
      ...(searchQuery
        ? {
            OR: [
              {
                firstName: {
                  contains: searchQuery,
                  mode: "insensitive" as Prisma.QueryMode,
                },
              },
              {
                lastName: {
                  contains: searchQuery,
                  mode: "insensitive" as Prisma.QueryMode,
                },
              },
              {
                email: {
                  contains: searchQuery,
                  mode: "insensitive" as Prisma.QueryMode,
                },
              },
              {
                companyName: {
                  contains: searchQuery,
                  mode: "insensitive" as Prisma.QueryMode,
                },
              },
            ],
          }
        : {}),
    };

    // Define the order by clause based on sort parameter
    const orderBy: Prisma.UserOrderByWithRelationInput =
      sortBy === "name"
        ? { firstName: sortDirection }
        : sortBy === "orders"
          ? { vendorOrders: { _count: sortDirection } }
          : { firstName: sortDirection }; // Default sorting for "spent" since we'll sort manually

    // Fetch customers with orders
    const customers = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        companyName: true,
        streetAddress: true,
        addressLine2: true,
        suburb: true,
        townCity: true,
        postcode: true,
        country: true,
        storeSlug: true,
        createdAt: true,
        _count: {
          select: {
            vendorOrders: true,
          },
        },
        vendorOrders: {
          select: {
            totalAmount: true,
          },
        },
      },
      skip,
      take: pageSize,
      orderBy,
    });

    // If sorting by spent, we need to manually sort after fetching
    if (sortBy === "spent") {
      customers.sort((a, b) => {
        const aTotal = a.vendorOrders.reduce(
          (sum, order) => sum + order.totalAmount,
          0
        );
        const bTotal = b.vendorOrders.reduce(
          (sum, order) => sum + order.totalAmount,
          0
        );
        return sortDirection === "asc" ? aTotal - bTotal : bTotal - aTotal;
      });
    }

    const transformedCustomers: CustomerData[] = customers.map(customer => ({
      ...customer,
      totalOrders: customer._count.vendorOrders,
      totalSpent: customer.vendorOrders.reduce(
        (sum, order) => sum + order.totalAmount,
        0
      ),
      addressLine2: customer.addressLine2 || null,
      suburb: customer.suburb || null,
    }));

    const totalCustomers = await prisma.user.count({
      where: whereClause,
    });

    return {
      success: true,
      message: "Customers retrieved successfully",
      data: {
        customers: transformedCustomers,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCustomers / pageSize),
          totalCustomers,
          pageSize,
        },
      },
    };
  } catch (error) {
    console.error("Error fetching vendor customers:", error);
    return {
      success: false,
      message: "Failed to retrieve customers",
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function getVendorCustomerDetails(
  customerId: string
): Promise<CustomerDetailResult> {
  try {
    const { user } = (await validateRequest()) as { user: AuthUser | null };

    if (!user || user.role !== "VENDOR" || !user.storeSlug) {
      return {
        success: false,
        message: "Unauthorized access",
        error: "Only vendors can access customer details",
      };
    }

    const customer = await prisma.user.findFirst({
      where: {
        id: customerId,
        storeSlug: {
          startsWith: `${user.storeSlug}-customer-`,
        },
      },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        companyName: true,
        streetAddress: true,
        addressLine2: true,
        suburb: true,
        townCity: true,
        postcode: true,
        country: true,
        storeSlug: true,
        createdAt: true,
        _count: {
          select: {
            vendorOrders: true,
          },
        },
        vendorOrders: {
          select: {
            id: true,
            totalAmount: true,
            status: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 5,
        },
      },
    });

    if (!customer) {
      return {
        success: false,
        message: "Customer not found",
        error: "Customer does not exist or is not associated with your store",
      };
    }

    const totalSpent = customer.vendorOrders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );

    const transformedCustomer: CustomerDetailData = {
      ...customer,
      totalOrders: customer._count.vendorOrders,
      totalSpent,
      recentOrders: customer.vendorOrders,
      addressLine2: customer.addressLine2 || null,
      suburb: customer.suburb || null,
    };

    return {
      success: true,
      message: "Customer details retrieved successfully",
      data: transformedCustomer,
    };
  } catch (error) {
    console.error("Error fetching customer details:", error);
    return {
      success: false,
      message: "Failed to retrieve customer details",
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
