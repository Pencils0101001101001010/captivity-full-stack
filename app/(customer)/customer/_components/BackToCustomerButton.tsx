import { SquareArrowLeft } from "lucide-react";
import Link from "next/link";

export default function BackToCustomerPage() {
  return (
    <span className="flex items-center justify-center ">
      <p className="font-semibold text-sm text-neutral-700 ">
        Back
      </p>
      <Link href="/customer">
        <SquareArrowLeft />
      </Link>
    </span>
  );
}
