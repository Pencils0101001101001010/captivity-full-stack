/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Control, useFormContext } from "react-hook-form";
import { Upload } from "lucide-react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ProductFormData } from "./types";

interface FeaturedImageTabProps {
  control: Control<ProductFormData>;
}

const FeaturedImageTab: React.FC<FeaturedImageTabProps> = ({ control }) => {
  const { watch, setValue } = useFormContext<ProductFormData>();

  const handleFeatureImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setValue("featuredImage", {
      thumbnail: imageUrl,
      medium: imageUrl,
      large: imageUrl,
    });
  };

  return (
    <div className="space-y-4">
      <FormField
        control={control}
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
              Upload the main product image. We&apos;ll automatically generate
              thumbnail, medium, and large versions.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Preview of all image sizes */}
      <div className="grid grid-cols-3 gap-4 mt-4">
        {watch("featuredImage.thumbnail") && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Thumbnail</p>
            <img
              src={watch("featuredImage.thumbnail")}
              alt="Thumbnail preview"
              className="w-full aspect-square object-cover rounded-md"
            />
          </div>
        )}
        {watch("featuredImage.medium") && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Medium</p>
            <img
              src={watch("featuredImage.medium")}
              alt="Medium preview"
              className="w-full aspect-square object-cover rounded-md"
            />
          </div>
        )}
        {watch("featuredImage.large") && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Large</p>
            <img
              src={watch("featuredImage.large")}
              alt="Large preview"
              className="w-full aspect-square object-cover rounded-md"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedImageTab;
