import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { COLOR_MAPPINGS } from "./ColorMapping";

interface ColorPickerProps {
  colors: string[];
  selectedColor: string | null;
  onColorChange: (color: string | null) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  colors,
  selectedColor,
  onColorChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(prev => !prev);
  };

  const getColorValue = (colorName: string): string => {
    const normalizedName = colorName.toLowerCase().trim().replace(/\s+/g, "_");
    return COLOR_MAPPINGS[normalizedName] || colorName;
  };

  const getColorBackground = (colorString: string): string => {
    const colors = colorString.split("/");
    if (colors.length === 1) {
      return getColorValue(colors[0]);
    }
    const color1 = getColorValue(colors[0]);
    const color2 = getColorValue(colors[1]);
    return `linear-gradient(45deg, ${color1} 0%, ${color1} 49%, ${color2} 51%, ${color2} 100%)`;
  };

  const formatColorName = (colorString: string): string => {
    return colorString
      .split("/")
      .map(
        color => color.charAt(0).toUpperCase() + color.slice(1).toLowerCase()
      )
      .join("/");
  };

  const getColorDisplayName = (colorString: string | null): string => {
    if (!colorString) return "Filter by color";
    return `Filter by color: ${formatColorName(colorString)}`;
  };

  return (
    <div className="relative text-black">
      <Button
        variant="outline"
        className="mb-4 flex w-full items-center justify-between bg-gray-100 px-4 py-2 shadow-xl"
        onClick={toggleDropdown}
      >
        <span className="text-sm">{getColorDisplayName(selectedColor)}</span>
        <span
          className={`text-xl transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </Button>
      {isOpen && (
        <div className="absolute z-10 mt-2 w-full rounded-md bg-gray-100 py-2 shadow-xl">
          <p className="p-4 text-sm font-semibold text-gray-400">
            Select a color to filter
          </p>
          <div className="flex flex-wrap gap-2 p-4">
            <button
              key="deselect"
              onClick={() => onColorChange(null)}
              className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-gray-200 bg-white text-sm font-bold text-gray-600 hover:bg-gray-50"
            >
              ×
            </button>
            {colors.map(color => (
              <button
                key={color}
                title={formatColorName(color)}
                onClick={() => onColorChange(color)}
                className={`group relative h-6 w-6 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
                  selectedColor === color
                    ? "border-blue-500 shadow-lg"
                    : "border-gray-200"
                }`}
                style={{
                  background: getColorBackground(color),
                }}
              ></button>
            ))}
          </div>
          <p className="p-4 text-sm font-semibold text-gray-400">
            Colors shown are not 100% accurate
          </p>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
