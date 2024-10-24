"use client";

import SearchField from "@/app/(customer)/_components/SearchField";
import React from "react";
import { useSummerActions } from "../../../_store/useSummerStore";

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
