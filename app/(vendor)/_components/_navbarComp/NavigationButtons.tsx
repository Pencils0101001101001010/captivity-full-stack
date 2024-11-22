import React from "react";
import Link from "next/link";
import { Home, Store } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavigationButtonsProps {
  vendorWebsite: string;
}

export const NavigationButtons = React.memo(
  ({ vendorWebsite }: NavigationButtonsProps) => (
    <div className="flex flex-col md:flex-row gap-2 md:gap-3">
      <Button
        variant="default"
        size="sm"
        className="w-full md:w-auto flex items-center gap-2"
        asChild
      >
        <Link href={`/vendor/${vendorWebsite}/welcome`}>
          <Home className="w-4 h-4" />
          <span className="hidden md:inline">Back</span>
        </Link>
      </Button>
      <Button
        variant="secondary"
        size="sm"
        className="w-full md:w-auto flex items-center gap-2"
        asChild
      >
        <Link href={`/vendor/${vendorWebsite}`}>
          <Store className="w-4 h-4" />
          <span className="hidden md:inline">Home</span>
        </Link>
      </Button>
      <Button
        variant="destructive"
        size="sm"
        className="w-full md:w-auto"
        asChild
      >
        <Link
          href={`/vendor/${vendorWebsite}/shopping/product_categories/summer`}
        >
          Shop
        </Link>
      </Button>
    </div>
  )
);

NavigationButtons.displayName = "NavigationButtons";
