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
  | "size"
  | "brandingTechniques"
  | "materials";

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
    brandingTechniques: false,
    materials: false,
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
    brandingTechniques: ["Screen Print", "Embroidery"],
    materials: ["Cotton", "Polyester"],
  };

  return (
    <div className="bg-white p-4">
      <div className="text-lg font-semibold mb-4">Filters</div>

      {/* Clearance Toggle */}
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm">Include Clearance Items</span>
        <button
          onClick={() => setIncludeClearance(!includeClearance)}
          className={`w-12 h-6 rounded-full transition-colors duration-200 ${
            includeClearance ? "bg-blue-500" : "bg-gray-200"
          } relative`}
        >
          <div
            className={`w-5 h-5 rounded-full bg-white absolute top-0.5 left-0.5 transition-transform duration-200 transform ${
              includeClearance ? "translate-x-6" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Filter Sections */}
      {(Object.entries(filterSections) as [FilterSection, string[]][]).map(
        ([key, options]) => (
          <div key={key} className="mb-4 border-b border-gray-200 pb-2">
            <button
              onClick={() => toggleSection(key)}
              className="w-full flex justify-between items-center text-sm font-medium hover:text-blue-500"
            >
              <span className="capitalize">
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
                      className="rounded border-gray-300"
                    />
                    <span>{option}</span>
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