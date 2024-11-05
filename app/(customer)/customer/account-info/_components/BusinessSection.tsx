// BusinessSection.tsx
import { UseFormReturn } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { UpdateBusinessInfoValues } from "../validation";

interface BusinessSectionProps {
  form: UseFormReturn<UpdateBusinessInfoValues>;
  onSubmit: (data: UpdateBusinessInfoValues) => Promise<void>;
}

export const BusinessSection = ({ form, onSubmit }: BusinessSectionProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-6">Business Information</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="natureOfBusiness"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nature of Business</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select nature of business" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="distributors">Distributors</SelectItem>
                    <SelectItem value="retailer">Retailer</SelectItem>
                    <SelectItem value="manufacturer">Manufacturer</SelectItem>
                    <SelectItem value="service">Service Provider</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="currentSupplier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Supplier</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select current supplier" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="supplier1">Supplier 1</SelectItem>
                    <SelectItem value="supplier2">Supplier 2</SelectItem>
                    <SelectItem value="supplier3">Supplier 3</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.watch("currentSupplier") === "other" && (
            <FormField
              control={form.control}
              name="otherSupplier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Other Supplier</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting
              ? "Updating..."
              : "Update Business Information"}
          </Button>
        </form>
      </Form>
    </div>
  );
};
