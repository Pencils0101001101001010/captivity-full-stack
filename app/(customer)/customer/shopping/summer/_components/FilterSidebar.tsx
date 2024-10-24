"use client";
import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

type FilterSection =
  | "minimumStock"
  | "categories"
  | "fits"
  | "promotion"
  | "genders"
  | "brands"
  | "colours"
  | "size";

type FilterState = {
  [K in FilterSection]: boolean;
};

type FilterOptions = {
  [K in FilterSection]: string[];
};

const FilterSidebar = () => {
  const [openSections, setOpenSections] = useState<FilterState>({
    minimumStock: false,
    categories: false,
    fits: false,
    promotion: false,
    genders: false,
    brands: false,
    colours: false,
    size: false,
  });

  const [includeClearance, setIncludeClearance] = useState(false);

  const toggleSection = (section: FilterSection) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const filterSections: FilterOptions = {
    minimumStock: ["In Stock", "Low Stock"],
    categories: ["T-Shirts", "Hoodies"],
    fits: ["StandardFit", "SlimFit"],
    promotion: ["Regular Continuing Items", "Special Offers"],
    genders: ["Male", "Female"],
    brands: ["Brand A", "Brand B"],
    colours: ["Black", "White"],
    size: ["Small", "Medium"],
  };

  return (
    <div className="bg-card p-4 rounded-lg shadow-2xl shadow-black dark:shadow-none">
      <div className="text-lg font-semibold mb-4 text-foreground">Filters</div>

      {/* Clearance Toggle */}
      <div className="mb-4 flex items-center justify-between">
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

      {/* Filter Sections */}
      {(Object.entries(filterSections) as [FilterSection, string[]][]).map(
        ([key, options]) => (
          <div key={key} className="mb-4 border-b border-border pb-2">
            <button
              onClick={() => toggleSection(key)}
              className="w-full flex justify-between items-center text-sm font-medium hover:text-primary"
            >
              <span className="capitalize text-foreground">
                {key.replace(/([A-Z])/g, " $1").trim()}
              </span>
              {openSections[key] ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {openSections[key] && (
              <div className="mt-2 space-y-2">
                {options.map((option, index) => (
                  <label
                    key={index}
                    className="flex items-center space-x-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      className="rounded border-input bg-background"
                    />
                    <span className="text-muted-foreground">{option}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
};

export default FilterSidebar;
