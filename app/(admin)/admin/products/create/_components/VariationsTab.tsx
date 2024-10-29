import React from "react";
import Image from "next/image";
import { Control, useFormContext, useFieldArray } from "react-hook-form";
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
import { ProductFormData } from "../types";

interface VariationsTabProps {
  control: Control<ProductFormData>;
}

const VariationsTab: React.FC<VariationsTabProps> = ({ control }) => {
  const { setValue } = useFormContext<ProductFormData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "variations",
  });

  const handleVariationImageUpload = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imageUrl = URL.createObjectURL(file);
      setValue(`variations.${index}.variationImageURL`, imageUrl, {
        shouldValidate: true,
      });
    } catch (error) {
      console.error("Error handling image upload:", error);
    }
  };

  const emptyVariation: Omit<ProductFormData["variations"][number], "id"> = {
    name: "",
    color: "",
    size: "",
    sku: "",
    sku2: "",
    variationImageURL: "",
    quantity: 0,
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Variations</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append(emptyVariation)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Variation
        </Button>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="space-y-4 p-4 border rounded-lg">
          <div className="flex justify-end">
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={() => remove(index)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={control}
              name={`variations.${index}.name`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`variations.${index}.color`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`variations.${index}.size`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`variations.${index}.sku`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SKU</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`variations.${index}.sku2`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SKU 2</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`variations.${index}.quantity`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={e =>
                        field.onChange(parseInt(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={control}
            name={`variations.${index}.variationImageURL`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Variation Image</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-4">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={e => handleVariationImageUpload(index, e)}
                    />
                    {field.value && (
                      <div className="relative w-16 h-16">
                        <Image
                          src={field.value}
                          alt="Variation preview"
                          fill
                          className="object-cover rounded-md"
                          sizes="64px"
                        />
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      ))}
    </div>
  );
};

export default VariationsTab;
