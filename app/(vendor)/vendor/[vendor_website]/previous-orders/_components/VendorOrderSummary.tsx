import { Card, CardContent } from "@/components/ui/card";
import { Package, Store, Clock, TrendingUp } from "lucide-react";

interface OrderStats {
  totalOrders: number;
  totalAmount: number;
  pendingOrders: number;
  processingOrders: number;
}

interface VendorOrderSummaryProps {
  stats: OrderStats;
}

export function VendorOrderSummary({ stats }: VendorOrderSummaryProps) {
  const summaryCards = [
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: Package,
      textColor: "text-blue-600",
    },
    {
      title: "Total Revenue",
      value: `R${stats.totalAmount.toFixed(2)}`,
      icon: TrendingUp,
      textColor: "text-green-600",
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      icon: Clock,
      textColor: "text-orange-600",
    },
    {
      title: "Processing Orders",
      value: stats.processingOrders,
      icon: Store,
      textColor: "text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {summaryCards.map((card, index) => (
        <Card key={index}>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium">{card.title}</p>
              <card.icon className={`h-4 w-4 ${card.textColor}`} />
            </div>
            <p className={`text-2xl font-bold ${card.textColor}`}>
              {card.value}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
