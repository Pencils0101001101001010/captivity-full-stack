import { fetchVendorCustomers } from "./actions";
import { VendorCustomersTable } from "./VendorCustomersTable";

export default async function VendorCustomersPage() {
  // Fetch initial data server-side
  const initialData = await fetchVendorCustomers();

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Vendor Customers</h1>
        <p className="text-sm text-gray-600">
          Manage your store customer accounts
        </p>
      </div>

      <VendorCustomersTable initialData={initialData} />
    </div>
  );
}
