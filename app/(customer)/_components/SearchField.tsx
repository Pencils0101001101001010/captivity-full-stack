"use client";

import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useSummerActions } from "../customer/_store/useSummerStore";
import { useWinterActions } from "../customer/_store/useWinterStore";

export default function SearchField() {
  const pathname = usePathname() || '';
  const [searchValue, setSearchValue] = useState("");
  const { setSearchQuery: setSummerSearch } = useSummerActions();
  const { setSearchQuery: setWinterSearch } = useWinterActions();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const query = e.target.value;
    setSearchValue(query);
    
    if (pathname.includes("/summer")) {
      setSummerSearch(query);
    } else if (pathname.includes("/winter")) {
      setWinterSearch(query);
    }
  }

  // Reset search when changing collections
  useEffect(() => {
    setSearchValue("");
    if (pathname.includes("/summer")) {
      setSummerSearch("");
    } else if (pathname.includes("/winter")) {
      setWinterSearch("");
    }
  }, [pathname, setSummerSearch, setWinterSearch]);

  return (
    <form onSubmit={handleSubmit}>
      <div className="relative">
        <Input
          name="q"
          value={searchValue}
          placeholder="Search"
          className="pe-10 border-4 outline-none"
          onChange={handleChange}
        />
        <SearchIcon className="absolute right-3 top-1/2 size-5 -translate-y-1/2 transform text-muted-foreground" />
      </div>
    </form>
  );
}