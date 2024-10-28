import Link from "next/link";
import React from "react";

const SideMenu = () => {
  return (
    <div className="space-y-5 md:mr-10 lg:mr-10 min-h-[500px] xl:mr-10 xl:ml-20 lg:ml-20 md:ml-20">
      <div className="w-[300px] mb-8 hidden lg:block">
        <div className="sticky top-4">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <ul className="menu text-gray-700 mb-8">
              <span className="text-xl font-bold block mb-4">HEADWEAR</span>
              <li className="hover:text-red-400 py-1">
                <Link href="/products/headwear/new-in-headwear">
                  New in Headwear
                </Link>
              </li>
              <li className="hover:text-red-400 py-1">
                <Link href="/products/headwear/flat-peaks">Flat Peaks</Link>
              </li>
              <li className="hover:text-red-400 py-1">
                <Link href="/products/headwear/pre-curved-peaks">
                  Pre-Curved Peaks
                </Link>
              </li>
              <li className="hover:text-red-400 py-1">
                <Link href="/products/headwear/hats">Hats</Link>
              </li>
              <li className="hover:text-red-400 py-1">
                <Link href="/products/headwear/multifunctional-headwear">
                  Multifunctional Headwear
                </Link>
              </li>
              <li className="hover:text-red-400 py-1">
                <Link href="/products/headwear/beanies">Beanies</Link>
              </li>
              <li className="hover:text-red-400 py-1">
                <Link href="/products/headwear/trucker-caps">Trucker Caps</Link>
              </li>
              <li className="hover:text-red-400 py-1">
                <Link href="/products/headwear/bucket-hats">Bucket Hats</Link>
              </li>
            </ul>

            <ul className="menu text-gray-700 pt-4 border-t border-gray-200">
              <span className="text-xl font-bold block mb-4 sticky top-0">APPAREL</span>
              <li className="hover:text-red-400 py-1">
                <Link href="/products/apparel/new-in-apparel">New in Apparel</Link>
              </li>
              <li className="hover:text-red-400 py-1">
                <Link href="/products/apparel/men">Men</Link>
              </li>
              <li className="hover:text-red-400 py-1">
                <Link href="/products/apparel/women">Women</Link>
              </li>
              <li className="hover:text-red-400 py-1">
                <Link href="/products/apparel/kids">Kids</Link>
              </li>
              <li className="hover:text-red-400 py-1">
                <Link href="/products/apparel/t-shirts">T - Shirts</Link>
              </li>
              <li className="hover:text-red-400 py-1">
                <Link href="/products/apparel/golfers">Golfers</Link>
              </li>
              <li className="hover:text-red-400 py-1">
                <Link href="/products/apparel/hoodies">Hoodies</Link>
              </li>
              <li className="hover:text-red-400 py-1">
                <Link href="/products/apparel/jackets">Jackets</Link>
              </li>
              <li className="hover:text-red-400 py-1">
                <Link href="/products/apparel/bottoms">Bottoms</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideMenu;