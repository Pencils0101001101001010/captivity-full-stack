import { Waves, Sun, Umbrella } from "lucide-react";
import ProductsPage from "./ProductTablePage";
import { FaBaseballBall } from "react-icons/fa";
import { TbBallBaseball } from "react-icons/tb";

interface ThemeColors {
  primary: string;
  hover: string;
  text?: string;
  accent?: string;
}

const baseballTheme: ThemeColors = {
  primary: "#B91C1C",
  hover: "#E11D48",
  text: "#C7D2FE",
  accent: "#DC2626",
};

const SummerTablePage = () => {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8 space-y-6 rounded-lg p-6 bg-gradient-to-r from-[#B91C1C] via-[#C7D2FE] to-[#DC2626] dark:bg-card">
          {/* Title and Icons */}
          <div className="flex items-center justify-center space-x-4">
            <FaBaseballBall className="h-8 w-8 text-yellow-400" />
            <h1 className="text-4xl font-bold tracking-tight">
              Baseball Collection 2024
            </h1>
            <TbBallBaseball className="h-8 w-8 text-blue-400" />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-card p-4 shadow-2xl shadow-black">
              <div className="text-center">
                <h3 className="text-sm font-medium text-muted-foreground">
                  New Arrivals
                </h3>
                <div className="mt-1 text-2xl font-semibold text-primary">
                  24 Products
                </div>
              </div>
            </div>
            <div className="rounded-lg bg-card p-4 shadow-2xl shadow-black">
              <div className="text-center">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Featured Items
                </h3>
                <div className="mt-1 text-2xl font-semibold text-primary">
                  12 Products
                </div>
              </div>
            </div>
            <div className="rounded-lg bg-card p-4 shadow-2xl shadow-black">
              <div className="text-center">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Limited Edition
                </h3>
                <div className="mt-1 text-2xl font-semibold text-primary">
                  6 Products
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="rounded-xl bg-card p-6 shadow-2xl shadow-black">
          <ProductsPage themeColors={baseballTheme} />
        </div>
      </div>
    </div>
  );
};

export default SummerTablePage;
