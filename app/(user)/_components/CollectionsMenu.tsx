"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import type { ProductWithFeaturedImage } from "../(DropDownCategories)/products/headwear/beanies/actions";

interface CollectionsMenuProps {
  products?: ProductWithFeaturedImage[];
  loading?: boolean;
}

export function CollectionsMenu({ products, loading }: CollectionsMenuProps) {
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);

  const collections = [
    "Signature",
    "Camo",
    "Winter",
    "Baseball",
    "Fashion",
    "Sport",
    "Industrial",
    "Leisure",
    "Kids",
    "African",
  ];

  return (
    <div className="mt-4">
      <div
        onClick={() => setIsCollectionsOpen(!isCollectionsOpen)}
        className="flex items-center  cursor-pointer mb-4"
      >
        <h2 className="text-gray-700 text-xl hidden lg:block font-bold p-[2px] ">COLLECTIONS</h2>
        <ChevronDown
          className={`h-5 w-5 hidden lg:block transform transition-transform ${
            isCollectionsOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      <div
        className={`transition-all duration-200 ease-in-out overflow-hidden ${
          isCollectionsOpen ? "max-h-[500px]" : "max-h-0"
        }`}
      >
        <ul className="space-y-3">
          {collections.map(item => (
            <li key={item}>
              <Link
                href={`/collections/${item.toLowerCase()}`}
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                {item}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default CollectionsMenu;
