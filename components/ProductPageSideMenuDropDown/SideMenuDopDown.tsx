"use client";
import Link from "next/link";
import React, { useState } from "react";
import { FaRegWindowMinimize } from "react-icons/fa";
import { SlArrowDown } from "react-icons/sl";

const SideMenuDopDown = () => {
  const [openCollection, setOpenCollection] = useState(null);

  const toggleContent = (collection) => {
    setOpenCollection(openCollection === collection ? null : collection);
  };
  return (
    <div className="hidden lg:block">
      <button onClick={() => toggleContent("c1")}>
        <span>
          {openCollection === "c1" ? <FaRegWindowMinimize /> : <SlArrowDown />}
        </span>{" "}
        <span className="text-xl text-gray-700 font-bold">
          Collection
          <div className="w-[300px] h-px bg-gray-500 my-2" />
        </span>
      </button>
      {openCollection === "c1" && (
        <div id="c1">
          <ul>
            <li className="px-4 py-2  hover:text-red-600 hover:bg-gray-200">
              <Link href="/collections/signature-collection">
                Signature Collection
              </Link>
            </li>
            <li className="px-4 py-2  hover:text-red-600 hover:bg-gray-200">
              <Link href="/collections/baseball-collection">
                Baseball Collection
              </Link>
            </li>
            <li className="px-4 py-2  hover:text-red-600 hover:bg-gray-200">
              <Link href="/collections/fashion-collection">
                Fashion Collection
              </Link>
            </li>
            <li className="px-4 py-2  hover:text-red-600 hover:bg-gray-200">
              <Link href="/collections/leisure-collection">
                Leisure Collection
              </Link>
            </li>
            <li className="px-4 py-2  hover:text-red-600 hover:bg-gray-200">
              <Link href="/collections/sport-collection">Sport Collection</Link>
            </li>
            <li className="px-4 py-2  hover:text-red-600 hover:bg-gray-200">
              <Link href="/collections/industrial-collection">
                Industrial Collection
              </Link>
            </li>
            <li className="px-4 py-2  hover:text-red-600 hover:bg-gray-200">
              <Link href="/collections/camo-collection">Camo Collection</Link>
            </li>
            <li className="px-4 py-2  hover:text-red-600 hover:bg-gray-200">
              <Link href="/collections/winter-collection">
                Winter Collection
              </Link>
            </li>
            <li className="px-4 py-2  hover:text-red-600 hover:bg-gray-200">
              <Link href="/collections/kids-collection">Kids Collection</Link>
            </li>
            <li className="px-4 py-2  hover:text-red-600 hover:bg-gray-200">
              <Link href="/collections/african-collection">
                African Collection
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default SideMenuDopDown;
