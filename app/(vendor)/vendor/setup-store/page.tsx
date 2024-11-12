"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { setupStore } from "./actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const storeFormSchema = z.object({
  storeName: z.string().min(3, "Store name must be at least 3 characters"),
  storeSlug: z
    .string()
    .min(3, "Store URL must be at least 3 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Only lowercase letters, numbers, and hyphens allowed"
    ),
  storeDescription: z
    .string()
    .min(10, "Description must be at least 10 characters"),
  storePhoneNumber: z.string().min(10, "Please enter a valid phone number"),
  storeContactEmail: z.string().email("Please enter a valid email"),
});

type StoreFormValues = z.infer<typeof storeFormSchema>;

export default function SetupStorePage() {
  const router = useRouter();
  const form = useForm<StoreFormValues>({
    resolver: zodResolver(storeFormSchema),
    defaultValues: {
      storeName: "",
      storeSlug: "",
      storeDescription: "",
      storePhoneNumber: "",
      storeContactEmail: "",
    },
  });

  async function onSubmit(data: StoreFormValues) {
    try {
      const result = await setupStore(data);
      if (result.success) {
        toast.success("Store setup successful!");
        router.push(`/vendor/${data.storeSlug}`);
      } else {
        toast.error(result.error || "Something went wrong");
      }
    } catch (error) {
      toast.error("Failed to setup store");
    }
  }

  return (
    <div className="container max-w-2xl py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Setup Your Store</h1>
        <p className="text-muted-foreground">
          Create your vendor store profile
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="storeName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Store Name</FormLabel>
                <FormControl>
                  <Input placeholder="My Awesome Store" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="storeSlug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Store URL</FormLabel>
                <FormControl>
                  <Input placeholder="my-awesome-store" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="storeDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Store Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us about your store..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="storePhoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Store Phone Number</FormLabel>
                <FormControl>
                  <Input type="tel" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="storeContactEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Store Contact Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Setup Store</Button>
        </form>
      </Form>
    </div>
  );
}
