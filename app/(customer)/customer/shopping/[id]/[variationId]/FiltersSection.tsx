import { FilterProps } from "./variations";

export const FiltersSection = ({
  data,
  selectedColors,
  selectedSizes,
  onColorSelect,
  onSizeSelect,
}: FilterProps) => {
  const uniqueColors = Array.from(
    new Set(data.product.variations.map(v => v.color))
  );
  const uniqueSizes = Array.from(
    new Set(data.product.variations.map(v => v.size))
  );

  return (
    <div className="bg-card rounded-lg p-6 shadow-lg space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-card-foreground mb-4">
          FILTER BY COLOUR
        </h2>
        <div className="flex flex-wrap gap-2">
          {uniqueColors.map(color => {
            const count = data.product.variations.filter(
              v => v.color === color
            ).length;
            return (
              <button
                key={color}
                onClick={() => onColorSelect(color)}
                className={`px-4 py-2 rounded-md border transition-colors ${
                  selectedColors.has(color)
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-card-foreground border-input hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {color} ({count})
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-card-foreground mb-4">
          FILTER BY SIZES
        </h2>
        <div className="flex flex-wrap gap-2">
          {uniqueSizes.map(size => (
            <button
              key={size}
              onClick={() => onSizeSelect(size)}
              className={`px-4 py-2 rounded-md border transition-colors ${
                selectedSizes.has(size)
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-card-foreground border-input hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
