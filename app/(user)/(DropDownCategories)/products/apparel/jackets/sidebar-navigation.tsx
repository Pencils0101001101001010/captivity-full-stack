import Link from "next/link";
import { CollectionsMenu } from "./collections-menu";

const apparelLinks = [
  { href: "/apparel/new", label: "New in Apparel" },
  { href: "/apparel/men", label: "Men" },
  { href: "/apparel/women", label: "Women" },
  { href: "/apparel/kids", label: "Kids" },
  { href: "/apparel/t-shirts", label: "T-Shirts" },
  { href: "/apparel/golfers", label: "Golfers" },
  { href: "/apparel/hoodies", label: "Hoodies" },
  { href: "/apparel/jackets", label: "Jackets" },
  { href: "/apparel/bottoms", label: "Bottoms" },
];

const headwearLinks = [
  { href: "/headwear/new", label: "New in Headwear" },
  { href: "/headwear/flat-peaks", label: "Flat Peaks" },
  { href: "/headwear/pre-curved-peaks", label: "Pre-Curved Peaks" },
  { href: "/headwear/hats", label: "Hats" },
  { href: "/headwear/multifunctional", label: "Multifunctional Headwear" },
  { href: "/headwear/beanies", label: "Beanies" },
  { href: "/headwear/trucker-caps", label: "Trucker Caps" },
  { href: "/headwear/bucket-hats", label: "Bucket Hats" },
];

export function SidebarNavigation() {
  return (
    <aside className="w-64 flex-shrink-0">
      <nav className="space-y-6">
       

        <div>
          <h3 className="font-semibold text-lg mb-3">APPAREL</h3>
          <ul className="space-y-2">
            {apparelLinks.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="text-gray-600 hover:text-gray-900">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-3">HEADWEAR</h3>
          <ul className="space-y-2">
            {headwearLinks.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="text-gray-600 hover:text-gray-900">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <CollectionsMenu />
      </nav>
    </aside>
  );
}