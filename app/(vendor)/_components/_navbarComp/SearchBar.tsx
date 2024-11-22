import React from "react";

export const SearchBar = React.memo(() => (
  <div className="flex w-full md:w-auto">
    <input
      type="text"
      placeholder="Search for product"
      className="px-4 py-2 w-full md:w-[200px] lg:w-[300px] rounded-l-md border border-r-0 border-input bg-background text-foreground"
    />
    <button className="px-4 py-2 bg-primary text-primary-foreground rounded-r-md hover:bg-primary/90 transition-colors">
      Search
    </button>
  </div>
));

SearchBar.displayName = "SearchBar";
