import { notFound } from "next/navigation";
import { getOrder } from "../../shopping/checkout/actions";
import { OrderSuccessView } from "./OrderSuccessView";

export default async function OrderSuccessPage() {
  // Fetch latest order
  const result = await getOrder();

  // Handle error states
  if (!result.success) {
    return (
      <div className="flex flex-col  items-center justify-center min-h-[50vh] bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white shadow-2xl shadow-black rounded-lg p-8">
          <h1 className="text-2xl font-semibold text-gray-900 text-center mb-4">
            Unable to Load Order
          </h1>
          <p className="text-gray-600 text-center mb-6">
            {result.error || "No recent orders found."}
          </p>
          <div className="flex justify-center">
            <a
              href="/customer/orders"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              View All Orders
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Validate order data
  if (!result.data) {
    return notFound();
  }

  return <OrderSuccessView order={result.data} />;
}
