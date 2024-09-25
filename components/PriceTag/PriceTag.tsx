export default function PriceTag({ price, className }) {
    return <div className={`text-2xl font-semibold ${className}`}>{price}</div>;
  }
  