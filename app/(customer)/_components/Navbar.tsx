"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { RxDividerVertical } from "react-icons/rx";
import { ShoppingCart } from "lucide-react";
import { useSession } from "../SessionProvider";
import UserButton from "./UserButton";
import SlideInCart from "./SlideInCart";
import MobileNavbar from "./MobileNavbar";

const Navbar = () => {
  const session = useSession();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const renderCartIcon = () => (
    <div
      className="relative cursor-pointer"
      onClick={() => setIsCartOpen(true)}
    >
      <ShoppingCart />
      <span
        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
        style={{ border: "2px solid white" }}
      ></span>
    </div>
  );

  return (
    <div>
      <nav className="bg-black text-white">
        <div className="flex items-center justify-center text-xs mx-auto z-10 md:flex w-full py-6 px-8 m-auto">
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
              <div className="flex space-x-10 items-center">
                <UserButton className="text-lg" />
                {renderCartIcon()}
              </div>
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

      <MobileNavbar session={session} renderCartIcon={renderCartIcon} />

      <SlideInCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default Navbar;
