// app/account/page.tsx
import { Suspense } from "react";

import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import AccountInfoForm from "./AccountInfoForm";
import BackToCustomerPage from "../_components/BackToCustomerButton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Header from "../_components/Header";

export default async function AccountPage() {
  const { user, session } = await validateRequest();

  if (!user || !session) {
    redirect("/login");
  }

  return (
    <div className="max-w-4xl container mx-auto py-8">
      <Header />
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
