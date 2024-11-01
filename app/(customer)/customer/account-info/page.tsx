import { Suspense } from "react";
import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import AccountInfoForm from "./AccountInfoForm";
import BackToCustomerPage from "../_components/BackToCustomerButton";
import Header from "../_components/Header";

export default async function AccountPage() {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "CUSTOMER") {
    redirect("/login");
  }

  const userData = {
    firstName: user.firstName,
    lastName: user.lastName,
    displayName: user.displayName,
    email: user.email,
  };

  return (
    <div className="max-w-4xl container mx-auto py-8">
      <Header />
      <div className="flex items-center justify-between mb-7">
        <span>
          <h1 className="text-2xl font-semibold text-red-500">
            Account Settings
          </h1>
        </span>
        <span className="p-2 hover:bg-neutral-100">
          <BackToCustomerPage />
        </span>
      </div>
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-48">
            <p>Loading account information...</p>
          </div>
        }
      >
        <AccountInfoForm initialData={userData} />
      </Suspense>
    </div>
  );
}
