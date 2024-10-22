"use client";

import React, { useState } from "react";
import { VariationWithRelations } from "./types";
import { HeaderSection } from "./HeaderSection";
import { FiltersSection } from "./FiltersSection";
import { TableSection } from "./TableSection";
import { PricingSection } from "./PricingSection";

interface Props {
  data: VariationWithRelations;
}

const VariationDetails: React.FC<Props> = ({ data }) => {
  const [selectedColors, setSelectedColors] = useState<Set<string>>(
    new Set([data.color])
  );
  const [selectedSizes, setSelectedSizes] = useState<Set<string>>(
    new Set([data.size])
  );

  const toggleColorFilter = (color: string) => {
    setSelectedColors(prev => {
      const newSet = new Set(prev);
      if (newSet.has(color)) {
        newSet.delete(color);
        if (newSet.size === 0) newSet.add(data.color);
      } else {
        newSet.add(color);
      }
      return newSet;
    });
  };

  const toggleSizeFilter = (size: string) => {
    setSelectedSizes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(size)) {
        newSet.delete(size);
        if (newSet.size === 0) newSet.add(data.size);
      } else {
        newSet.add(size);
      }
      return newSet;
    });
  };

  const filteredVariations = data.product.variations.filter(
    variation =>
      selectedColors.has(variation.color) && selectedSizes.has(variation.size)
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <HeaderSection data={data} />
      <FiltersSection
        data={data}
        selectedColors={selectedColors}
        selectedSizes={selectedSizes}
        onColorSelect={toggleColorFilter}
        onSizeSelect={toggleSizeFilter}
      />
      <TableSection data={data} filteredVariations={filteredVariations} />
      <PricingSection data={data} />
    </div>
  );
};

export default VariationDetails;
