import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import { getUserOrders } from "./actions";
import { OrderHistory } from "./OrderList";
import { Button } from "@/components/ui/button";
import { SquareArrowLeft } from "lucide-react";
import Link from "next/link";
import BackToCustomerPage from "../_components/BackToCustomerButton";

export const dynamic = "force-dynamic";

export default async function PreviousOrdersPage() {
  const session = await validateRequest();

  if (!session || !session.user?.id) {
    redirect("/login");
  }

  const { data: orders, error } = await getUserOrders(session.user.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-7">
        <span>
          <h1 className="text-2xl font-semibold text-gray-700  ">
            Previous Orders
          </h1>
        </span>
        <span className="p-2 hover:bg-neutral-100">
          <BackToCustomerPage />
        </span>
      </div>
      <OrderHistory orders={orders} error={error} />
    </div>
  );
}
