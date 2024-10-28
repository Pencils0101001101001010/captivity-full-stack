// app/account/page.tsx
import { Suspense } from "react";

import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import AccountInfoForm from "./AccountInfoForm";
import BackToCustomerPage from "../_components/BackToCustomerButton";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function AccountPage() {
  const { user, session } = await validateRequest();

  if (!user || !session) {
    redirect("/login");
  }

  return (
    <div className="max-w-4xl container mx-auto py-8">
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
            Account Settings
          </h1>
        </span>
        <span className="p-2 hover:bg-neutral-100">
          <BackToCustomerPage />
        </span>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <AccountInfoForm />
      </Suspense>
    </div>
  );
}
