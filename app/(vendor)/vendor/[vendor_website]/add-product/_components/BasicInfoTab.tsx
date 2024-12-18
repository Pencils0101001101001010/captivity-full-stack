import React from "react";
import { Control } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { VendorProductFormData } from "../types";
import { MultiSelect } from "./MultiSelect";

interface BasicInfoTabProps {
  control: Control<VendorProductFormData>;
}

const PRODUCT_CATEGORIES = [
  "summer-collection",
  "winter-collection",
  "african-collection",
  "baseball-collection",
  "camo-collection",
  "fashion-collection",
  "industrial-collection",
  "kids-collection",
  "leisure-collection",
  "signature-collection",
  "sport-collection",
];

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({ control }) => {
  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="productName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base">Product Name</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="Enter product name"
                className="w-full"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="category"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel className="text-base">Categories</FormLabel>
            <FormControl>
              <MultiSelect
                options={PRODUCT_CATEGORIES}
                value={field.value || []}
                onChange={field.onChange}
              />
            </FormControl>
            <FormDescription className="text-sm">
              Select one or more categories for your product
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base">Description</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Enter a detailed description of your product"
                className="min-h-[120px] resize-y w-full"
              />
            </FormControl>
            <FormDescription className="text-sm">
              Provide a comprehensive description of your product including key
              features, materials, and specifications
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="sellingPrice"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base">Selling Price</FormLabel>
            <FormControl>
              <Input
                type="number"
                step="0.01"
                min="0"
                {...field}
                onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                className="w-full"
              />
            </FormControl>
            <FormDescription className="text-sm">
              Set your product&apos;s base selling price (before any dynamic
              pricing rules)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="isPublished"
        render={({ field }) => (
          <FormItem className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-lg border p-4">
            <div className="space-y-1.5">
              <FormLabel className="text-base">Published Status</FormLabel>
              <FormDescription className="text-sm">
                Toggle whether this product should be visible in your store. You
                can change this later.
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                aria-label="Published status"
                className="data-[state=checked]:bg-green-500"
              />
            </FormControl>
          </FormItem>
        )}
      />

      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> Make sure to fill out all required fields
          before proceeding to the next sections. You can save your product as a
          draft by toggling the Published Status off.
        </p>
      </div>
    </div>
  );
};

export default BasicInfoTab;
