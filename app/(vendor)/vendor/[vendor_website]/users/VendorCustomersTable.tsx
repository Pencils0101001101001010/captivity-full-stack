"use client";

import { useState } from "react";
import { User } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, ChevronUp, Search, Filter, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSession } from "@/app/(vendor)/SessionProvider";

type VendorCustomerResponse = {
  success: boolean;
  message: string;
  data?: Partial<User>[];
  error?: string;
};

interface VendorCustomersTableProps {
  initialData: VendorCustomerResponse;
}

type FilterOptions = {
  country: string;
  city: string;
  joinedAfter: string;
  joinedBefore: string;
};

const ALL_VALUES = {
  COUNTRIES: "all-countries",
  CITIES: "all-cities",
} as const;

export function VendorCustomersTable({
  initialData,
}: VendorCustomersTableProps) {
  const session = useSession();
  const [customers] = useState<Partial<User>[]>(initialData.data || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof User>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [filters, setFilters] = useState<FilterOptions>({
    country: ALL_VALUES.COUNTRIES,
    city: ALL_VALUES.CITIES,
    joinedAfter: "",
    joinedBefore: "",
  });

  // Get unique values for filter options
  const countries = Array.from(
    new Set(customers.map(c => c.country).filter(Boolean))
  );
  const cities = Array.from(
    new Set(customers.map(c => c.townCity).filter(Boolean))
  );

  const handleSort = (field: keyof User) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      country: ALL_VALUES.COUNTRIES,
      city: ALL_VALUES.CITIES,
      joinedAfter: "",
      joinedBefore: "",
    });
    setSearchTerm("");
  };

  const filteredAndSortedCustomers = customers
    .filter(customer => {
      // Text search
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
          customer.companyName?.toLowerCase().includes(searchLower) ||
          customer.email?.toLowerCase().includes(searchLower) ||
          `${customer.firstName} ${customer.lastName}`
            .toLowerCase()
            .includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Country filter
      if (
        filters.country !== ALL_VALUES.COUNTRIES &&
        customer.country !== filters.country
      ) {
        return false;
      }

      // City filter
      if (
        filters.city !== ALL_VALUES.CITIES &&
        customer.townCity !== filters.city
      ) {
        return false;
      }

      // Date range filter
      if (customer.createdAt) {
        const createdDate = new Date(customer.createdAt);
        if (
          filters.joinedAfter &&
          createdDate < new Date(filters.joinedAfter)
        ) {
          return false;
        }
        if (
          filters.joinedBefore &&
          createdDate > new Date(filters.joinedBefore)
        ) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      if (!a[sortField] || !b[sortField]) return 0;
      const aValue = a[sortField];
      const bValue = b[sortField];
      const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return sortDirection === "asc" ? comparison : -comparison;
    });

  const SortIcon = ({ field }: { field: keyof User }) => {
    if (sortField !== field)
      return <ChevronDown className="w-4 h-4 text-gray-400" />;
    return sortDirection === "asc" ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  const hasActiveFilters =
    searchTerm ||
    filters.country !== ALL_VALUES.COUNTRIES ||
    filters.city !== ALL_VALUES.CITIES ||
    filters.joinedAfter ||
    filters.joinedBefore;

  if (!session || session?.user?.role !== "VENDOR") {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search customers..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Country</label>
                <Select
                  value={filters.country}
                  onValueChange={(value: string) =>
                    handleFilterChange("country", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL_VALUES.COUNTRIES}>
                      All Countries
                    </SelectItem>
                    {countries.map(
                      country =>
                        country && (
                          <SelectItem key={country} value={country}>
                            {country}
                          </SelectItem>
                        )
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">City</label>
                <Select
                  value={filters.city}
                  onValueChange={(value: string) =>
                    handleFilterChange("city", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL_VALUES.CITIES}>
                      All Cities
                    </SelectItem>
                    {cities.map(
                      city =>
                        city && (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        )
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Joined After</label>
                <Input
                  type="date"
                  value={filters.joinedAfter}
                  onChange={e =>
                    handleFilterChange("joinedAfter", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Joined Before</label>
                <Input
                  type="date"
                  value={filters.joinedBefore}
                  onChange={e =>
                    handleFilterChange("joinedBefore", e.target.value)
                  }
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(filters).map(([key, value]) => {
            if (
              !value ||
              (key === "country" && value === ALL_VALUES.COUNTRIES) ||
              (key === "city" && value === ALL_VALUES.CITIES)
            ) {
              return null;
            }
            return (
              <div
                key={key}
                className="bg-gray-100 text-sm px-3 py-1 rounded-full flex items-center gap-2"
              >
                <span>
                  {key}: {value}
                </span>
                <button
                  onClick={() =>
                    handleFilterChange(
                      key as keyof FilterOptions,
                      key === "country"
                        ? ALL_VALUES.COUNTRIES
                        : key === "city"
                          ? ALL_VALUES.CITIES
                          : ""
                    )
                  }
                  className="hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("companyName")}
              >
                <div className="flex items-center gap-1">
                  Company
                  <SortIcon field="companyName" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("email")}
              >
                <div className="flex items-center gap-1">
                  Email
                  <SortIcon field="email" />
                </div>
              </TableHead>
              <TableHead>Contact</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("createdAt")}
              >
                <div className="flex items-center gap-1">
                  Joined
                  <SortIcon field="createdAt" />
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedCustomers.map(customer => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">
                  {customer.companyName}
                </TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>
                  {customer.firstName} {customer.lastName}
                  <br />
                  <span className="text-sm text-gray-500">
                    {customer.phoneNumber}
                  </span>
                </TableCell>
                <TableCell>
                  {customer.createdAt &&
                    new Date(customer.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
            {filteredAndSortedCustomers.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-24 text-center text-gray-500"
                >
                  No customers found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-500">
        Showing {filteredAndSortedCustomers.length} of {customers.length}{" "}
        customers
      </div>
    </div>
  );
}
