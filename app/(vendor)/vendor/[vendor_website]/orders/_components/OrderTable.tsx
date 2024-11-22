import React from "react";
import { useSession } from "@/app/(vendor)/SessionProvider";

const OrderTable = () => {
  const session = useSession();
  // If not authenticated or not a vendor, don't render the form
  if (!session || session?.user?.role !== "VENDOR") {
    return null;
  }
  return (
    <div>
      <h1>Order</h1>
    </div>
  );
};

export default OrderTable;
