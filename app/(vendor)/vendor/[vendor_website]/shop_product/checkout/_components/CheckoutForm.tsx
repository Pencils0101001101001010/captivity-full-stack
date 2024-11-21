"use client";
import React, { useEffect, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { createVendorOrder, getVendorUserDetails } from "../actions";
import { useRouter } from "next/navigation";
import { VendorFormValues } from "../_lib/types";
import { vendorFormSchema } from "../_lib/validation";
import useVendorCartStore from "../../cart/useCartStore";
import VendorBillingDetails from "./BillingDetails";
import { VendorAdditionalInformation } from "./AdditionalInformation";
import { VendorTermsAndConditions } from "./TermsAndConditions";
import VendorOrderSummary from "./OrderSummary";

// Memoize form default values
const defaultVendorFormValues: VendorFormValues = {
  vendorBranch: "",
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
} as const;

// Memoized components
const LoadingSpinner = React.memo(() => (
  <div className="flex justify-center items-center min-h-[200px]">
    <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
  </div>
));

const OrderNote = React.memo(() => (
  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
    <p className="text-sm text-yellow-800">
      Note: By placing your order, you agree to our vendor terms and conditions.
      A proforma invoice will be sent to your email address.
    </p>
  </div>
));

OrderNote.displayName = "OrderNote";

const NavigationButtons = React.memo(
  ({
    isLoading,
    isSubmitting,
    hasItems,
  }: {
    isLoading: boolean;
    isSubmitting: boolean;
    hasItems: boolean;
  }) => (
    <div className="flex justify-between items-center">
      <Button type="button" variant="outline" className="w-[200px]" asChild>
        <Link href="/vendor/shopping/cart">Go to Cart</Link>
      </Button>

      <Button
        type="submit"
        className="w-[200px]"
        disabled={isLoading || !hasItems || isSubmitting}
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
  )
);

NavigationButtons.displayName = "NavigationButtons";

const CheckoutForm = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isLoadingPreviousOrder, setIsLoadingPreviousOrder] =
    React.useState(true);

  // Memoize the form resolver
  const formResolver = useMemo(() => zodResolver(vendorFormSchema), []);

  // Initialize form with memoized values
  const form = useForm<VendorFormValues>({
    resolver: formResolver,
    defaultValues: defaultVendorFormValues,
    mode: "onChange",
  });

  // Use individual selectors for cart store
  const cart = useVendorCartStore(state => state.cart);
  const isLoading = useVendorCartStore(state => state.isLoading);
  const error = useVendorCartStore(state => state.error);
  const fetchCart = useVendorCartStore(state => state.fetchCart);
  const updateCartItemQuantity = useVendorCartStore(
    state => state.updateCartItemQuantity
  );
  const removeFromCart = useVendorCartStore(state => state.removeFromCart);
  const setCart = useVendorCartStore(state => state.setCart);

  // Memoize handlers
  const handleQuantityChange = useCallback(
    async (cartItemId: string, newQuantity: number) => {
      if (newQuantity < 1) return;
      await updateCartItemQuantity(cartItemId, newQuantity);
    },
    [updateCartItemQuantity]
  );

  const handleRemoveItem = useCallback(
    async (cartItemId: string) => {
      await removeFromCart(cartItemId);
      toast({
        title: "Item removed",
        description: "The item has been removed from your cart.",
      });
    },
    [removeFromCart, toast]
  );

  const onSubmit = useCallback(
    async (formData: VendorFormValues) => {
      if (isSubmitting) return; // Prevent multiple submissions

      setIsSubmitting(true);
      try {
        const result = await createVendorOrder(formData);
        if (result.success) {
          setCart(null);
          toast({
            title: "Success",
            description: "Order placed successfully!",
          });
          // Use replace instead of push to prevent back navigation to the checkout page
          router.replace(`/vendor/order-success/${result.data.id}`);
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to place order",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to submit order. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [router, setCart, toast, isSubmitting] // Add isSubmitting to dependencies
  );

  // Load user data
  useEffect(() => {
    let mounted = true;

    const loadUserData = async () => {
      if (!mounted) return;

      try {
        const result = await getVendorUserDetails();
        if (!mounted) return;

        if (result.success && result.data) {
          form.reset({
            ...defaultVendorFormValues,
            firstName: result.data.firstName || "",
            lastName: result.data.lastName || "",
            email: result.data.email || "",
            salesRep: result.data.salesRep || "",
            phone: result.data.phoneNumber?.toString() || "",
            companyName: result.data.companyName || "",
            countryRegion: result.data.country || "",
            streetAddress: result.data.streetAddress || "",
            apartmentSuite: result.data.addressLine2 || "",
            townCity: result.data.townCity || "",
            province: result.data.suburb || "",
            postcode: result.data.postcode || "",
          });
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        if (mounted) {
          setIsLoadingPreviousOrder(false);
        }
      }
    };

    loadUserData();
    return () => {
      mounted = false;
    };
  }, [form]);

  // Fetch cart
  useEffect(() => {
    if (!cart) {
      fetchCart();
    }
  }, [cart, fetchCart]);

  if (isLoadingPreviousOrder) {
    return <LoadingSpinner />;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-7xl mx-auto p-6 mb-16"
      >
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3 space-y-8">
            <VendorBillingDetails form={form} />
            <VendorAdditionalInformation form={form} />
            <VendorTermsAndConditions form={form} />
          </div>

          <div className="w-full lg:w-1/3">
            <VendorOrderSummary
              cart={cart}
              isLoading={isLoading}
              error={error}
              handleQuantityChange={handleQuantityChange}
              handleRemoveItem={handleRemoveItem}
            />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4">
          <OrderNote />
          <NavigationButtons
            isLoading={isLoading}
            isSubmitting={isSubmitting}
            hasItems={Boolean(cart?.vendorCartItems?.length)}
          />
        </div>
      </form>
    </Form>
  );
};

LoadingSpinner.displayName = "LoadingSpinner";

export default React.memo(CheckoutForm);
