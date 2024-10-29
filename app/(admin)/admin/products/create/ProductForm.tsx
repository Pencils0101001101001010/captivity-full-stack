"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { ProductFormData, productFormSchema } from "./types";
import BasicInfoTab from "./_components/BasicInfoTab";
import DynamicPricingTab from "./_components/DynamicPricingTab";
import VariationsTab from "./_components/VariationsTab";
import FeaturedImageTab from "./_components/FeaturedImageTab";
import { createProduct } from "./actions";

const ProductForm = () => {
  const { toast } = useToast();

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      productName: "",
      category: [],
      description: "",
      sellingPrice: 0,
      isPublished: true,
      dynamicPricing: [
        {
          from: "",
          to: "",
          type: "fixed_price",
          amount: "",
        },
      ],
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

  const onSubmit = async (data: ProductFormData) => {
    try {
      const formData = new FormData();

      // Basic fields
      formData.append("productName", data.productName);
      formData.append("description", data.description);
      formData.append("sellingPrice", data.sellingPrice.toString());
      formData.append("isPublished", data.isPublished.toString());

      // Categories - append each category separately
      data.category.forEach(cat => {
        formData.append("category[]", cat); // Note the [] syntax
      });

      // Dynamic Pricing
      data.dynamicPricing.forEach((pricing, index) => {
        formData.append(`dynamicPricing.${index}.from`, pricing.from);
        formData.append(`dynamicPricing.${index}.to`, pricing.to);
        formData.append(`dynamicPricing.${index}.type`, pricing.type);
        formData.append(`dynamicPricing.${index}.amount`, pricing.amount);
      });

      // Variations
      data.variations.forEach((variation, index) => {
        formData.append(`variations.${index}.name`, variation.name);
        formData.append(`variations.${index}.color`, variation.color || "");
        formData.append(`variations.${index}.size`, variation.size || "");
        formData.append(`variations.${index}.sku`, variation.sku);
        formData.append(`variations.${index}.sku2`, variation.sku2 || "");
        formData.append(
          `variations.${index}.quantity`,
          variation.quantity.toString()
        );

        // Handle variation image
        if (
          variation.variationImageURL &&
          typeof variation.variationImageURL !== "string"
        ) {
          formData.append(
            `variations.${index}.image`,
            variation.variationImageURL
          );
        }
      });

      // Featured Image
      if (
        data.featuredImage.thumbnail &&
        typeof data.featuredImage.thumbnail !== "string"
      ) {
        formData.append("featuredImage", data.featuredImage.thumbnail);
      }

      const result = await createProduct(formData);

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        });
        form.reset();
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create product",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-2xl shadow-black">
      <CardHeader>
        <CardTitle>Create New Product</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="basic-info" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
                <TabsTrigger value="dynamic-pricing">Pricing</TabsTrigger>
                <TabsTrigger value="variations">Variations</TabsTrigger>
                <TabsTrigger value="featured-image">Images</TabsTrigger>
              </TabsList>

              <TabsContent value="basic-info">
                <BasicInfoTab control={form.control} />
              </TabsContent>

              <TabsContent value="dynamic-pricing">
                <DynamicPricingTab control={form.control} />
              </TabsContent>

              <TabsContent value="variations">
                <VariationsTab control={form.control} />
              </TabsContent>

              <TabsContent value="featured-image">
                <FeaturedImageTab control={form.control} />
              </TabsContent>
            </Tabs>

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
