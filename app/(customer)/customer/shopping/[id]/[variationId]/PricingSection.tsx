import { BaseProps } from "./variations";

export const PricingSection = ({ data }: BaseProps) => {
  return (
    <div className="bg-card rounded-lg p-6 shadow-lg">
      <h2 className="text-xl font-semibold text-card-foreground mb-4">
        Pricing Information
      </h2>
      <div className="space-y-2 text-card-foreground">
        <p className="flex justify-between items-center">
          <span>Base Price</span>
          <span className="font-semibold">
            R{data.product.sellingPrice.toFixed(2)}
          </span>
        </p>
        {data.product.dynamicPricing.map(pricing => (
          <p
            key={pricing.id}
            className="flex justify-between items-center text-muted-foreground"
          >
            <span>{pricing.type}</span>
            <span>
              R{pricing.amount} ({pricing.from} - {pricing.to})
            </span>
          </p>
        ))}
      </div>
    </div>
  );
};
