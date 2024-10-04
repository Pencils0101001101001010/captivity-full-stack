"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  categoryOptions,
  colorOptions,
  ProductFormValues,
  productSchema,
} from "@/lib/validation";
import { Button } from "@/components/ui/button"; // Button from shadcn
import { createProduct } from "./actions";

export default function ProductForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      type: "",
      sku: "",
      name: "",
      published: false,
      isFeatured: false,
      visibility: "public",
      shortDescription: "",
      taxStatus: "taxable",
      inStock: true,
      backordersAllowed: false,
      soldIndividually: false,
      allowReviews: true,
      categories: [],
      tags: [],
      imageUrl: "",
      upsells: [],
      position: 0,
      attribute1Name: "Color",
      attribute1Values: [],
      attribute2Name: "",
      attribute2Values: [],
      regularPrice: 0,
      stock: 0,
    },
  });

  // Handle form submission
  async function onSubmit(values: ProductFormValues) {
    setLoading(true);
    setError(null);
    try {
      await createProduct(values);
      // If we reach this point, it means the redirect didn't happen,
      // which is unexpected. We can handle this case if needed.
      console.error("Unexpected: createProduct completed without redirecting");
    } catch (error) {
      console.error("Error creating product:", error);
      setError("Failed to create product. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4 shadow-xl shadow-gray-400 p-10 rounded-md">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Product Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select product type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="simple">Simple Product</SelectItem>
                    <SelectItem value="variable">Variable Product</SelectItem>
                    <SelectItem value="grouped">Grouped Product</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sku"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>SKU</FormLabel>
                <FormControl>
                  <Input placeholder="Enter SKU" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="regularPrice"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Regular Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Stock Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value, 10))
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="attribute1Values"
            render={() => (
              <FormItem className="w-full space-y-2">
                <FormLabel>Colors</FormLabel>
                <FormControl>
                  <div className="grid grid-cols-2 gap-2">
                    {colorOptions.map((color) => (
                      <div
                        key={color.value}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`color-${color.value}`}
                          onCheckedChange={(checked) => {
                            const currentColors =
                              form.getValues("attribute1Values") || [];
                            if (checked) {
                              form.setValue("attribute1Values", [
                                ...currentColors,
                                color.value,
                              ]);
                            } else {
                              form.setValue(
                                "attribute1Values",
                                currentColors.filter((c) => c !== color.value)
                              );
                            }
                          }}
                        />
                        <label htmlFor={`color-${color.value}`}>
                          {color.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Product Image URL</FormLabel>
                <FormControl>
                  <Input type="url" placeholder="Enter image URL" {...field} />
                </FormControl>
                <FormDescription>
                  Enter a valid URL for the product image
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="shortDescription"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Short Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter a short description"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="published"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Published</FormLabel>
                  <FormDescription>
                    This product will be visible on the store
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="categories"
            render={() => (
              <FormItem className="w-full space-y-2">
                <FormLabel>Categories</FormLabel>
                <FormControl>
                  <div className="grid grid-cols-3 gap-x-6">
                    {categoryOptions.map((category) => (
                      <div
                        key={category.value}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`category-${category.value}`}
                          onCheckedChange={(checked) => {
                            const currentCategories =
                              form.getValues("categories");
                            if (checked) {
                              form.setValue("categories", [
                                ...currentCategories,
                                category.value,
                              ]);
                            } else {
                              form.setValue(
                                "categories",
                                currentCategories.filter(
                                  (c) => c !== category.value
                                )
                              );
                            }
                          }}
                        />
                        <label htmlFor={`category-${category.value}`}>
                          {category.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Submit Button with Loading State */}
        <Button type="submit" className="w-full md:w-auto" disabled={loading}>
          {loading ? "Creating..." : "Create Product"}
        </Button>
      </form>
    </Form>
  );
}
