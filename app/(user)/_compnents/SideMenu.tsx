import { useState } from "react";
import Link from "next/link";

const SideMenu = () => {
  const [openHeadwear, setOpenHeadwear] = useState(false);
  const [openApparel, setOpenApparel] = useState(false);

  const toggleHeadwear = () => setOpenHeadwear(!openHeadwear);
  const toggleApparel = () => setOpenApparel(!openApparel);

  return (
    <div className="space-y-5 md:mr-10 lg:mr-10 xl:mr-10 xl:ml-20 lg:ml-20 md:ml-20">
      <aside className="w-[300px] mb-0 hidden lg:block">
        <ul className="menu border-2 p-2 text-gray-700">
          <button
            title="click*"
            className="text-xl font-bold w-full text-left"
            onClick={toggleHeadwear}
          >
            HEADWEAR
          </button>
          {openHeadwear && (
            <ul className="pl-4 space-y-1">
              <li>
                <Link href="/headwear/newInHeadwear">New in Headwear</Link>
              </li>
              <li>
                <Link href="/headwear/flatPeaks">Flat Peaks</Link>
              </li>
              <li>
                <Link href="/headwear/preCurvedPeaks">Pre-Curved Peaks</Link>
              </li>
              <li>
                <Link href="/headwear/hats">Hats</Link>
              </li>
              <li>
                <Link href="/headwear/multifunctionalHeadwear">
                  Multifunctional Headwear
                </Link>
              </li>
              <li>
                <Link href="/headwear/beanies">Beanies</Link>
              </li>
              <li>
                <Link href="/headwear/truckerCaps">Trucker Caps</Link>
              </li>
              <li>
                <Link href="/headwear/bucketHats">Bucket Hats</Link>
              </li>
            </ul>
          )}
        </ul>
      </aside>

      <aside className="w-[300px] hidden lg:block">
        <ul className="menu border-2 p-2 text-gray-700">
          <button
            className="text-xl font-bold w-full text-left"
            onClick={toggleApparel}
          >
            APPAREL
          </button>
          {openApparel && (
            <ul className="pl-4 space-y-1">
              <li>
                <Link href="/apparel/new-in-apparel">New in Apparel</Link>
              </li>
              <li>
                <Link href="/apparel/men">Men</Link>
              </li>
              <li>
                <Link href="/apparel/women">Women</Link>
              </li>
              <li>
                <Link href="/apparel/kids">Kids</Link>
              </li>
              <li>
                <Link href="/apparel/t-shirts">T-Shirts</Link>
              </li>
              <li>
                <Link href="/apparel/golfers">Golfers</Link>
              </li>
              <li>
                <Link href="/apparel/hoodies">Hoodies</Link>
              </li>
              <li>
                <Link href="/apparel/jackets">Jackets</Link>
              </li>
              <li>
                <Link href="/apparel/bottoms">Bottoms</Link>
              </li>
            </ul>
          )}
        </ul>
      </aside>
    </div>
  );
};

export default SideMenu;
