"use client";

import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useSummerActions } from "../customer/_store/useSummerStore";
import { useWinterActions } from "../customer/_store/useWinterStore";
import { useFashionActions } from "../customer/_store/useFashionStore";
import { useLeisureActions } from "../customer/_store/useLeisureStore";
import { useSignatureActions } from "../customer/_store/useSignatureStore";
import { useSportActions } from "../customer/_store/useSportStore";


export default function SearchField() {
  const pathname = usePathname() || "";
  const [searchValue, setSearchValue] = useState("");
  const { setSearchQuery: setSummerSearch } = useSummerActions();
  const { setSearchQuery: setWinterSearch } = useWinterActions();
  const { setSearchQuery: setFashionSearch } = useFashionActions();
  const { setSearchQuery: setLeisureSearch } = useLeisureActions();
  const { setSearchQuery: setSignatureSearch } = useSignatureActions();
  const { setSearchQuery: setSportSearch } = useSportActions();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const query = e.target.value;
    setSearchValue(query);

    if (pathname.includes("/fashion")) {
      setFashionSearch(query);
    } else if (pathname.includes("/summer")) {
      setSummerSearch(query);
    } else if (pathname.includes("/winter")) {
      setWinterSearch(query);
    } else if (pathname.includes("/leisure")) {
      setLeisureSearch(query);
    } else if (pathname.includes("/signature")) {
      setSignatureSearch(query);
    } else if (pathname.includes("/sport")) {
      setSportSearch(query);
    }
  }

  // Reset search when changing collections
  useEffect(() => {
    setSearchValue("");
    if (pathname.includes("/fashion")) {
      setFashionSearch("");
    } else if (pathname.includes("/summer")) {
      setSummerSearch("");
    } else if (pathname.includes("/winter")) {
      setWinterSearch("");
    } else if (pathname.includes("/leisure")) {
      setLeisureSearch("");
    } else if (pathname.includes("/signature")) {
      setSignatureSearch("");
    } else if (pathname.includes("/sport")) {
      setSportSearch("");
    }
  }, [pathname, setSummerSearch, setWinterSearch, setFashionSearch, setLeisureSearch, setSignatureSearch, setSportSearch]);

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
