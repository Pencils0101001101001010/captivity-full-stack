// QuantitySelector.tsx
import React from "react";
import { ChevronDown } from "lucide-react";

interface QuantitySelectorProps {
  availableQuantity: number;
  selectedQuantity: number;
  onQuantityChange: (quantity: number) => void;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  availableQuantity,
  selectedQuantity,
  onQuantityChange,
}) => {
  return (
    <div className="w-full max-w-xs">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Quantity
      </label>
      <div className="relative">
        <select
          value={selectedQuantity}
          onChange={e => onQuantityChange(Number(e.target.value))}
          className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
        >
          {[...Array(availableQuantity)].map((_, index) => (
            <option key={index + 1} value={index + 1}>
              {index + 1}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>
      <p className="mt-1 text-sm text-gray-500">
        {availableQuantity} available
      </p>
    </div>
  );
};

export default QuantitySelector;
