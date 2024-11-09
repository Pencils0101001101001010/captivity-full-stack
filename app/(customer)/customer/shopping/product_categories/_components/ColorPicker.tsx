import React, { useState } from "react";
import { Button } from "@/components/ui/button";

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

  return (
    <div className="relative text-black">
      <Button
        variant={"outline"}
        className="mb-4 flex items-center justify-between bg-gray-100 px-4 py-2 shadow-xl"
        onClick={toggleDropdown}
      >
        <span>
          {selectedColor
            ? `Filter by color: ${selectedColor}`
            : "Filter by color"}
        </span>
        <span className={`text-xl ${isOpen ? "rotate-180" : ""}`}>▼</span>
      </Button>
      {isOpen && (
        <div className="absolute z-10 mt-2 w-full rounded-md bg-gray-100 py-2 shadow-xl">
          <p className="text-sm font-semibold text-gray-400 p-4">
            Colors are not accurate, working on it...
          </p>
          <div className="flex flex-wrap gap-2 p-4">
            <Button
              key="deselect"
              onClick={() => onColorChange(null)}
              className="h-8 w-8 rounded-full border-2 border-gray-200"
            >
              x
            </Button>
            {colors.map(color => (
              <Button
                key={color}
                title={color}
                onClick={() => onColorChange(color)}
                className={`h-8 w-8 rounded-full border-2 ${
                  selectedColor === color
                    ? "border-blue-500"
                    : "border-gray-200"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
