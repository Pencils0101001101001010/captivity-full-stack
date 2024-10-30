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
          variationImageURL: "",
          variationImage: undefined,
          sizes: [
            {
              size: "",
              quantity: 0,
              sku: "",
              sku2: "",
            }
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
    try {
      console.log('Form submission started:', {
        variations: data.variations,
        hasFeatureImage: !!data.featuredImage.file,
      });

      const formData = new FormData();

      // Basic fields
      formData.append("productName", data.productName);
      formData.append("description", data.description);
      formData.append("sellingPrice", data.sellingPrice.toString());
      formData.append("isPublished", data.isPublished.toString());

      // Categories
      data.category.forEach(cat => {
        formData.append("category[]", cat);
      });

      // Featured Image
      if (data.featuredImage.file instanceof File) {
        formData.append("featuredImage", data.featuredImage.file);
        console.log('Adding featured image:', {
          fileName: data.featuredImage.file.name,
          size: data.featuredImage.file.size
        });
      }

      // Dynamic Pricing
      data.dynamicPricing.forEach((pricing, index) => {
        formData.append(`dynamicPricing.${index}.from`, pricing.from);
        formData.append(`dynamicPricing.${index}.to`, pricing.to);
        formData.append(`dynamicPricing.${index}.type`, pricing.type);
        formData.append(`dynamicPricing.${index}.amount`, pricing.amount);
      });

      // Variations with sizes
      data.variations.forEach((variation, varIndex) => {
        formData.append(`variations.${varIndex}.name`, variation.name);
        formData.append(`variations.${varIndex}.color`, variation.color || "");

        // Handle variation image
        if (variation.variationImage instanceof File) {
          formData.append(`variations.${varIndex}.image`, variation.variationImage);
          console.log(`Adding variation ${varIndex} image:`, {
            fileName: variation.variationImage.name,
            fileSize: variation.variationImage.size,
            fileType: variation.variationImage.type
          });
        }

        // Handle sizes for each variation
        variation.sizes.forEach((size, sizeIndex) => {
          formData.append(
            `variations.${varIndex}.sizes.${sizeIndex}.size`,
            size.size
          );
          formData.append(
            `variations.${varIndex}.sizes.${sizeIndex}.quantity`,
            size.quantity.toString()
          );
          formData.append(
            `variations.${varIndex}.sizes.${sizeIndex}.sku`,
            size.sku
          );
          if (size.sku2) {
            formData.append(
              `variations.${varIndex}.sizes.${sizeIndex}.sku2`,
              size.sku2
            );
          }
        });

        console.log(`Added variation ${varIndex} with ${variation.sizes.length} sizes`);
      });

      const result = await createProduct(formData);

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        });

        // Cleanup any object URLs before resetting
        data.variations.forEach(variation => {
          if (variation.variationImageURL?.startsWith('blob:')) {
            URL.revokeObjectURL(variation.variationImageURL);
          }
        });
        if (data.featuredImage.thumbnail.startsWith('blob:')) {
          URL.revokeObjectURL(data.featuredImage.thumbnail);
          URL.revokeObjectURL(data.featuredImage.medium);
          URL.revokeObjectURL(data.featuredImage.large);
        }

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
        description: error instanceof Error ? error.message : "Failed to create product",
        variant: "destructive",
      });
    }
  };

  // Cleanup object URLs when component unmounts
  React.useEffect(() => {
    return () => {
      const formData = form.getValues();
      formData.variations.forEach(variation => {
        if (variation.variationImageURL?.startsWith('blob:')) {
          URL.revokeObjectURL(variation.variationImageURL);
        }
      });
      if (formData.featuredImage.thumbnail.startsWith('blob:')) {
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