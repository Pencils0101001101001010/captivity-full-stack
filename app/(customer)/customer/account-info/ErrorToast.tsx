"use client";

import React from "react";
import { X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

interface ErrorToastProps {
  title?: string;
  description?: string;
}

export const ErrorToast = React.forwardRef<HTMLDivElement, ErrorToastProps>(
  ({ title = "Error", description = "An unexpected error occurred" }, ref) => {
    const { dismiss } = useToast();

    return (
      <Alert ref={ref} variant="destructive" className="group relative">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <AlertTitle>{title}</AlertTitle>
            {description && (
              <AlertDescription className="mt-1">
                {description}
              </AlertDescription>
            )}
          </div>
          <button
            onClick={() => dismiss()}
            className="text-destructive-foreground/50 hover:text-destructive-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </Alert>
    );
  }
);

ErrorToast.displayName = "ErrorToast";
