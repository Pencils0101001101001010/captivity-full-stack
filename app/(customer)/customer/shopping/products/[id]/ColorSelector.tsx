// ColorSelector.tsx
import React from "react";

interface ColorSelectorProps {
  colors: string[];
  selectedColor: string;
  onColorChange: (color: string) => void;
}

const ColorSelector: React.FC<ColorSelectorProps> = ({
  colors,
  selectedColor,
  onColorChange,
}) => {
  console.log("ColorSelector rendering - Selected color:", selectedColor);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">Color</label>
      <div className="mt-1 flex flex-wrap gap-2">
        {colors.map(color => (
          <button
            key={color}
            onClick={() => {
              console.log("Color button clicked:", color);
              onColorChange(color);
            }}
            className={`px-3 py-1 rounded-full ${
              selectedColor === color
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {color}
          </button>
        ))}
      </div>
    </div>
  );
};

export default React.memo(ColorSelector);
