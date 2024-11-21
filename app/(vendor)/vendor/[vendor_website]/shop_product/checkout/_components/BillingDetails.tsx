import React, { useMemo } from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { VendorFormValues } from "../_lib/types";
import {
  VENDOR_BRANCHES,
  VENDOR_COLLECTION_METHODS,
  VENDOR_PROVINCES,
} from "../_lib/validation";

interface VendorBillingDetailsProps {
  form: UseFormReturn<VendorFormValues>;
}

// Pre-render select options components
const VendorBranchOptionsContent = React.memo(() => (
  <>
    {VENDOR_BRANCHES.map(option => (
      <SelectItem key={option.id} value={option.id}>
        {option.label}
      </SelectItem>
    ))}
  </>
));
VendorBranchOptionsContent.displayName = "VendorBranchOptionsContent";

const CollectionOptionsContent = React.memo(() => (
  <>
    {VENDOR_COLLECTION_METHODS.map(option => (
      <SelectItem key={option.id} value={option.id}>
        {option.label}
      </SelectItem>
    ))}
  </>
));
CollectionOptionsContent.displayName = "CollectionOptionsContent";

const CountryOptionsContent = React.memo(() => (
  <SelectItem value="southAfrica">South Africa</SelectItem>
));
CountryOptionsContent.displayName = "CountryOptionsContent";

const ProvinceOptionsContent = React.memo(() => (
  <>
    {VENDOR_PROVINCES.map(province => (
      <SelectItem key={province} value={province}>
        {province}
      </SelectItem>
    ))}
  </>
));
ProvinceOptionsContent.displayName = "ProvinceOptionsContent";

const FormInput = React.memo(
  ({
    label,
    name,
    control,
    placeholder,
    type = "text",
    required,
    className,
  }: {
    label: string;
    name: keyof VendorFormValues;
    control: UseFormReturn<VendorFormValues>["control"];
    placeholder: string;
    type?: string;
    required?: boolean;
    className?: string;
  }) => (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>
            {label}
            {required && "*"}
          </FormLabel>
          <FormControl>
            <Input
              placeholder={placeholder}
              type={type}
              {...field}
              value={field.value?.toString() ?? ""}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
);
FormInput.displayName = "FormInput";

const FormSelect = React.memo(
  ({
    label,
    name,
    placeholder,
    optionsContent,
    control,
    required,
    className,
  }: {
    label: string;
    name: keyof VendorFormValues;
    placeholder: string;
    optionsContent: React.ReactNode;
    control: UseFormReturn<VendorFormValues>["control"];
    required?: boolean;
    className?: string;
  }) => {
    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className={className}>
            <FormLabel>
              {label}
              {required && "*"}
            </FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value?.toString()}
              defaultValue={field.value?.toString()}
            >
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>{optionsContent}</SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }
);
FormSelect.displayName = "FormSelect";

export const VendorBillingDetails: React.FC<VendorBillingDetailsProps> =
  React.memo(({ form }) => {
    const { control } = form;

    return (
      <div className="bg-white shadow-2xl shadow-black rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-6">Vendor Billing Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormSelect
            label="Branch"
            name="vendorBranch"
            placeholder="Select branch"
            optionsContent={<VendorBranchOptionsContent />}
            control={control}
            required
            className="col-span-2 md:col-span-1"
          />

          <FormSelect
            label="Collection Method"
            name="methodOfCollection"
            placeholder="Select method"
            optionsContent={<CollectionOptionsContent />}
            control={control}
            required
            className="col-span-2 md:col-span-1"
          />

          <FormInput
            label="Sales Rep"
            name="salesRep"
            control={control}
            placeholder="Sales rep name"
          />

          <FormInput
            label="Reference Number"
            name="referenceNumber"
            control={control}
            placeholder="Your reference"
          />

          <FormInput
            label="First Name"
            name="firstName"
            control={control}
            placeholder="First name"
            required
          />

          <FormInput
            label="Last Name"
            name="lastName"
            control={control}
            placeholder="Last name"
            required
          />

          <FormInput
            label="Company Name"
            name="companyName"
            control={control}
            placeholder="Company name"
            required
          />

          <FormSelect
            label="Country / Region"
            name="countryRegion"
            placeholder="Select country/region"
            optionsContent={<CountryOptionsContent />}
            control={control}
            required
          />

          <FormInput
            label="Street Address"
            name="streetAddress"
            control={control}
            placeholder="House number and street name"
            required
            className="col-span-2"
          />

          <FormInput
            label="Apartment, Suite, etc."
            name="apartmentSuite"
            control={control}
            placeholder="Apartment, suite, unit, etc."
            className="col-span-2"
          />

          <FormInput
            label="Town / City"
            name="townCity"
            control={control}
            placeholder="Town / City"
            required
          />

          <FormSelect
            label="Province"
            name="province"
            placeholder="Select province"
            optionsContent={<ProvinceOptionsContent />}
            control={control}
            required
          />

          <FormInput
            label="Postcode"
            name="postcode"
            control={control}
            placeholder="Postcode"
            required
          />

          <FormInput
            label="Phone"
            name="phone"
            control={control}
            placeholder="Phone number"
            type="tel"
            required
          />

          <FormInput
            label="Email Address"
            name="email"
            control={control}
            placeholder="Email address"
            type="email"
            required
          />
        </div>
      </div>
    );
  });

VendorBillingDetails.displayName = "VendorBillingDetails";

export default VendorBillingDetails;
