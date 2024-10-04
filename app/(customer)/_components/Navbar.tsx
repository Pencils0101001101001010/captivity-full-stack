"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "../SessionProvider";
import UserButton from "./UserButton";

import { GoHomeFill } from "react-icons/go";
import { TbCategoryFilled } from "react-icons/tb";
import { FaHeart } from "react-icons/fa";
import { MdAccountCircle } from "react-icons/md";
import { RxDividerVertical } from "react-icons/rx";
import React from "react";

const Navbar = () => {
  const  session  = useSession();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <nav className="bg-black text-white">
        <div className="flex items-center justify-center text-xs mx-auto z-10 md:flex w-full py-6 px-8 m-auto">
          <div className="md:hidden absolute top-6 left-7">
            <button onClick={() => setIsOpen(!isOpen)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>
          <Link href="/" className="w-[170px] h-[10px] mb-5">
            <span>
              <Image
                src="/captivity-logo-white.png"
                alt="captivityLogo"
                width={331}
                height={54}
                className="flex items-center justify-between md:min-w-40 h-auto"
                priority
              />
            </span>
          </Link>
          
          {/* Mobile Phone login/user button */}
          <div className="md:hidden absolute top-6 right-7">
            {session?.user ? (
              <UserButton className="text-lg" />
            ) : (
              <Link href="/login" className="font-bold text-lg hover:text-gray-300">
                Login
              </Link>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-20">
            <Link href="/help" className="hover:text-gray-300">
              <span className="ml-5">Help</span>
            </Link>
            <div className="md:flex md:flex-nowrap">
              <input
                type="text"
                placeholder="Search for product"
                className="px-2 w-[150px] py-2 rounded-l-sm bg-white text-black"
              />
              <button className="bg-red-600 text-sm rounded-r-sm mr-16 text-white px-2 py-2 hover:bg-red-500">
                SEARCH
              </button>
            </div>
            {session?.user ? (
              <UserButton />
            ) : (
              <>
                <Link href="/login">
                  <span className="hover:text-gray-300">Login</span>
                </Link>
                <div>
                  <RxDividerVertical className="-mr-5" />
                </div>
                <Link href="/signup">
                  <span className="hover:text-gray-300 -ml-16">Register</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white text-black shadow-xl z-10">
          <ul>
            <li className="px-4 py-2 hover:bg-gray-200 hover:text-red-500">
              <Link href="/headwear/category">Headwear Collection</Link>
            </li>
            <li className="px-4 py-2 hover:bg-gray-200 hover:text-red-500">
              <Link href="/apparel/category">Apparel Collection</Link>
            </li>
            <li className="px-4 py-2 hover:bg-gray-200 hover:text-red-500">
              <Link href="/collections/category">All Collections</Link>
            </li>
            <li className="px-4 py-2 hover:bg-gray-200 hover:text-red-500">
              <Link href="/catalogue">Catalogue</Link>
            </li>
            <li className="px-4 py-2 hover:bg-gray-200 hover:text-red-500">
              <Link href="/clearance">CLEARANCE</Link>
            </li>
            <li className="px-4 py-2 hover:bg-gray-200 hover:text-red-500">
              <Link href="/Help">Help</Link>
            </li>
            {!session?.user && (
              <li className="px-4 py-2 hover:bg-gray-200 hover:text-red-500">
                <Link href="/signup">Register</Link>
              </li>
            )}
          </ul>
        </div>
      )}
      
      {/* Mobile search bar */}
      <div className="md:hidden lg:hidden m-2">
        <div className="flex items-center justify-center border-b-2 p-2">
          <input
            type="text"
            placeholder="Search for product"
            className="px-2 w-[150px] py-2 bg-white rounded-l-sm text-black border-2"
          />
          <button className="bg-red-600 hover:bg-red-500 rounded-r-sm text-white px-2 py-2">
            SEARCH
          </button>
        </div>
      </div>
      
      {/* Mobile bottom Nav */}
      <div className="md:hidden fixed inset-x-0 bottom-0 bg-white shadow-xl shadow-gray-400 border-t-2 border-t-gray-400 border-2 ml-5 mr-5 z-10">
        <div className="flex justify-around text-gray-500 m-auto">
          <Link
            href="/"
            className="flex flex-col items-center py-2 hover:text-red-500"
          >
            <GoHomeFill />
            <div className="text-xs mt-2">Home</div>
          </Link>
          <Link
            href="/mobileCategories"
            className="flex flex-col items-center py-2 hover:text-red-500"
          >
            <TbCategoryFilled />
            <div className="text-xs mt-2">Categories</div>
          </Link>
          <Link
            href="/Favourites"
            className="flex text-gray-600 flex-col items-center py-2 hover:text-red-500"
          >
            <FaHeart />
            <div className="text-xs mt-2">Favourites</div>
          </Link>
          <Link
            href={session?.user ? `/users/${session.user.username}` : "/Login"}
            className="flex flex-col items-center py-2 hover:text-red-500"
          >
            <MdAccountCircle />
            <div className="text-xs mt-2">Account</div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;