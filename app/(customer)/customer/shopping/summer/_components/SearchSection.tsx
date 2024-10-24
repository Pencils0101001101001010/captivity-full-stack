"use client";

import SearchField from "@/app/(customer)/_components/SearchField";
import React from "react";

const SearchSection = () => {
  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
    // Implement your search logic here
  };

  return (
    <div className="mb-6">
      <SearchField onSearch={handleSearch} />
    </div>
  );
};

export default SearchSection;
