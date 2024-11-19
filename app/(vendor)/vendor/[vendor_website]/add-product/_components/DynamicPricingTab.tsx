import React from "react";
import { Control, useFieldArray } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { VendorProductFormData } from "../types";

interface DynamicPricingTabProps {
  control: Control<VendorProductFormData>;
}

const DynamicPricingTab: React.FC<DynamicPricingTabProps> = ({ control }) => {
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
            name={`dynamicPricing.${index}.amount`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Price per item</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Price for this range"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Hidden field for type */}
          <input
            type="hidden"
            {...control.register(`dynamicPricing.${index}.type`)}
            value="fixed_price"
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
          ranges. For example, if you want to give a discount for bulk orders:
          <br />
          • 1-10 items: Regular price
          <br />
          • 11-50 items: Slightly reduced price
          <br />• 51+ items: Best bulk price
        </p>
      </div>
    </div>
  );
};

export default DynamicPricingTab;
