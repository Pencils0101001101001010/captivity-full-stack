"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { formSchema, FormValues } from "./_lib/validations";
import { useToast } from "@/hooks/use-toast";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import useCartStore from "../../_store/useCartStore";
import { BillingDetails } from "./_components/BillingDetails";
import { AdditionalInformation } from "./_components/AdditionalInformation";
import { TermsAndConditions } from "./_components/TermsAndConditions";
import OrderSummary from "./_components/OrderSummary";

const CheckoutForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
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

    setIsSubmitting(true);
    try {
      const calculateTotal = () => {
        if (!cart?.cartItems) return 0;
        return cart.cartItems.reduce((total, item) => {
          return total + item.quantity * item.variation.product.sellingPrice;
        }, 0);
      };

      const orderData = {
        ...formData,
        cartItems: cart.cartItems,
        orderTotal: calculateTotal(),
      };

      console.log("Complete Order Data:", orderData);
      // Add your checkout logic here
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-7xl mx-auto p-6 mb-16"
      >
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Form Sections */}
          <div className="w-full lg:w-2/3 space-y-8">
            <BillingDetails form={form} />
            <AdditionalInformation form={form} />
            <TermsAndConditions form={form} />
          </div>

          {/* Right Column: Order Summary */}
          <div className="w-full lg:w-1/3">
            <OrderSummary
              cart={cart}
              isLoading={isLoading}
              error={error}
              handleQuantityChange={handleQuantityChange}
              handleRemoveItem={handleRemoveItem}
            />
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
            <Button type="button" variant="outline" className="w-[200px]">
              <Link href={"/customer/shopping/cart"}>Go to Cart</Link>
            </Button>

            <Button
              type="submit"
              className="w-[200px]"
              disabled={isLoading || !cart?.cartItems?.length || isSubmitting}
            >
              {isSubmitting ? (
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
