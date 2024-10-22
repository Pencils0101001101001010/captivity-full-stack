import Image from "next/image";
import { TableProps } from "./variations";

export const TableSection = ({ data, filteredVariations }: TableProps) => {
  return (
    <div className="bg-card rounded-lg shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                Color
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                Code
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                Size
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                Stock
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                SKU
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                Image
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredVariations.map(variation => (
              <tr
                key={variation.id}
                className={`group transition-colors ${
                  variation.id === data.id
                    ? "bg-accent/50"
                    : "hover:bg-accent/10"
                }`}
              >
                <td className="px-6 py-4 text-sm text-card-foreground">
                  {variation.color}
                </td>
                <td className="px-6 py-4 text-sm text-card-foreground">
                  {variation.sku2}
                </td>
                <td className="px-6 py-4 text-sm text-card-foreground">
                  {variation.size}
                </td>
                <td className="px-6 py-4 text-sm text-card-foreground">
                  {variation.quantity}
                </td>
                <td className="px-6 py-4 text-sm text-card-foreground">
                  {variation.sku}
                </td>
                <td className="px-6 py-4">
                  <div className="h-12 w-12 relative rounded-md overflow-hidden">
                    <Image
                      src={variation.variationImageURL}
                      alt={`${variation.color} ${variation.size}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
