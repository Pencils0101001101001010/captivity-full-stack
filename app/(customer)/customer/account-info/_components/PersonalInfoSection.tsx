// PersonalInfoSection.tsx
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
import { Button } from "@/components/ui/button";
import { UpdatePersonalInfoValues } from "../validation";

interface PersonalInfoSectionProps {
  form: UseFormReturn<UpdatePersonalInfoValues>;
  onSubmit: (data: UpdatePersonalInfoValues) => Promise<void>;
}

export const PersonalInfoSection = ({
  form,
  onSubmit,
}: PersonalInfoSectionProps) => {
  return (
    <div className="bg-background text-foreground">
      <h2 className="text-xl font-semibold mb-6 text-foreground">
        Personal Information
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">First Name</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-background border-input" />
                </FormControl>
                <FormMessage className="text-destructive" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Last Name</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-background border-input" />
                </FormControl>
                <FormMessage className="text-destructive" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="displayName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Display Name</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-background border-input" />
                </FormControl>
                <FormMessage className="text-destructive" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    {...field}
                    className="bg-background border-input"
                  />
                </FormControl>
                <FormMessage className="text-destructive" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center text-gray-700">
                  Phone Number
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    {...field}
                    onChange={e => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {form.formState.isSubmitting
              ? "Updating..."
              : "Update Personal Information"}
          </Button>
        </form>
      </Form>
    </div>
  );
};
