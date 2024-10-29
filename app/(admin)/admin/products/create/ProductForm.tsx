"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form } from "@/components/ui/form";
import { ProductFormData } from "./types";
import BasicInfoTab from "./BasicInfoTab";
import DynamicPricingTab from "./DynamicPricingTab";
import VariationsTab from "./VariationsTab";
import FeaturedImageTab from "./FeaturedImageTab";

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
