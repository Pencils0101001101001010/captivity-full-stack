"use client";

import { Input } from "@/components/ui/input";
import { SearchIcon, XIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";

interface SearchFieldProps {
  onSearch?: (query: string) => void;
}

export default function SearchField({ onSearch }: SearchFieldProps) {
  const router = useRouter();
  const pathname = usePathname() || "";
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams?.get("q") ?? "");

  // Update local state when URL search param changes
  useEffect(() => {
    setValue(searchParams?.get("q") ?? "");
  }, [searchParams]);

  const debouncedSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }

    const newPath = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname;
    router.push(newPath);

    if (onSearch) {
      onSearch(term);
    }
  }, 300);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    debouncedSearch(newValue);
  };

  const handleClear = () => {
    setValue("");
    debouncedSearch("");
    router.push(pathname);
  };

  return (
    <div className="relative">
      <Input
        value={value}
        onChange={handleChange}
        placeholder="Search"
        className="pe-10"
      />
      {value ? (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-500 hover:text-gray-700"
        >
          <XIcon className="size-4" />
        </button>
      ) : (
        <SearchIcon className="absolute right-3 top-1/2 size-5 -translate-y-1/2 transform text-muted-foreground" />
      )}
    </div>
  );
}
