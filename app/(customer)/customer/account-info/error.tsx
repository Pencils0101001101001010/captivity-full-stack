// app/customer/account-info/error.tsx
"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Header from "../_components/Header";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Account page error:", error);
  }, [error]);

  return (
    <div className="max-w-4xl container mx-auto py-8">
      <Header />
      <div className="flex flex-col items-center justify-center p-4 rounded-md bg-red-50 border border-red-200 mt-8">
        <h2 className="text-red-700 text-lg font-medium mb-2">
          Something went wrong
        </h2>
        <p className="text-red-600 text-center mb-4">
          There was a problem with your account settings. Please try again.
        </p>
        <div className="flex gap-4">
          <Button onClick={() => reset()} variant="outline">
            Try again
          </Button>
          <Button
            onClick={() => window.location.reload()}
            variant="destructive"
          >
            Refresh page
          </Button>
        </div>
      </div>
    </div>
  );
}
