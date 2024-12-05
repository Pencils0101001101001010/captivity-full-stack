"use client";

import React, { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
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
import { Button } from "@/components/ui/button";
import { useFilterStore } from "../../../_store/useFilterStore";
import { COLOR_MAPPINGS } from "./ColorMapping";
import { ProductWithRelations } from "../types";
import { Variation } from "@prisma/client";

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

interface FilterSidebarProps {
  products?: ProductWithRelations[];
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ products = [] }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [isColorOpen, setIsColorOpen] = useState(false);
  const [isSizeOpen, setIsSizeOpen] = useState(false);

  const { selectedColors, selectedSizes, toggleColor, toggleSize } =
    useFilterStore();

  // Category selection logic
  const getCurrentCollection = useCallback((): Collection | null => {
    if (!pathname) return null;
    const pathLower = pathname.toLowerCase();
    return COLLECTIONS.find(c => pathLower.includes(c.toLowerCase())) ?? null;
  }, [pathname]);

  const [selectedCollection, setSelectedCollection] =
    useState<Collection | null>(() => getCurrentCollection());

  const handleCollectionChange = (value: Collection) => {
    setSelectedCollection(value);
    setCategoryOpen(false);
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

  // Get unique colors and sizes from products
  const { uniqueColors, uniqueSizes } = React.useMemo(() => {
    const colors = new Set<string>();
    const multiColorSet = new Set<string>();
    const sizes = new Set<string>();

    if (Array.isArray(products)) {
      products.forEach(product => {
        if (product.variations) {
          product.variations.forEach((variation: Variation) => {
            if (variation.color) {
              colors.add(variation.color);
              const colorValue =
                COLOR_MAPPINGS[
                  variation.color.toLowerCase().replace(/[^a-z0-9]/g, "_")
                ];
              if (
                typeof colorValue === "object" &&
                colorValue.colors &&
                colorValue.colors.length > 1
              ) {
                multiColorSet.add(variation.color);
              }
            }
            if (variation.size) sizes.add(variation.size);
          });
        }
      });
    }

    // Sort colors with single colors first, then multi-colors
    const sortedColors = Array.from(colors).sort((a, b) => {
      const aIsMulti = multiColorSet.has(a);
      const bIsMulti = multiColorSet.has(b);
      if (aIsMulti !== bIsMulti) return aIsMulti ? 1 : -1;
      return a.localeCompare(b);
    });

    return {
      uniqueColors: sortedColors,
      uniqueSizes: Array.from(sizes).sort(),
    };
  }, [products]);

  const getSwatchStyle = (colorName: string): React.CSSProperties => {
    const normalizedName = colorName.toLowerCase().replace(/[^a-z0-9]/g, "_");
    const colorValue = COLOR_MAPPINGS[normalizedName];

    if (typeof colorValue === "string") {
      return { backgroundColor: colorValue };
    }

    if (typeof colorValue === "object" && colorValue.colors) {
      if (colorValue.colors.length === 1) {
        return { backgroundColor: colorValue.colors[0] };
      }

      const segmentSize = 360 / colorValue.colors.length;
      const gradientStops = colorValue.colors.map((color, index) => {
        const startAngle = index * segmentSize;
        const endAngle = (index + 1) * segmentSize;
        return `${color} ${startAngle}deg ${endAngle}deg`;
      });

      return {
        background: `conic-gradient(${gradientStops.join(", ")})`,
        border: "1px solid #e5e7eb",
      };
    }

    return { backgroundColor: colorName };
  };

  return (
    <div className="space-y-6">
      {/* Category Selection */}
      <div className="mb-6">
        <h2 className="text-sm font-medium mb-2">Category</h2>
        <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={categoryOpen}
              className="mb-4 flex w-full items-center justify-between bg-white px-4 py-2 shadow-2xl shadow-black transition-transform duration-300 hover:scale-95"
            >
              {selectedCollection ?? "Select collection..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-2 shadow-2xl min-w-[300px] max-h-[300px] overflow-y-scroll">
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
      </div>

      {/* Color Filter */}
      <div className="mb-6">
        <h2 className="text-sm font-medium mb-2">Color</h2>
        <Popover open={isColorOpen} onOpenChange={setIsColorOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="mb-4 flex w-full items-center justify-between bg-white px-4 py-2 shadow-2xl shadow-black transition-transform duration-300 hover:scale-95"
            >
              <div className="flex items-center gap-2">
                {selectedColors.length > 0 ? (
                  <div className="flex items-center gap-1">
                    <div className="flex -space-x-1">
                      {selectedColors.slice(0, 3).map(color => (
                        <div
                          key={color}
                          className="h-4 w-4 rounded-full ring-2 ring-white"
                          style={getSwatchStyle(color)}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium">
                      {selectedColors.length} selected
                    </span>
                  </div>
                ) : (
                  "Select colors..."
                )}
              </div>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          {/* //!Side bar filters are not scrollable on mobile devices*/}
          <PopoverContent className="w-full p-4 shadow-2xl min-w-[300px] max-h-[300px] overflow-auto">
            <div className="grid grid-cols-6 gap-2">
              {uniqueColors.map(colorOption => (
                <button
                  key={colorOption}
                  onClick={() => toggleColor(colorOption)}
                  className="group relative"
                  title={colorOption
                    .split("_")
                    .map(
                      word =>
                        word.charAt(0).toUpperCase() +
                        word.slice(1).toLowerCase()
                    )
                    .join(" ")}
                >
                  <div
                    className={`h-6 w-6 rounded-full transition-all duration-200 hover:scale-110
                      ${selectedColors.includes(colorOption) ? "ring-2 ring-blue-500 ring-offset-2" : ""}`}
                    style={getSwatchStyle(colorOption)}
                  />
                  {selectedColors.includes(colorOption) && (
                    <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-3 h-3 flex items-center justify-center text-[10px]">
                      ✓
                    </div>
                  )}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Size Filter */}
      <div className="mb-6">
        <h2 className="text-sm font-medium mb-2">Size</h2>
        <Popover open={isSizeOpen} onOpenChange={setIsSizeOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-full justify-between bg-white shadow-2xl shadow-black transition-transform duration-300 hover:scale-95"
            >
              {selectedSizes.length > 0
                ? `${selectedSizes.length} sizes selected`
                : "Select sizes..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-2 shadow-2xl min-w-[300px] max-h-[300px] overflow-y-scroll">
            <Command>
              <CommandInput placeholder="Search sizes..." />
              <CommandEmpty>No size found.</CommandEmpty>
              <CommandGroup>
                {uniqueSizes.map(sizeOption => (
                  <CommandItem
                    key={sizeOption}
                    value={sizeOption}
                    onSelect={() => toggleSize(sizeOption)}
                  >
                    <div className="flex items-center">
                      <div
                        className={`mr-2 h-4 w-4 border rounded-sm ${
                          selectedSizes.includes(sizeOption)
                            ? "bg-primary border-primary"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedSizes.includes(sizeOption) && (
                          <Check className="h-4 w-4 text-white" />
                        )}
                      </div>
                      {sizeOption}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Active Filters */}
      {(selectedColors.length > 0 || selectedSizes.length > 0) && (
        <div className="mt-4 space-y-2">
          <h3 className="text-sm font-medium">Active Filters:</h3>
          <div className="flex flex-wrap gap-2">
            {selectedColors.map(color => (
              <Button
                key={color}
                variant="secondary"
                size="sm"
                onClick={() => toggleColor(color)}
                className="flex items-center gap-1"
              >
                <div
                  className="h-3 w-3 rounded-full"
                  style={getSwatchStyle(color)}
                />
                <span className="ml-1">
                  {color
                    .split("_")
                    .map(
                      word =>
                        word.charAt(0).toUpperCase() +
                        word.slice(1).toLowerCase()
                    )
                    .join(" ")}
                </span>
                <span className="ml-1">×</span>
              </Button>
            ))}
            {selectedSizes.map(size => (
              <Button
                key={size}
                variant="secondary"
                size="sm"
                onClick={() => toggleSize(size)}
                className="flex items-center gap-1"
              >
                Size: {size}
                <span className="ml-1">×</span>
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterSidebar;
