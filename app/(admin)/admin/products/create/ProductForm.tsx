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
          variationImageURL: "",
          variationImage: undefined,
          sizes: [
            {
              size: "",
              quantity: 0,
              sku: "",
              sku2: "",
            },
          ],
        },
      ],
      featuredImage: {
        file: undefined,
        thumbnail: "",
        medium: "",
        large: "",
      },
    },
  });

  const onSubmit = async (data: ProductFormData) => {
    console.log(data);
  };

  // Cleanup object URLs when component unmounts
  React.useEffect(() => {
    return () => {
      const formData = form.getValues();
      formData.variations.forEach(variation => {
        if (variation.variationImageURL?.startsWith("blob:")) {
          URL.revokeObjectURL(variation.variationImageURL);
        }
      });
      if (formData.featuredImage.thumbnail.startsWith("blob:")) {
        URL.revokeObjectURL(formData.featuredImage.thumbnail);
        URL.revokeObjectURL(formData.featuredImage.medium);
        URL.revokeObjectURL(formData.featuredImage.large);
      }
    };
  }, [form]);

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-2xl shadow-black">
      <CardHeader>
        <CardTitle>Create New Product</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
            encType="multipart/form-data"
          >
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
