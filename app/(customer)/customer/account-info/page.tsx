// app/account/page.tsx
import { Suspense } from "react";

import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import AccountInfoForm from "./AccountInfoForm";

export default async function AccountPage() {
  const { user, session } = await validateRequest();

  if (!user || !session) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <AccountInfoForm />
      </Suspense>
    </div>
  );
}
