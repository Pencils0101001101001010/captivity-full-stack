"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { GoHomeFill } from "react-icons/go";
import { TbCategoryFilled } from "react-icons/tb";
import { FaHeart } from "react-icons/fa";
import { MdAccountCircle } from "react-icons/md";
import { RxDividerVertical } from "react-icons/rx";
import { ShoppingCart } from "lucide-react";
import { useSession } from "../SessionProvider";
import UserButton from "./UserButton";
import useCartStore from "../customer/_store/useCartStore";
import SlideInCart from "../customer/shopping/cart/SlideInCart";

const Navbar = () => {
  const session = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cart = useCartStore(state => state.cart);

  const cartItemCount =
    cart?.cartItems.reduce((total, item) => total + item.quantity, 0) || 0;

  useEffect(() => {
    // Fetch cart data when component mounts
    useCartStore.getState().fetchCart();
  }, []);

  return (
    <div>
      <nav className="bg-black text-white">
        <div className="flex items-center justify-between text-xs mx-auto z-10 w-full py-6 px-8">
          <div className="md:hidden">
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

          <Link href="/customer" className="w-[170px] h-[10px] mb-5">
            <Image
              src="/captivity-logo-white.png"
              alt="captivityLogo"
              width={331}
              height={54}
              className="h-auto border border-white hover:opacity-80 hover:border-2"
              priority
            />
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link href="/help" className="hover:text-gray-300">
              <span>Help</span>
            </Link>
            <div className="flex">
              <input
                type="text"
                placeholder="Search for product"
                className="px-2 w-[150px] py-2 rounded-l-sm bg-white text-black"
              />
              <button className="bg-red-600 text-sm rounded-r-sm text-white px-2 py-2 hover:bg-red-500">
                SEARCH
              </button>
            </div>
            {session?.user ? (
              <div className="flex items-center space-x-4">
                <UserButton className="text-lg" />
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="relative"
                >
                  <ShoppingCart size={24} />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {cartItemCount}
                    </span>
                  )}
                </button>
              </div>
            ) : (
              <>
                <Link href="/login" className="hover:text-gray-300">
                  Login
                </Link>
                <RxDividerVertical />
                <Link href="/signup" className="hover:text-gray-300">
                  Register
                </Link>
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="relative"
                >
                  <ShoppingCart size={24} />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {cartItemCount}
                    </span>
                  )}
                </button>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative mr-4"
            >
              <ShoppingCart size={24} />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cartItemCount}
                </span>
              )}
            </button>
            {session?.user ? (
              <UserButton className="text-lg" />
            ) : (
              <Link
                href="/login"
                className="font-bold text-lg hover:text-gray-300"
              >
                Login
              </Link>
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
              <Link href="/collections/category">Collections</Link>
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
      <div className="md:hidden m-2">
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
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex flex-col items-center py-2 hover:text-red-500 relative"
          >
            <ShoppingCart size={20} />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                {cartItemCount}
              </span>
            )}
            <div className="text-xs mt-2">Cart</div>
          </button>
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

      {/* Slide-in Cart */}
      <SlideInCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default Navbar;
