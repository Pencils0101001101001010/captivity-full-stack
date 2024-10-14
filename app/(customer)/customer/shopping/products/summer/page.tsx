import React from "react";
import SummerCollections from "./SummerCollections";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const SummerCollectionPage = () => {
  return (
    <div>
      <Button asChild variant={"default"} className="ml-8 mt-2">
        <Link href={"/customer/shopping/products"}>Bact to express</Link>
      </Button>
      <h1>
        <SummerCollections />
      </h1>
    </div>
  );
};

export default SummerCollectionPage;
