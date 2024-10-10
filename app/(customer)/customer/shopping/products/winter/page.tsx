import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import WinterLanding from "./WinterLanding";

const Page = () => {
  return (
    <>
      <div className="container mx-auto px-4">
        <div className="my-8">
          <Button asChild variant="default" className="mb-4">
            <Link
              href="/customer/shopping/products"
              className="flex items-center"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Express Shop
            </Link>
          </Button>
          <h1 className="text-5xl font-bold mb-8 text-center">
            Winter Collection
          </h1>
        </div>
      </div>
      <WinterLanding />
    </>
  );
};

export default Page;
