import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import SummerLanding from "./SummerLanding";

const Page = () => {
  return (
    <div className="container mx-auto px-4">
      <div className="my-8">
        <Button asChild variant="outline" className="mb-4">
          <Link
            href="/customer/shopping/products"
            className="flex items-center"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
      <h1 className="text-5xl mt-3 font-bold mb-8 text-center">
        Summer Collection
      </h1>
      <SummerLanding />
    </div>
  );
};

export default Page;
