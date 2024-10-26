"use client";
import Link from "next/link";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export function CollectionsMenu() {
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);

  return (
    <div className="space-y-5 md:mr-10 lg:mr-10 min-h-[500px] xl:mr-10 xl:ml-20 lg:ml-20 md:ml-20">
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
        <aside className="w-[300px] mb-0 hidden lg:block sticky top-0 h-fit">
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
                className="text-gray-600 hover:text-red-400 block"
              >
                {item}
              </Link>
            </li>
          ))}
        </ul>
        </aside>
      </div>
    </div>
  );
}
