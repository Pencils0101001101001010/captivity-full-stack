"use client";

import { OrderStatus } from "@prisma/client";
import { DateRange } from "react-day-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";

interface OrderFiltersProps {
  onStatusChange: (status: OrderStatus | "ALL") => void;
  onCustomerTypeChange: (type: "all" | "vendor" | "customer") => void;
  onDateRangeChange: (range: DateRange | undefined) => void;
  dateRange: DateRange | undefined;
}

type CustomerType = "all" | "vendor" | "customer";

const CUSTOMER_TYPES: { label: string; value: CustomerType }[] = [
  { label: "All Customers", value: "all" },
  { label: "Vendor Customers", value: "vendor" },
  { label: "Regular Customers", value: "customer" },
];

export function OrderFilters({
  onStatusChange,
  onCustomerTypeChange,
  onDateRangeChange,
  dateRange,
}: OrderFiltersProps) {
  return (
    <div className="flex gap-4 flex-wrap">
      <Select
        onValueChange={(value: string) =>
          onStatusChange(value as OrderStatus | "ALL")
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Statuses</SelectItem>
          {Object.values(OrderStatus).map(status => (
            <SelectItem key={status} value={status}>
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        onValueChange={(value: string) =>
          onCustomerTypeChange(value as CustomerType)
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Customer type" />
        </SelectTrigger>
        <SelectContent>
          {CUSTOMER_TYPES.map(({ label, value }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <DatePickerWithRange value={dateRange} onChange={onDateRangeChange} />
    </div>
  );
}
