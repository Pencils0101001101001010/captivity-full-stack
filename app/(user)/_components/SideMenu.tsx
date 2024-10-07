import Link from 'next/link';
import React from 'react'

const SideMenu = () => {
   
        return (
          <div className="space-y-5 md:mr-10 lg:mr-10 xl:mr-10 xl:ml-20 lg:ml-20 md:ml-20">
          <aside className="w-[300px] mb-0 hidden lg:block">
            <ul className="menu  text-gray-700">
              <span className="text-xl font-bold">HEADWEAR</span>
              <li className="hover:text-red-400">
                <Link href="/headwear/newInHeadwear">New in Headwear</Link>
              </li>
              <li className="hover:text-red-400">
                <Link href="/headwear/flatPeaks">Flat Peaks</Link>
              </li>
              <li className="hover:text-red-400">
                <Link href="/headwear/preCurvedPeaks">
                  Pre-Curved Peaks
                </Link>
              </li>
              <li className="hover:text-red-400">
                <Link href="/headwear/hats">Hats</Link>
              </li>
              <li className="hover:text-red-400">
                <Link href="/headwear/multifunctionalHeadwear">
                  Multifunctional Headwear
                </Link>
              </li>
              <li className="hover:text-red-400">
                <Link href="/headwear/beanies">Beanies</Link>
              </li>
              <li className="hover:text-red-400">
                <Link href="/headwear/truckerCaps">Trucker Caps</Link>
              </li>
              <li className="hover:text-red-400">
                <Link href="/headwear/bucketHats">Bucket Hats</Link>
              </li>
            </ul>
          </aside>
          <aside className="w-[300px] hidden lg:block">
            <ul className="menu  text-gray-700">
              <span className="text-xl font-bold">APPAREL</span>
              <li className="hover:text-red-400">
                <Link href="/apparel/new-in-apparel">New in Apparel</Link>
              </li>
              <li className="hover:text-red-400">
                <Link href="/apparel/men">Men</Link>
              </li>
              <li className="hover:text-red-400">
                <Link href="/apparel/women">Women</Link>
              </li>
              <li className="hover:text-red-400">
                <Link href="/apparel/kids">Kids</Link>
              </li>
              <li className="hover:text-red-400">
                <Link href="/apparel/t-shirts">T - Shirts</Link>
              </li>
              <li className="hover:text-red-400">
                <Link href="/apparel/golfers">Golfers</Link>
              </li>
              <li className="hover:text-red-400">
                <Link href="/apparel/hoodies">Hoodies</Link>
              </li>
              <li className="hover:text-red-400">
                <Link href="/apparel/jackets">Jackets</Link>
              </li>
              <li className="hover:text-red-400">
                <Link href="/apparel/bottoms">Bottoms</Link>
              </li>
            </ul>
          </aside>
          
        </div>
        );
      
}

export default SideMenu