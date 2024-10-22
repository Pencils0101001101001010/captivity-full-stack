"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { formSchema, FormValues } from "./validations";
import { useToast } from "@/hooks/use-toast";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import useCartStore from "../../_store/useCartStore";

const CheckoutForm = () => {
  const {
    cart,
    isLoading,
    error,
    fetchCart,
    updateCartItemQuantity,
    removeFromCart,
  } = useCartStore();
  const { toast } = useToast();

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
    fetchCart();
  }, [fetchCart]);

  const calculateSubtotal = (quantity: number, price: number) => {
    return quantity * price;
  };

  const calculateTotal = () => {
    if (!cart?.cartItems) return 0;
    return cart.cartItems.reduce((total, item) => {
      return (
        total +
        calculateSubtotal(item.quantity, item.variation.product.sellingPrice)
      );
    }, 0);
  };

  const handleQuantityChange = async (
    cartItemId: string,
    newQuantity: number
  ) => {
    if (newQuantity < 1) return;
    await updateCartItemQuantity(cartItemId, newQuantity);
  };

  const handleRemoveItem = async (cartItemId: string) => {
    await removeFromCart(cartItemId);
    toast({
      title: "Item removed",
      description: "The item has been removed from your cart.",
    });
  };

  const onSubmit = async (formData: FormValues) => {
    if (!cart?.cartItems?.length) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checking out.",
        variant: "destructive",
      });
      return;
    }
    console.log(formData);
    // Add your checkout logic here
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-7xl mx-auto p-6 mb-16"
      >
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Billing Details */}
          <div className="w-full lg:w-2/3 space-y-8">
            {/* Billing Details Section */}
            <div className="bg-white shadow-2xl shadow-black rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-6">Billing Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Branch Selection */}
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

                {/* Collection Method */}
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

                {/* Sales Rep */}
                <FormField
                  control={form.control}
                  name="salesRep"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sales Rep (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Sales rep name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Reference Number */}
                <FormField
                  control={form.control}
                  name="referenceNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reference Number (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Your reference" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Personal Information */}
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="First name" {...field} />
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
                        <Input placeholder="Last name" {...field} />
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
                        <Input placeholder="Company name" {...field} />
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
                          <SelectTrigger>
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

                {/* Address Information */}
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
                        <Input placeholder="Town / City" {...field} />
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
                          <SelectTrigger>
                            <SelectValue placeholder="Select province" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="gauteng">Gauteng</SelectItem>
                          <SelectItem value="westernCape">
                            Western Cape
                          </SelectItem>
                          <SelectItem value="kwazuluNatal">
                            KwaZulu-Natal
                          </SelectItem>
                          <SelectItem value="easternCape">
                            Eastern Cape
                          </SelectItem>
                          <SelectItem value="freeState">Free State</SelectItem>
                          <SelectItem value="limpopo">Limpopo</SelectItem>
                          <SelectItem value="mpumalanga">Mpumalanga</SelectItem>
                          <SelectItem value="northWest">North West</SelectItem>
                          <SelectItem value="northernCape">
                            Northern Cape
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
                        <Input placeholder="Postcode / ZIP" {...field} />
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
                        className="min-h-[100px]"
                        {...field}
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
                      <FormLabel>
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
                  <FormItem className="flex items-start space-x-3 space-y-0 mb-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
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

              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                </div>
              ) : error ? (
                <div className="text-red-500 text-center py-4">{error}</div>
              ) : cart?.cartItems && cart.cartItems.length > 0 ? (
                <div className="space-y-6">
                  {cart.cartItems.map(item => (
                    <div
                      key={item.id}
                      className="flex items-start border-b pb-4"
                    >
                      <div className="relative h-16 w-16 rounded-md overflow-hidden">
                        <Image
                          src={
                            item.variation.variationImageURL || // Try variation image first
                            item.variation.product.featuredImage?.medium || // Then featured image
                            "/api/placeholder/100/100" // Fallback to placeholder
                          }
                          alt={item.variation.product.productName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-grow ml-4">
                        <h4 className="font-semibold text-sm">
                          {item.variation.product.productName}
                        </h4>
                        <p className="text-xs text-gray-600">
                          Size: {item.variation.size}, Color:{" "}
                          {item.variation.color}
                        </p>
                        <div className="flex items-center mt-2">
                          <select
                            value={item.quantity}
                            onChange={e =>
                              handleQuantityChange(
                                item.id,
                                Number(e.target.value)
                              )
                            }
                            className="text-sm border rounded px-2 py-1 mr-4"
                          >
                            {[...Array(item.variation.quantity)].map((_, i) => (
                              <option key={i + 1} value={i + 1}>
                                {i + 1}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm">
                          R{item.variation.product.sellingPrice.toFixed(2)} each
                        </p>
                        <p className="text-xs text-gray-600">
                          Subtotal: R
                          {calculateSubtotal(
                            item.quantity,
                            item.variation.product.sellingPrice
                          ).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-sm mb-2">
                      <span>Subtotal:</span>
                      <span>R{calculateTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm mb-2">
                      <span>Shipping:</span>
                      <span>Calculated at next step</span>
                    </div>
                    <div className="flex justify-between items-center font-semibold text-lg mt-4">
                      <span>Total:</span>
                      <span>R{calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">Your cart is empty</p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => window.history.back()}
                  >
                    Continue Shopping
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button Section */}
        <div className="mt-8 flex flex-col gap-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              Note: By placing your order, you agree to our terms and
              conditions. A proforma invoice will be sent to your email address.
            </p>
          </div>

          <div className="flex justify-between items-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
              className="w-[200px]"
            >
              Return to Cart
            </Button>

            <Button
              type="submit"
              className="w-[200px]"
              disabled={isLoading || !cart?.cartItems?.length}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>Place Order</>
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default CheckoutForm;
