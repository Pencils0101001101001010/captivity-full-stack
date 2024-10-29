"use client";
import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Plus, Trash2, Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ProductFormData } from "./types";

const ProductForm = () => {
  const form = useForm<ProductFormData>({
    defaultValues: {
      productName: "",
      category: [],
      description: "",
      sellingPrice: 0,
      isPublished: true,
      dynamicPricing: [{ from: "", to: "", type: "fixed_price", amount: "" }],
      variations: [
        {
          name: "",
          color: "",
          size: "",
          sku: "",
          sku2: "",
          variationImageURL: "",
          quantity: 0,
        },
      ],
      featuredImage: {
        thumbnail: "",
        medium: "",
        large: "",
      },
    },
  });

  const {
    fields: dynamicPricingFields,
    append: appendDynamicPricing,
    remove: removeDynamicPricing,
  } = useFieldArray({
    control: form.control,
    name: "dynamicPricing",
  });

  const {
    fields: variationFields,
    append: appendVariation,
    remove: removeVariation,
  } = useFieldArray({
    control: form.control,
    name: "variations",
  });

  const handleVariationImageUpload = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log("Variation image selected:", {
      index,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    });

    const imageUrl = URL.createObjectURL(file);
    form.setValue(`variations.${index}.variationImageURL`, imageUrl);
  };

  const handleFeatureImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log("Featured image selected:", {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    });

    const imageUrl = URL.createObjectURL(file);
    form.setValue("featuredImage", {
      thumbnail: imageUrl,
      medium: imageUrl,
      large: imageUrl,
    });
  };

  const onSubmit = async (data: ProductFormData) => {
    console.log("Form submitted with data:", data);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Product</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="productName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categories</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={e =>
                          field.onChange(e.target.value.split(","))
                        }
                        placeholder="Enter categories separated by commas"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sellingPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Selling Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={e =>
                          field.onChange(parseFloat(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isPublished"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Published</FormLabel>
                      <FormDescription>
                        Make this product visible in the store
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Dynamic Pricing */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Dynamic Pricing</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    appendDynamicPricing({
                      from: "",
                      to: "",
                      type: "fixed_price",
                      amount: "",
                    })
                  }
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Pricing Rule
                </Button>
              </div>

              {dynamicPricingFields.map((field, index) => (
                <div key={field.id} className="flex gap-4 items-start">
                  <FormField
                    control={form.control}
                    name={`dynamicPricing.${index}.from`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>From</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`dynamicPricing.${index}.to`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>To</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`dynamicPricing.${index}.amount`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Amount</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="mt-8"
                    onClick={() => removeDynamicPricing(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Variations */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Variations</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    appendVariation({
                      name: "",
                      color: "",
                      size: "",
                      sku: "",
                      sku2: "",
                      variationImageURL: "",
                      quantity: 0,
                    })
                  }
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Variation
                </Button>
              </div>

              {variationFields.map((field, index) => (
                <div key={field.id} className="space-y-4 p-4 border rounded-lg">
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeVariation(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`variations.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`variations.${index}.color`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Color</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`variations.${index}.size`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Size</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`variations.${index}.sku`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SKU</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`variations.${index}.sku2`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SKU 2</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`variations.${index}.quantity`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantity</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={e =>
                                field.onChange(parseInt(e.target.value))
                              }
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name={`variations.${index}.variationImageURL`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Variation Image</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-4">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={e =>
                                handleVariationImageUpload(index, e)
                              }
                            />
                            {field.value && (
                              <img
                                src={field.value}
                                alt="Variation preview"
                                className="w-16 h-16 object-cover"
                              />
                            )}
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>

            {/* Featured Image */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="featuredImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Featured Image</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-4">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleFeatureImageUpload}
                        />
                        {field.value.thumbnail && (
                          <img
                            src={field.value.thumbnail}
                            alt="Featured image preview"
                            className="w-16 h-16 object-cover"
                          />
                        )}
                        <Upload className="w-6 h-6" />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Upload the main product image. We&apos;ll automatically
                      generate thumbnail, medium, and large versions.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Preview of all image sizes */}
              <div className="grid grid-cols-3 gap-4 mt-4">
                {form.watch("featuredImage.thumbnail") && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Thumbnail</p>
                    <img
                      src={form.watch("featuredImage.thumbnail")}
                      alt="Thumbnail preview"
                      className="w-full aspect-square object-cover rounded-md"
                    />
                  </div>
                )}
                {form.watch("featuredImage.medium") && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Medium</p>
                    <img
                      src={form.watch("featuredImage.medium")}
                      alt="Medium preview"
                      className="w-full aspect-square object-cover rounded-md"
                    />
                  </div>
                )}
                {form.watch("featuredImage.large") && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Large</p>
                    <img
                      src={form.watch("featuredImage.large")}
                      alt="Large preview"
                      className="w-full aspect-square object-cover rounded-md"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="flex-1">
                Create Product
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
              >
                Reset Form
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ProductForm;
