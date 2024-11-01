"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ErrorBoundary({
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
    <div className="p-4 rounded-md bg-red-50 border border-red-200">
      <h2 className="text-red-700 text-lg font-medium mb-2">
        Something went wrong
      </h2>
      <p className="text-red-600 mb-4">
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      <div className="flex gap-4">
        <Button onClick={reset} variant="outline">
          Try again
        </Button>
        <Button onClick={() => window.location.reload()} variant="destructive">
          Refresh page
        </Button>
      </div>
    </div>
  );
}
