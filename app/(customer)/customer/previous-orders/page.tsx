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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
       <header className="text-center mb-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold mb-2">Instant Purchase Power</h1>
          <p className="text-xl mb-4">
            Unlock the Speed of Our Quick Order Page Today!
          </p>
          <Button
            asChild
            className="mt-2 bg-green-500 hover:bg-green-600 text-white"
          >
            <Link href={"/customer/shopping/express"}>Quick Order</Link>
          </Button>
        </header>
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
