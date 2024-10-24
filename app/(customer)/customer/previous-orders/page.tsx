import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import { getUserOrders } from "./actions";
import { OrderHistory } from "./OrderList";

export const dynamic = "force-dynamic";

export default async function PreviousOrdersPage() {
  const session = await validateRequest();

  if (!session || !session.user?.id) {
    redirect("/login");
  }

  const { data: orders, error } = await getUserOrders(session.user.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold text-gray-200 mb-8">
        Previous Orders
      </h1>
      <OrderHistory orders={orders} error={error} />
    </div>
  );
}
