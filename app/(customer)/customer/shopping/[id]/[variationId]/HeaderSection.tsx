import Link from "next/link";
import { BaseProps } from "./variations";

export const HeaderSection = ({ data }: BaseProps) => {
  const totalStock = data.product.variations.reduce(
    (sum, v) => sum + v.quantity,
    0
  );

  return (
    <div className="bg-card rounded-lg p-6 shadow-lg">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-card-foreground">
            {data.product.productName}
          </h1>
          <div className="mt-2 flex items-center space-x-4 text-sm text-muted-foreground">
            <span>Filtered Stock: {totalStock}</span>
            <span>SKU: {data.sku}</span>
          </div>
        </div>
        <Link
          href={`/customer/shopping/${data.product.id}`}
          className="inline-flex items-center px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          View product details
        </Link>
      </div>
    </div>
  );
};
