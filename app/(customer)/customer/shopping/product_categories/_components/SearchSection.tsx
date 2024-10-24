"use client";

import SearchField from "@/app/(customer)/_components/SearchField";
import { useSummerActions } from "@/app/(customer)/customer/_store/useSummerStore";
import React from "react";

const SearchSection = () => {
  const { setSearchQuery } = useSummerActions();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="mb-6">
      <SearchField onSearch={handleSearch} />
    </div>
  );
};

export default SearchSection;
