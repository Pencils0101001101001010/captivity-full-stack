import { notFound } from "next/navigation";
import { fetchVendorProductById } from "./actions";
import VendorProductDetails from "./VendorProductDetails";
import { VendorProductWithRelations, VendorDynamicPricingRule } from "./types";

interface VendorProductPageProps {
  params: {
    productId: string;
    vendor_website: string;
  };
}

// Type guard to check if the pricing type is valid
function isValidPricingType(
  type: string
): type is "fixed_price" | "percentage" {
  return type === "fixed_price" || type === "percentage";
}

// Function to validate and transform the dynamic pricing data
function validateDynamicPricing(pricing: any[]): VendorDynamicPricingRule[] {
  return pricing.map(rule => {
    if (!isValidPricingType(rule.type)) {
      throw new Error(`Invalid pricing type: ${rule.type}`);
    }
    return {
      id: rule.id,
      vendorProductId: rule.vendorProductId,
      type: rule.type,
      from: rule.from,
      to: rule.to,
      amount: rule.amount,
    };
  });
}

// Function to validate and transform the product data
function validateProductData(data: any): VendorProductWithRelations {
  return {
    ...data,
    dynamicPricing: validateDynamicPricing(data.dynamicPricing),
    // Ensure other required properties are present
    variations: data.variations || [],
    featuredImage: data.featuredImage || null,
  };
}

export default async function VendorProductPage({
  params,
}: VendorProductPageProps) {
  const { productId, vendor_website: vendorWebsite } = params;

  if (!productId || !vendorWebsite) {
    notFound();
  }

  const result = await fetchVendorProductById(productId);

  if (!result.success) {
    // Handle various error cases
    if (result.error === "Unauthorized. Please log in.") {
      return (
        <div className="flex items-center justify-center min-h-[400px] text-lg">
          Please log in to view this product.
        </div>
      );
    }

    if (result.error === "Unauthorized. Vendor access required.") {
      return (
        <div className="flex items-center justify-center min-h-[400px] text-lg text-red-500">
          Only vendors can access this page.
        </div>
      );
    }

    if (
      result.error === "Unauthorized. This product belongs to another vendor."
    ) {
      return (
        <div className="flex items-center justify-center min-h-[400px] text-lg text-red-500">
          You dont have permission to view this product.
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center min-h-[400px] text-lg text-red-500">
        Error: {result.error}
      </div>
    );
  }

  try {
    // Validate and transform the data
    const validatedData = validateProductData(result.data);

    return (
      <VendorProductDetails
        product={validatedData}
        vendorWebsite={vendorWebsite}
      />
    );
  } catch (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-lg text-red-500">
        Error: Invalid product data format
      </div>
    );
  }
}
