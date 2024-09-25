import Link from "next/link";
import React from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

const Categories = () => {
  return (
    <div className="bg-gray-100">
      <div className="flex items-center w-full text-sm font-bold justify-center gap-5">
        <div className="hidden md:flex items-center space-x-8 px-20 md:px-20 ">
          <div className="relative group ">
            <button className="focus:outline-none px-10 py-2 items-center flex text-gray-600 hover:text-gray-400">
              <Link href="/headwear/HeadwearCollection">
                Headwear Collection{" "}
              </Link>
              <MdKeyboardArrowDown />
            </button>

            <div className=" z-10 items-center absolute left-0 ml-8 mt-0 w-52 bg-white text-gray-600 rounded-md shadow-lg hidden group-hover:block">
              <ul>
                <li className="px-4 py-2  hover:text-red-600 hover:bg-gray-200">
                  <Link href="/headwear/newInHeadwear">NEW in Headwear</Link>
                </li>
                <li className="px-4 py-2  hover:text-red-600 hover:bg-gray-200">
                  <Link href="/headwear/FlatPeaks">Flat peaks</Link>
                </li>
                <li className="px-4 py-2  hover:text-red-600 hover:bg-gray-200">
                  <Link href="/headwear/preCurvedPeaks">Pre-curved Peaks</Link>
                </li>
                <li className="px-4 py-2  hover:text-red-600 hover:bg-gray-200">
                  <Link href="/headwear/hats">Hats</Link>
                </li>
                <li className="px-4 py-2  hover:text-red-600 hover:bg-gray-200">
                  <Link href="/headwear/multifunctionalHeadwear">
                    Multifunctional Headwear
                  </Link>
                </li>
                <li className="px-4 py-2  hover:text-red-600 hover:bg-gray-200">
                  <Link href="/headwear/beanies">Beanies</Link>
                </li>
                <li className="px-4 py-2  hover:text-red-600 hover:bg-gray-200">
                  <Link href="/headwear/truckerCaps">Trucker Caps</Link>
                </li>
                <li className="px-4 py-2  hover:text-red-600 hover:bg-gray-200">
                  <Link href="/headwear/bucketHats">Bucket Hats</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="relative group">
            <button className="focus:outline-none flex items-center px-10 py-2 text-gray-600 hover:text-gray-400">
              <Link href="/apparel/ApparelCollection">Apparel Collection</Link>

              <MdKeyboardArrowDown />
            </button>
            <div className=" z-10 absolute left-0 ml-8 mt-0 w-52 bg-white text-gray-600 rounded shadow-lg hidden group-hover:block">
              <ul>
                <li className="px-4 py-2  hover:text-red-600 hover:bg-gray-200">
                  <Link href="/apparel/newInApparel">NEW in Apparel</Link>
                </li>
                <li className="px-4 py-2  hover:text-red-600 hover:bg-gray-200">
                  <Link href="/apparel/men">Men</Link>
                </li>
                <li className="px-4 py-2  hover:text-red-600 hover:bg-gray-200">
                  <Link href="/apparel/women"> Women</Link>
                </li>
                <li className="px-4 py-2  hover:text-red-600 hover:bg-gray-200">
                  <Link href="/apparel/kids">Kids</Link>
                </li>
                <li className="px-4 py-2  hover:text-red-600 hover:bg-gray-200">
                  <Link href="/apparel/tShirts">T-Shirts</Link>
                </li>
                <li className="px-4 py-2  hover:text-red-600 hover:bg-gray-200">
                  <Link href="/apparel/golfers">Golfers</Link>
                </li>
                <li className="px-4 py-2  hover:text-red-600 hover:bg-gray-200">
                  <Link href="/apparel/hoodies">Hoodies</Link>
                </li>
                <li className="px-4 py-2  hover:text-red-600 hover:bg-gray-200">
                  <Link href="/apparel/jackets">Jackets</Link>
                </li>
                <li className="px-4 py-2  hover:text-red-600 hover:bg-gray-200">
                  <Link href="/apparel/bottoms">Bottoms</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="relative group">
            <button className="focus:outline-none flex items-center px-10 py-2 text-gray-600 hover:text-gray-400">
              <Link href="/collections/signatureCollection">
                All Collection
              </Link>

              <MdKeyboardArrowDown />
            </button>
            <div className=" z-10 absolute left-0 ml-8  mt-0 w-52 bg-white text-gray-600 rounded shadow-lg hidden group-hover:block">
              <ul>
                <li className="px-4 py-2  hover:text-red-600 hover:bg-gray-200">
                  <Link href="/collections/signatureCollection">
                    Signature Collection
                  </Link>
                </li>
                <li className="px-4 py-2  hover:text-red-600 hover:bg-gray-200">
                  <Link href="/collections/baseballCollection">
                    Baseball Collection
                  </Link>
                </li>
                <li className="px-4 py-2  hover:text-red-600 hover:bg-gray-200">
                  <Link href="/collections/fashionCollection">
                    Fashion Collection
                  </Link>
                </li>
                <li className="px-4 py-2  hover:text-red-600 hover:bg-gray-200">
                  <Link href="/collections/leisureCollection">
                    Leisure Collection
                  </Link>
                </li>
                <li className="px-4 py-2  hover:text-red-600 hover:bg-gray-200">
                  <Link href="/collections/sportCollection">
                    Sport Collection
                  </Link>
                </li>
                <li className="px-4 py-2  hover:text-red-600 hover:bg-gray-200">
                  <Link href="/collections/industrialCollection">
                    Industrial Collection
                  </Link>
                </li>
                <li className="px-4 py-2  hover:text-red-600 hover:bg-gray-200">
                  <Link href="/collections/camoCollection">
                    Camo Collection
                  </Link>
                </li>
                <li className="px-4 py-2  hover:text-red-600 hover:bg-gray-200">
                  <Link href="/collections/winterCollection">
                    Winter Collection
                  </Link>
                </li>
                <li className="px-4 py-2  hover:text-red-600 hover:bg-gray-200">
                  <Link href="/collections/kidsCollection">
                    Kids Collection
                  </Link>
                </li>
                <li className="px-4 py-2  hover:text-red-600 hover:bg-gray-200">
                  <Link href="/collections/africanCollection">
                    African Collection
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="relative group">
            <Link
              href="/catalogue"
              className="focus:outline-none block px-10 py-4 text-gray-600 hover:text-gray-400"
            >
              Catalogue
            </Link>
          </div>

          <Link
            href="/clearance"
            className="focus:outline-none block px-10 py-4 text-gray-600 hover:text-gray-400"
          >
            CLEARANCE
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Categories;
