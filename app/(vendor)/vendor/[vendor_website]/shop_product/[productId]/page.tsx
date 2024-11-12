import { notFound } from "next/navigation";
import { fetchVendorProductById } from "./actions";
import VendorProductDetails from "./VendorProductDetails";

interface VendorProductPageProps {
  params: {
    productId: string;
    vendor_website: string;
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

  return (
    <VendorProductDetails product={result.data} vendorWebsite={vendorWebsite} />
  );
}
