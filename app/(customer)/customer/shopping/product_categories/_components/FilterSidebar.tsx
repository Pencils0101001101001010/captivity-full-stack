"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const COLLECTIONS = [
  "Winter",
  "Summer",
  "African",
  "Baseball",
  "Camo",
  "Fashion",
  "Industrial",
  "Kids",
  "Leisure",
  "Signature",
  "Sport",
] as const;

type Collection = (typeof COLLECTIONS)[number];

const CollectionDropdown = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const getCurrentCollection = useCallback((): Collection | null => {
    if (!pathname) return null;
    const pathLower = pathname.toLowerCase();
    return COLLECTIONS.find(c => pathLower.includes(c.toLowerCase())) ?? null;
  }, [pathname]);

  const [selectedCollection, setSelectedCollection] =
    useState<Collection | null>(() => getCurrentCollection());

  const handleCollectionChange = (value: Collection) => {
    setSelectedCollection(value);
    setOpen(false);
    const basePath = "/customer/shopping/product_categories";
    const newPath = `${basePath}/${value.toLowerCase()}`;
    router.push(newPath, { scroll: false });
  };

  useEffect(() => {
    const currentCollection = getCurrentCollection();
    if (currentCollection !== selectedCollection) {
      setSelectedCollection(currentCollection);
    }
  }, [getCurrentCollection, selectedCollection]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedCollection ?? "Select collection..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search collections..." />
          <CommandEmpty>No collection found.</CommandEmpty>
          <CommandGroup>
            {COLLECTIONS.map(collection => (
              <CommandItem
                key={collection}
                value={collection}
                onSelect={() => handleCollectionChange(collection)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedCollection === collection
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                {collection}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CollectionDropdown;
