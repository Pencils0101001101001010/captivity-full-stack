import React from "react";
import { validateRequest } from "@/auth";
import OrderTable from "./_components/OrderTable";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { User } from "@prisma/client";

interface ExtendedUser extends User {
  storeSlug: string | null;
}

export default async function OrdersPage() {
  const auth = await validateRequest();
  const user = auth.user as ExtendedUser | null;

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "VENDOR") {
    return (
      <div className="container mx-auto p-6">
        <Card className="max-w-4xl mx-auto p-6">
          <h1 className="text-xl font-semibold text-destructive mb-2">
            Access Denied
          </h1>
          <p className="text-muted-foreground">
            This section is restricted to vendor access only. If you need to
            view your orders, please visit your customer dashboard.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-card-foreground">
            Vendor Orders Dashboard
          </h1>
        </div>
        <OrderTable />
      </div>
    </div>
  );
}
