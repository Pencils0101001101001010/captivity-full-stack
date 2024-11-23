"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { RxDividerVertical } from "react-icons/rx";
import { Search, X, Menu } from "lucide-react";
import { useSession } from "../SessionProvider";
import UserButton from "./UserButton";
import { useParams } from "next/navigation";
import useVendorCartStore from "../vendor/[vendor_website]/shop_product/cart/useCartStore";
import VendorCartSidebar from "./CartSidebar";
import { useLogoData } from "../vendor/[vendor_website]/welcome/_store/LogoStore";
import { Session } from "./_navbarComp/types";
import { LogoSection } from "./_navbarComp/LogoSection";
import { NavigationButtons } from "./_navbarComp/NavigationButtons";
import { VendorNavItems } from "./_navbarComp/VendorNavItems";
import { SearchBar } from "./_navbarComp/SearchBar";
import { CartButton } from "./_navbarComp/CartButton";

const Navbar = () => {
  const session = useSession() as Session;
  const params = useParams();
  const vendorWebsite =
    typeof params?.vendor_website === "string" ? params.vendor_website : "";

  // UI states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showRemoveButton, setShowRemoveButton] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cart states
  const cart = useVendorCartStore(useCallback(state => state.cart, []));
  const isCartInitialized = useVendorCartStore(
    useCallback(state => state.isInitialized, [])
  );
  const initialize = useVendorCartStore(
    useCallback(state => state.initialize, [])
  );

  const cartItemCount =
    cart?.vendorCartItems?.reduce(
      (total, item) => total + (item?.quantity || 0),
      0
    ) || 0;

  const defaultLogoUrl = "/captivity-logo-white.png";
  const isVendor = session?.user?.role === "VENDOR";
  const isVendorCustomer = [
    "VENDORCUSTOMER",
    "APPROVEDVENDORCUSTOMER",
  ].includes(session?.user?.role || "");

  // Initialize cart
  useEffect(() => {
    if (session?.user && (isVendor || isVendorCustomer) && !isCartInitialized) {
      initialize();
    }
  }, [
    session?.user,
    isVendor,
    isVendorCustomer,
    initialize,
    isCartInitialized,
  ]);

  // Logo handling
  const {
    logoUrl,
    isLoading: isLogoLoading,
    upload,
    remove,
  } = useLogoData(vendorWebsite);

  const handleLogoUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!isVendor) return;

      const file = event.target.files?.[0];
      if (!file) return;

      try {
        const formData = new FormData();
        formData.append("logo", file);
        await upload(formData);
      } catch (error) {
        console.error("Error uploading logo:", error);
      }
    },
    [isVendor, upload]
  );

  const handleRemoveLogo = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      if (!isVendor) return;

      if (window.confirm("Are you sure you want to remove your logo?")) {
        try {
          await remove();
          setShowRemoveButton(false);
        } catch (error) {
          console.error("Error removing logo:", error);
        }
      }
    },
    [isVendor, remove]
  );

  const handleCartClick = useCallback(() => {
    setIsCartOpen(true);
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (isVendor && logoUrl) {
      setShowRemoveButton(true);
    }
  }, [isVendor, logoUrl]);

  const handleMouseLeave = useCallback(() => {
    setShowRemoveButton(false);
  }, []);

  return (
    <div className="sticky top-0 z-50">
      <nav className="bg-black text-white p-2">
        <div className="mx-auto w-full py-4 px-4 md:px-8">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-between">
            <div className="flex items-center gap-6">
              <LogoSection
                logoUrl={logoUrl}
                isLogoLoading={isLogoLoading}
                isVendor={isVendor}
                isVendorCustomer={isVendorCustomer}
                vendorWebsite={vendorWebsite}
                showRemoveButton={showRemoveButton}
                defaultLogoUrl={defaultLogoUrl}
                handleLogoUpload={handleLogoUpload}
                handleRemoveLogo={handleRemoveLogo}
                fileInputRef={fileInputRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              />
              <NavigationButtons vendorWebsite={vendorWebsite} />
            </div>

            <div className="flex items-center gap-6">
              {isVendor && <VendorNavItems vendorWebsite={vendorWebsite} />}
              <SearchBar />

              <div className="flex items-center gap-4">
                {session?.user ? (
                  <>
                    <UserButton className="text-lg" />
                  </>
                ) : (
                  <>
                    <Link href="/login" className="hover:text-gray-300">
                      Login
                    </Link>
                    <RxDividerVertical />
                    <Link href="/signup" className="hover:text-gray-300">
                      Register
                    </Link>
                  </>
                )}
                <CartButton
                  onClick={handleCartClick}
                  cartItemCount={cartItemCount}
                  isCartInitialized={isCartInitialized}
                />
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <div className="flex gap-1">
              <LogoSection
                logoUrl={logoUrl}
                isLogoLoading={isLogoLoading}
                isVendor={isVendor}
                isVendorCustomer={isVendorCustomer}
                vendorWebsite={vendorWebsite}
                showRemoveButton={showRemoveButton}
                defaultLogoUrl={defaultLogoUrl}
                handleLogoUpload={handleLogoUpload}
                handleRemoveLogo={handleRemoveLogo}
                fileInputRef={fileInputRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              />
              <div className="flex gap-1">
                <button
                  onClick={() => setShowMobileSearch(!showMobileSearch)}
                  className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                >
                  {showMobileSearch ? <X size={24} /> : <Search size={24} />}
                </button>
                {isVendor && (
                  <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                  >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                  </button>
                )}
                {session?.user ? (
                  <UserButton className="text-lg" />
                ) : (
                  <Link href="/login" className="font-bold hover:text-gray-300">
                    Login
                  </Link>
                )}
                <CartButton
                  onClick={handleCartClick}
                  cartItemCount={cartItemCount}
                  isCartInitialized={isCartInitialized}
                />
              </div>
            </div>

            {/* Mobile Search */}
            {showMobileSearch && (
              <div className="mt-4">
                <SearchBar />
              </div>
            )}

            {/* Mobile Navigation Buttons */}
            <div className="mt-4">
              <NavigationButtons vendorWebsite={vendorWebsite} />
            </div>

            {/* Mobile Vendor Menu */}
            {isMobileMenuOpen && isVendor && (
              <div className="mt-4 border-t border-gray-800 pt-4">
                <VendorNavItems vendorWebsite={vendorWebsite} />
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Cart Sidebar */}
      <VendorCartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        vendorWebsite={vendorWebsite}
      />
    </div>
  );
};

export default Navbar;
