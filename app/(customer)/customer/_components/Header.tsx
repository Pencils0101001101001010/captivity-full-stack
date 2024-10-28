import { Button } from "@/components/ui/button";
import Link from "next/link";

const Header = () => {
  return (
    <header className="text-center mb-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold mb-2">Instant Purchase Power</h1>
      <p className="text-xl mb-4">
        Unlock the Speed of Our Quick Order Page Today!
      </p>
      <Button
        asChild
        className="mt-2 bg-green-500 hover:bg-green-600 text-white"
      >
        <Link href={"/customer/shopping/express"}>Quick Order</Link>
      </Button>
    </header>
  );
};

export default Header;
