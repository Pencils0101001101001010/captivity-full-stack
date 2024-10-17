"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { formSchema, FormValues } from "./validations";
import { CartData } from "@/app/(customer)/types";
import { useToast } from "@/hooks/use-toast";
import { useSubmitOrder } from "./useSubmitOrder";
import { useCart } from "../cart/useCartHooks";
import { useRouter } from "next/navigation";

interface CheckoutFormProps {
  cartData: CartData;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ cartData }) => {
  const router = useRouter();
  const { toast } = useToast();
  const {
    loading: submitLoading,
    error: submitError,
    data: submitData,
    submit,
  } = useSubmitOrder();
  const {
    cart,
    loading: cartLoading,
    error: cartError,
    refreshCart,
  } = useCart();
  const [retryCount, setRetryCount] = useState(0);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      captivityBranch: "",
      methodOfCollection: "",
      salesRep: "",
      referenceNumber: "",
      firstName: "",
      lastName: "",
      companyName: "",
      countryRegion: "",
      streetAddress: "",
      apartmentSuite: "",
      townCity: "",
      province: "",
      postcode: "",
      phone: "",
      email: "",
      orderNotes: "",
      agreeTerms: false,
      receiveEmailReviews: false,
    },
  });

  useEffect(() => {
    if (cartError && retryCount < 3) {
      const timer = setTimeout(() => {
        refreshCart();
        setRetryCount(prev => prev + 1);
      }, 2000); // Retry after 2 seconds
      return () => clearTimeout(timer);
    }
  }, [cartError, retryCount, refreshCart]);

  const onSubmit = async (formData: FormValues) => {
    if (!cart) {
      toast({
        title: "Error",
        description: "Unable to submit order. Cart data is not available.",
        variant: "destructive",
      });
      return;
    }

    try {
      await submit(formData, cart);
      if (submitData) {
        toast({
          title: "Order Submitted Successfully",
          description: `Your order #${submitData.id} has been placed.`,
          duration: 5000,
        });
        router.push("/customer");
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      toast({
        title: "Error",
        description:
          "There was a problem submitting your order. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (cartLoading) {
    return <div>Loading cart data...</div>;
  }

  if (cartError) {
    return (
      <div>
        <p>Error loading cart data. Please try again later.</p>
        <Button
          onClick={() => {
            setRetryCount(0);
            refreshCart();
          }}
        >
          Retry
        </Button>
      </div>
    );
  }

  if (!cart) {
    return <div>No items in cart. Please add items before checking out.</div>;
  }

  const calculateSubtotal = (price: number, quantity: number) => {
    return (price * quantity).toFixed(2);
  };

  const calculateTotal = () => {
    return cartData.extendedItems
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-7xl mx-auto p-6"
      >
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Billing Details, Additional Information, Terms */}
          <div className="w-full lg:w-2/3 space-y-8">
            {/* Billing Details Section */}
            <div className="bg-white shadow-2xl shadow-black rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-6">Billing Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="captivityBranch"
                  render={({ field }) => (
                    <FormItem className="col-span-2 md:col-span-1">
                      <FormLabel>Captivity Branch*</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select branch" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="branch1">Branch 1</SelectItem>
                          <SelectItem value="branch2">Branch 2</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="methodOfCollection"
                  render={({ field }) => (
                    <FormItem className="col-span-2 md:col-span-1">
                      <FormLabel>Collection Method*</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pickup">Pick-up</SelectItem>
                          <SelectItem value="delivery">Delivery</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="salesRep"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sales Rep (optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Sales rep name"
                          {...field}
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="referenceNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reference Number (optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your reference"
                          {...field}
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name*</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="First name"
                          {...field}
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name*</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Last name"
                          {...field}
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name*</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Company name"
                          {...field}
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="countryRegion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country / Region*</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select country/region" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="southAfrica">
                            South Africa
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="streetAddress"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Street Address*</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="House number and street name"
                          {...field}
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="apartmentSuite"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Apartment, Suite, etc. (optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Apartment, suite, unit, etc."
                          {...field}
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="townCity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Town / City*</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Town / City"
                          {...field}
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="province"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Province*</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select province" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="gauteng">Gauteng</SelectItem>
                          <SelectItem value="westernCape">
                            Western Cape
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="postcode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postcode / ZIP*</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Postcode / ZIP"
                          {...field}
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone*</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="Phone number"
                          {...field}
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address*</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Email address"
                          {...field}
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Additional Information Section */}
            <div className="bg-white shadow-2xl shadow-black rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-6">
                Additional Information
              </h3>
              <FormField
                control={form.control}
                name="orderNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order Notes (optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Notes about your order, e.g. special notes for delivery"
                        {...field}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Terms and Conditions Section */}
            <div className="bg-white shadow-2xl shadow-black rounded-lg p-6">
              <p className="mb-4 text-sm">Pay upon Proforma Invoice receipt</p>
              <p className="mb-6 text-sm">
                Your personal data will be used to process your order, support
                your experience throughout this website, and for other purposes
                described in our privacy policy.
              </p>

              <FormField
                control={form.control}
                name="receiveEmailReviews"
                render={({ field }) => (
                  <FormItem className="flex items-start space-x-3 space-y-0 mb-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm">
                        Check here to receive an email to review our products.
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="agreeTerms"
                render={({ field }) => (
                  <FormItem className="flex items-start space-x-3 space-y-0 mb-6">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm">
                        I have read and agree to the website terms and
                        conditions*
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-lg p-6 sticky top-6 shadow-2xl shadow-black">
              <h3 className="text-xl font-semibold mb-6">Order Summary</h3>
              <div className="space-y-4">
                {cartData.extendedItems.map(item => (
                  <div
                    key={`${item.productId}-${item.variationId}`}
                    className="flex items-center space-x-4 pb-4 border-b"
                  >
                    <Image
                      src={item.image}
                      alt={item.productName}
                      width={50}
                      height={50}
                      className="mr-4 rounded-md"
                    />
                    <div className="flex-grow">
                      <h4 className="font-semibold text-sm">
                        {item.productName}
                      </h4>
                      <p className="text-xs text-gray-600">
                        {item.variationName}
                      </p>
                      <p className="text-xs">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">
                        R{item.price.toFixed(2)} each
                      </p>
                      <p className="text-xs text-gray-600">
                        Subtotal: R
                        {calculateSubtotal(item.price, item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-4 font-semibold">
                  <span>Total:</span>
                  <span className="text-lg">R{calculateTotal()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full mt-8 py-3 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-300"
          disabled={submitLoading}
        >
          {submitLoading ? "Submitting Order..." : "Place Order"}
        </Button>

        {submitError && (
          <p className="mt-4 text-red-600 text-center">{submitError}</p>
        )}
      </form>
    </Form>
  );
};

export default CheckoutForm;