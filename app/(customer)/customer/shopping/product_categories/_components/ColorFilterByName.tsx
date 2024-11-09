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
    <div className="relative">
      <Button
        variant="outline"
        className="mb-4 flex w-full items-center justify-between bg-background/80 backdrop-blur-sm transition-colors hover:bg-background/90"
        onClick={toggleDropdown}
      >
        <span className="text-foreground">
          {selectedColor
            ? `Filter by color: ${selectedColor}`
            : "Filter by color"}
        </span>
        <span
          className={`text-xl transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        >
          ▼
        </span>
      </Button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-full rounded-md border border-border bg-background/80 backdrop-blur-sm shadow-lg">
          <div className="grid grid-cols-2 gap-2 p-4 sm:grid-cols-3 md:grid-cols-4">
            <Button
              key="deselect"
              onClick={() => {
                onColorChange(null);
                setIsOpen(false);
              }}
              variant="outline"
              className="w-full text-foreground hover:bg-muted"
            >
              Clear
            </Button>
            {colors.map(color => (
              <Button
                key={color}
                onClick={() => {
                  onColorChange(color);
                  setIsOpen(false);
                }}
                variant="outline"
                className={`w-full transition-colors ${
                  selectedColor === color
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                {color}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
