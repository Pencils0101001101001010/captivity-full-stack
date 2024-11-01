import React from "react";
import { X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ErrorToastProps {
  title?: string;
  message?: string;
  onClose?: () => void;
}

const ErrorToast = ({
  title = "Error",
  message = "An unexpected error occurred. Please try again.",
  onClose,
}: ErrorToastProps) => {
  return (
    <Alert variant="destructive" className="animate-in slide-in-from-top-2">
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <AlertTitle className="text-red-600 font-semibold">
            {title}
          </AlertTitle>
          <AlertDescription className="mt-1 text-sm text-red-600">
            {message}
          </AlertDescription>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-red-600 hover:text-red-700 p-1 rounded-lg transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </Alert>
  );
};

export default ErrorToast;
