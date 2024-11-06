"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { GoHomeFill } from "react-icons/go";
import { TbCategoryFilled } from "react-icons/tb";
import { FaHeart } from "react-icons/fa";
import { MdAccountCircle } from "react-icons/md";
import { RxDividerVertical } from "react-icons/rx";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const MobileMenuItem: React.FC<{
    href: string;
    children: React.ReactNode;
  }> = ({ href, children }) => (
    <li className="px-4 py-2 hover:bg-gray-200 hover:text-red-500">
      <Link href={href}>{children}</Link>
    </li>
  );

  const DesktopMenuItem: React.FC<{
    href: string;
    children: React.ReactNode;
  }> = ({ href, children }) => (
    <Link href={href} className="hover:text-gray-300">
      <span>{children}</span>
    </Link>
  );

  const MobileNavItem: React.FC<{
    href: string;
    icon: React.ReactElement;
    label: string;
  }> = ({ href, icon, label }) => (
    <Link
      href={href}
      className="flex flex-col items-center py-2 hover:text-red-500"
    >
      {icon}
      <div className="text-xs mt-2">{label}</div>
    </Link>
  );

  return (
    <div>
      <nav className="bg-black text-white">
        <div className="flex items-center justify-center text-xs mx-auto z-10 md:flex w-full py-6 px-8 m-auto">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden absolute top-6 left-7"
              >
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
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4">
                <MobileMenuItem href="/products/headwear/new-in-headwear">
                  Headwear Collection
                </MobileMenuItem>
                <MobileMenuItem href="/products/apparel/new-in-apparel">
                  Apparel Collection
                </MobileMenuItem>
                <MobileMenuItem href="/products/all-collections/signature-collection">
                  All Collections
                </MobileMenuItem>
                <MobileMenuItem href="/catalogue">Catalogue</MobileMenuItem>
                <MobileMenuItem href="/clearance">CLEARANCE</MobileMenuItem>
                <MobileMenuItem href="/Help">Help</MobileMenuItem>
                <MobileMenuItem href="/signup">Register</MobileMenuItem>
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/" className="w-[170px] h-[10px] mb-5">
            <Image
              src="/captivity-logo-white.png"
              alt="captivityLogo"
              width={331}
              height={54}
              className="flex items-center justify-between md:min-w-40 h-auto"
              priority
            />
          </Link>

          <Link
            href="/login"
            className="font-bold md:hidden absolute top-6 right-7 text-lg lg:hidden hover:text-gray-300"
          >
            Login
          </Link>

          <div className="hidden md:flex items-center space-x-20">
            <DesktopMenuItem href="/Help">Help</DesktopMenuItem>
            <div className="md:flex md:flex-nowrap">
              <Input
                type="text"
                placeholder="Search for product"
                className="w-[150px] rounded-r-none"
              />
              <Button className="rounded-l-none bg-red-600 hover:bg-red-500">
                SEARCH
              </Button>
            </div>
            <DesktopMenuItem href="/login">Login</DesktopMenuItem>
            <div>
              <RxDividerVertical className="-mr-5" />
            </div>
            <DesktopMenuItem href="/signup">Register</DesktopMenuItem>
          </div>
        </div>
      </nav>

      <div className="md:hidden m-2">
        <div className="flex items-center justify-center border-b-2 p-2">
          <Input
            type="text"
            placeholder="Search for product"
            className="w-[150px] rounded-r-none"
          />
          <Button className="rounded-l-none bg-red-600 hover:bg-red-500">
            SEARCH
          </Button>
        </div>
      </div>

      <div className="md:hidden fixed inset-x-0 bottom-0 bg-white shadow-xl shadow-gray-400 border-t-2 border-t-gray-400 border-2 ml-5 mr-5 z-10">
        <div className="flex justify-around text-gray-500 m-auto">
          <MobileNavItem href="/" icon={<GoHomeFill />} label="Home" />
          <MobileNavItem
            href="/mobileCategories"
            icon={<TbCategoryFilled />}
            label="Categories"
          />
          <MobileNavItem
            href="/Favourites"
            icon={<FaHeart />}
            label="Favourites"
          />
          <MobileNavItem
            href="/Login"
            icon={<MdAccountCircle />}
            label="Account"
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
