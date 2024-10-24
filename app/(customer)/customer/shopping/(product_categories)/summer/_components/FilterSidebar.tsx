"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

const COLLECTIONS = [
  "Winter",
  "Summer",
  "Spring",
  "Fall",
  "Holiday",
  "Resort",
  "Basic",
  "Limited Edition",
] as const;

type Collection = (typeof COLLECTIONS)[number];

const FilterSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [includeClearance, setIncludeClearance] = useState(false);

  // Memoize getCurrentCollection to fix dependency warning
  const getCurrentCollection = useCallback((): Collection | null => {
    if (!pathname) return null;
    const pathLower = pathname.toLowerCase();
    return COLLECTIONS.find(c => pathLower.includes(c.toLowerCase())) ?? null;
  }, [pathname]);

  const [selectedCollection, setSelectedCollection] =
    useState<Collection | null>(() => getCurrentCollection());

  const handleCollectionChange = (value: Collection) => {
    // Update state immediately
    setSelectedCollection(value);

    // Use shallow routing for faster navigation
    const basePath = "/customer/shopping";
    const newPath = `${basePath}/${value.toLowerCase()}`;

    // Use shallow: true for faster route updates when possible
    router.push(newPath, { scroll: false });
  };

  // Update selected collection when path changes
  useEffect(() => {
    const currentCollection = getCurrentCollection();
    if (currentCollection !== selectedCollection) {
      setSelectedCollection(currentCollection);
    }
  }, [getCurrentCollection, selectedCollection]);

  return (
    <div className="bg-card p-4 rounded-lg shadow-2xl shadow-black dark:shadow-none">
      <div className="text-2xl font-semibold mb-4 text-foreground">
        Collections
      </div>

      {/* Clearance Toggle */}
      <div className="mb-6 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Include Clearance Items
        </span>
        <button
          onClick={() => setIncludeClearance(!includeClearance)}
          className={`w-12 h-6 rounded-full transition-colors duration-200 ${
            includeClearance ? "bg-primary" : "bg-muted"
          } relative`}
        >
          <div
            className={`w-5 h-5 rounded-full bg-background absolute top-0.5 left-0.5 transition-transform duration-200 transform ${
              includeClearance ? "translate-x-6" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Collections */}
      <div className="flex flex-col space-y-4" role="radiogroup">
        {COLLECTIONS.map(collection => (
          <label
            key={collection}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <input
              type="radio"
              name="collection"
              value={collection}
              checked={selectedCollection === collection}
              onChange={() => handleCollectionChange(collection)}
              className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
            />
            <span className="text-base group-hover:text-primary transition-colors">
              {collection}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default FilterSidebar;