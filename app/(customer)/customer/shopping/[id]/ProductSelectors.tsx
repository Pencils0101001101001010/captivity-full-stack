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
    <p className="font-bold text-card-foreground mb-2">Color</p>
    <div className="flex flex-wrap -mx-1">
      {colors.map(color => (
        <button
          key={color}
          className={`px-4 py-2 m-1 border rounded-md text-sm font-medium transition-colors
            ${
              selectedColor === color
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-card-foreground border-border hover:bg-accent hover:text-accent-foreground"
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
    <label
      htmlFor="size-select"
      className="font-bold text-card-foreground block mb-2"
    >
      Size
    </label>
    <select
      id="size-select"
      value={selectedSize || ""}
      onChange={onSizeSelect}
      className="w-full p-2 bg-background text-foreground border border-input rounded-md focus:ring-2 focus:ring-ring"
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
    <label className="font-bold text-card-foreground block mb-2">
      Quantity
    </label>
    <input
      type="number"
      value={quantity}
      onChange={onQuantityChange}
      min={1}
      max={maxQuantity}
      className="w-full p-2 bg-background text-foreground border border-input rounded-md focus:ring-2 focus:ring-ring"
    />
  </div>
);
