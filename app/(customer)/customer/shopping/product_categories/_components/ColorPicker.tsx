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

  // Function to get the actual color value
  const getColorValue = (colorName: string): string => {
    // Convert to lowercase, remove extra spaces, and replace spaces with underscores
    const normalizedName = colorName.toLowerCase().trim().replace(/\s+/g, "_");
    return COLOR_MAPPINGS[normalizedName] || colorName;
  };

  // Function to parse color strings and get CSS background
  const getColorBackground = (colorString: string): string => {
    const colors = colorString.split("/");

    if (colors.length === 1) {
      return getColorValue(colors[0]);
    }

    // For two-toned colors, create a diagonal gradient using the mapped colors
    const color1 = getColorValue(colors[0]);
    const color2 = getColorValue(colors[1]);
    return `linear-gradient(45deg, ${color1} 0%, ${color1} 49%, ${color2} 51%, ${color2} 100%)`;
  };

  // Function to format color name for display
  const formatColorName = (colorString: string): string => {
    return colorString
      .split("/")
      .map(
        color => color.charAt(0).toUpperCase() + color.slice(1).toLowerCase()
      )
      .join("/");
  };

  // Function to get a display name for the color
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
          className={`text-xl transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
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
            <Button
              key="deselect"
              onClick={() => onColorChange(null)}
              className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-200 bg-white text-sm font-bold text-gray-600 hover:bg-gray-50"
            >
              ×
            </Button>

            {colors.map(color => (
              <Button
                key={color}
                title={formatColorName(color)}
                onClick={() => onColorChange(color)}
                className={`group relative h-8 w-8 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
                  selectedColor === color
                    ? "border-blue-500 shadow-lg"
                    : "border-gray-200"
                }`}
                style={{
                  background: getColorBackground(color),
                }}
              >
                {/* Tooltip */}
                {/* <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                  {formatColorName(color)}
                </span> */}
              </Button>
            ))}
          </div>{" "}
          <p className="p-4 text-sm font-semibold text-gray-400">
            Colors shown are not 100% accurate
          </p>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
