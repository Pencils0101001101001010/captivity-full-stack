"use client";

import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import React from "react";

interface SearchFieldProps {
  onSearch: (query: string) => void;
}

export default function SearchField({ onSearch }: SearchFieldProps) {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    onSearch(e.target.value);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="relative">
        <Input
          name="q"
          placeholder="Search"
          className="pe-10"
          onChange={handleChange}
        />
        <SearchIcon className="absolute right-3 top-1/2 size-5 -translate-y-1/2 transform text-muted-foreground" />
      </div>
    </form>
  );
}