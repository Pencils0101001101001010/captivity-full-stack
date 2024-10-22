import React from "react";
import {
  ColorSelectorProps,
  QuantitySelectorProps,
  SizeSelectorProps,
} from "./types";

export const ColorSelector: React.FC<ColorSelectorProps> = ({
  colors,
  selectedColor,
  onColorSelect,
}) => (
  <div className="mb-2">
    <p className="font-bold text-gray-700 mb-2">Color</p>
    <div className="flex flex-wrap -mx-1">
      {colors.map(color => (
        <button
          key={color}
          className={`px-4 py-2 m-1 border rounded text-sm font-medium transition-colors
            ${
              selectedColor === color
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          onClick={() => onColorSelect(color)}
        >
          {color}
        </button>
      ))}
    </div>
  </div>
);

export const SizeSelector: React.FC<SizeSelectorProps> = ({
  sizes,
  selectedSize,
  onSizeSelect,
}) => (
  <div className="mb-4">
    <label htmlFor="size-select" className="font-bold text-gray-700 block mb-2">
      Size
    </label>
    <select
      id="size-select"
      value={selectedSize || ""}
      onChange={onSizeSelect}
      className="w-full p-2 border border-gray-300 rounded-md"
    >
      <option value="">Select a size</option>
      {sizes.map(size => (
        <option key={size} value={size}>
          {size}
        </option>
      ))}
    </select>
  </div>
);

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  maxQuantity,
  onQuantityChange,
}) => (
  <div className="mb-4">
    <label className="font-bold text-gray-700 block mb-2">Quantity</label>
    <input
      type="number"
      value={quantity}
      onChange={onQuantityChange}
      min={1}
      max={maxQuantity}
      className="w-full p-2 border border-gray-300 rounded-md"
    />
  </div>
);
