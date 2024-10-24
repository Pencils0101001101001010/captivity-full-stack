"use client";
import Link from "next/link";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export function CollectionsMenu() {
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);

  return (
    <div className="border-b pb-4">
      <button
        onClick={() => setIsCollectionsOpen(!isCollectionsOpen)}
        className="flex items-center justify-between w-full text-left font-semibold text-lg mb-2 hover:text-gray-700"
      >
        COLLECTIONS
        {isCollectionsOpen ? (
          <ChevronUp className="h-5 w-5" />
        ) : (
          <ChevronDown className="h-5 w-5" />
        )}
      </button>
      <div
        className={`transition-all duration-200 ease-in-out ${
          isCollectionsOpen ? "max-h-96" : "max-h-0 overflow-hidden"
        }`}
      >
        <ul className="space-y-2 pt-2">
          {[
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
          ].map(item => (
            <li key={item}>
              <Link
                href={`/collections/${item.toLowerCase()}`}
                className="text-gray-600 hover:text-gray-900 block"
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
