// page.tsx
import { Suspense } from "react";
import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import AccountInfoForm from "./AccountInfoForm";
import BackToCustomerPage from "../_components/BackToCustomerButton";
import { Button } from "@/components/ui/button";
import Header from "../_components/Header";

async function getUser(userId: string) {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      firstName: true,
      lastName: true,
      displayName: true,
      email: true,
      phoneNumber: true,
      streetAddress: true,
      addressLine2: true,
      suburb: true,
      townCity: true,
      postcode: true,
      country: true,
      position: true,
      natureOfBusiness: true,
      currentSupplier: true,
      otherSupplier: true,
      resellingTo: true,
      salesRep: true,
      website: true,
      companyName: true,
      ckNumber: true,
      vatNumber: true,
    },
  });
}

export default async function AccountPage() {
  const { user: sessionUser } = await validateRequest();

  if (!sessionUser) {
    redirect("/login");
  }

  // Fetch full user data from Prisma
  const user = await getUser(sessionUser.id);

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="max-w-4xl container mx-auto py-8">
      <Header />
      <div className="flex items-center justify-between mb-7">
        <span>
          <h1 className="text-2xl font-semibold text-gray-700">
            Account Settings
          </h1>
        </span>
        <span className="p-2 hover:bg-neutral-100">
          <BackToCustomerPage />
        </span>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <AccountInfoForm userId={user.id} initialData={user} />
      </Suspense>
    </div>
  );
}
