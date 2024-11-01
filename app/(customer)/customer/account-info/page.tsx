import { Suspense } from "react";
import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import AccountInfoForm from "./AccountInfoForm";
import BackToCustomerPage from "../_components/BackToCustomerButton";
import Header from "../_components/Header";

export default async function AccountPage() {
  try {
    const { user, session } = await validateRequest();

    if (!user || !session) {
      redirect("/login");
    }

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
          <AccountInfoForm />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error("Account page error:", error);

    // Return a more user-friendly error UI
    return (
      <div className="max-w-4xl container mx-auto py-8">
        <Header />
        <div className="flex flex-col items-center justify-center p-4 rounded-md bg-red-50 border border-red-200 mt-8">
          <h2 className="text-red-700 text-lg font-medium mb-2">
            Unable to load account information
          </h2>
          <p className="text-red-600 text-center mb-4">
            There was a problem loading your account information. Please try
            refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }
}
