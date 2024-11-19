// DynamicPricingTab.tsx
import React from "react";
import { Control, useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VendorProductFormData } from "../types";

interface DynamicPricingTabProps {
  control: Control<VendorProductFormData>;
}

const DynamicPricingTab: React.FC<DynamicPricingTabProps> = ({ control }) => {
  const { watch } = useFormContext<VendorProductFormData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "dynamicPricing",
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Bulk Pricing</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            append({
              from: "",
              to: "",
              type: "fixed_price",
              amount: "",
            })
          }
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Quantity Range
        </Button>
      </div>

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="flex gap-4 items-start bg-accent/50 p-4 rounded-lg"
        >
          <FormField
            control={control}
            name={`dynamicPricing.${index}.from`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Quantity From</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min="1"
                    placeholder="Minimum quantity"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`dynamicPricing.${index}.to`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Quantity To</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min="1"
                    placeholder="Maximum quantity"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`dynamicPricing.${index}.type`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Price Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select price type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="fixed_price">Fixed Price</SelectItem>
                    <SelectItem value="percentage">Percentage Off</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`dynamicPricing.${index}.amount`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Price/Percentage"
                  />
                </FormControl>
                {field.value &&
                  watch(`dynamicPricing.${index}.type`) === "percentage" && (
                    <FormDescription>{field.value}% off</FormDescription>
                  )}
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="mt-8"
            onClick={() => remove(index)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ))}

      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mt-6">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> Set different prices for different quantity
          ranges. For example:
          <br />
          • 1-10 items: Regular price
          <br />
          • 11-50 items: Fixed price $X per item
          <br />• 51+ items: X% off per item
        </p>
      </div>
    </div>
  );
};

export default DynamicPricingTab;
