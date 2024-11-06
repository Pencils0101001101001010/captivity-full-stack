"use client";

import { useEffect } from "react";
import { ProductTable } from "../_components/UniversalTable";
import { useCollectionsStore } from "../useCollectionsStore";

export default function ProductsPage() {
  const { collections, isLoading, fetchCollections } = useCollectionsStore();

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  return (
    <div className="container py-6 ">
      <ProductTable products={collections.summer || []} isLoading={isLoading} />
    </div>
  );
}
