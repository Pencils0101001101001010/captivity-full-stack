"use client";

import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserTableSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams?.get("q") ?? "");

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    if (value) {
      params.set("q", value);
    } else {
      params.delete("q");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="relative">
      <Input
        name="q"
        placeholder="Search users..."
        className="pe-10"
        value={searchQuery}
        onChange={e => {
          setSearchQuery(e.target.value);
          handleSearch(e.target.value);
        }}
      />
      <SearchIcon className="absolute right-3 top-1/2 size-5 -translate-y-1/2 transform text-muted-foreground" />
    </div>
  );
}
