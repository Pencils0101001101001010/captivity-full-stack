"use client";

import React, { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { RxDividerVertical } from "react-icons/rx";
import {
  ShoppingCart,
  Trash2,
  PlusCircle,
  Menu,
  Search,
  X,
  Home,
  Store,
  Loader2,
  Users,
  ClipboardList,
} from "lucide-react";
import { useSession } from "../SessionProvider";
import UserButton from "./UserButton";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import useVendorCartStore from "../vendor/[vendor_website]/shop_product/cart/useCartStore";
import VendorCartSidebar from "./CartSidebar";
import { useRef } from "react";
import { useLogoData } from "../vendor/[vendor_website]/welcome/_store/LogoStore";

type UserRole =
  | "USER"
  | "CUSTOMER"
  | "SUBSCRIBER"
  | "PROMO"
  | "DISTRIBUTOR"
  | "SHOPMANAGER"
  | "EDITOR"
  | "ADMIN"
  | "SUPERADMIN"
  | "VENDOR"
  | "VENDORCUSTOMER"
  | "APPROVEDVENDORCUSTOMER";

interface User {
  id: string;
  role: UserRole;
}

interface Session {
  user: User | null;
}

// Memoized Cart Button Component
const CartButton = React.memo(
  ({
    onClick,
    cartItemCount,
    isCartInitialized,
  }: {
    onClick: () => void;
    cartItemCount: number;
    isCartInitialized: boolean;
  }) => (
    <button
      onClick={onClick}
      className="relative p-2 hover:bg-gray-800 rounded-full transition-colors"
      disabled={!isCartInitialized}
    >
      <ShoppingCart className="w-6 h-6" />
      {!isCartInitialized ? (
        <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center">
          <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
        </span>
      ) : (
        cartItemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {cartItemCount}
          </span>
        )
      )}
    </button>
  )
);

CartButton.displayName = "CartButton";

// Memoized Logo Section Component
const LogoSection = React.memo(
  ({
    logoUrl,
    isLogoLoading,
    isVendor,
    isVendorCustomer,
    vendorWebsite,
    showRemoveButton,
    defaultLogoUrl,
    handleLogoUpload,
    handleRemoveLogo,
    fileInputRef,
    onMouseEnter,
    onMouseLeave,
  }: {
    logoUrl: string | null;
    isLogoLoading: boolean;
    isVendor: boolean;
    isVendorCustomer: boolean;
    vendorWebsite: string;
    showRemoveButton: boolean;
    defaultLogoUrl: string;
    handleLogoUpload: (
      event: React.ChangeEvent<HTMLInputElement>
    ) => Promise<void>;
    handleRemoveLogo: (e: React.MouseEvent) => Promise<void>;
    fileInputRef: React.RefObject<HTMLInputElement>;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
  }) => (
    <div
      className="relative w-[170px] h-[54px] group"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {isLogoLoading ? (
        <div className="w-full h-full bg-gray-800 animate-pulse rounded" />
      ) : logoUrl ? (
        <Link
          href={isVendor || isVendorCustomer ? `/vendor/${vendorWebsite}` : "#"}
        >
          <div className="relative w-full h-full">
            <Image
              src={logoUrl}
              alt="Company Logo"
              fill
              className={`object-contain ${isVendor ? "hover:opacity-80" : ""}`}
              onClick={e => {
                if (isVendor && fileInputRef.current) {
                  e.preventDefault();
                  fileInputRef.current.click();
                }
              }}
              priority
            />
            {isVendor && showRemoveButton && !isLogoLoading && (
              <button
                onClick={handleRemoveLogo}
                className="absolute top-0 right-0 bg-red-500 p-1 rounded-bl-md hover:bg-red-600 transition-colors"
                title="Remove logo"
              >
                <Trash2 size={16} className="text-white" />
              </button>
            )}
          </div>
        </Link>
      ) : isVendor ? (
        <div
          className="w-full h-full border-2 border-dashed border-white flex items-center justify-center cursor-pointer hover:border-gray-300"
          onClick={() => fileInputRef.current?.click()}
        >
          <span className="text-sm text-center">
            {isLogoLoading ? "Uploading..." : "Click to upload logo"}
          </span>
        </div>
      ) : (
        <Link
          href={isVendorCustomer ? `/vendor/${vendorWebsite}` : "/vendor_admin"}
        >
          <Image
            src={defaultLogoUrl}
            alt="captivityLogo"
            width={331}
            height={54}
            className="h-auto border border-white hover:opacity-80 hover:border-2"
            priority
          />
        </Link>
      )}
      {isVendor && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleLogoUpload}
          disabled={isLogoLoading}
        />
      )}
    </div>
  )
);

LogoSection.displayName = "LogoSection";

// Memoized Navigation Buttons Component
const NavigationButtons = React.memo(
  ({ vendorWebsite }: { vendorWebsite: string }) => (
    <div className="flex flex-col md:flex-row gap-2 md:gap-3">
      <Button
        variant="default"
        size="sm"
        className="w-full md:w-auto flex items-center gap-2"
        asChild
      >
        <Link href={`/vendor/${vendorWebsite}/welcome`}>
          <Home className="w-4 h-4" />
          <span className="hidden md:inline">Back</span>
        </Link>
      </Button>
      <Button
        variant="secondary"
        size="sm"
        className="w-full md:w-auto flex items-center gap-2"
        asChild
      >
        <Link href={`/vendor/${vendorWebsite}`}>
          <Store className="w-4 h-4" />
          <span className="hidden md:inline">Home</span>
        </Link>
      </Button>
      <Button
        variant="destructive"
        size="sm"
        className="w-full md:w-auto"
        asChild
      >
        <Link
          href={`/vendor/${vendorWebsite}/shopping/product_categories/summer`}
        >
          Shop
        </Link>
      </Button>
    </div>
  )
);

NavigationButtons.displayName = "NavigationButtons";

// Memoized Search Bar Component
const SearchBar = React.memo(() => (
  <div className="flex w-full md:w-auto">
    <input
      type="text"
      placeholder="Search for product"
      className="px-4 py-2 w-full md:w-[200px] lg:w-[300px] rounded-l-md border border-r-0 border-input bg-background text-foreground"
    />
    <button className="px-4 py-2 bg-primary text-primary-foreground rounded-r-md hover:bg-primary/90 transition-colors">
      Search
    </button>
  </div>
));

SearchBar.displayName = "SearchBar";

// Memoized Vendor Nav Items Component
const VendorNavItems = React.memo(
  ({ vendorWebsite }: { vendorWebsite: string }) => {
    const navItems = [
      {
        href: `/vendor/${vendorWebsite}/add-product`,
        icon: <PlusCircle size={18} />,
        label: "Add Product",
      },
      {
        href: "/vendor/users",
        icon: <Users size={18} />,
        label: "Users",
      },
      {
        href: "/vendor/orders",
        icon: <ClipboardList size={18} />,
        label: "Orders",
      },
    ];

    return (
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-2 hover:text-primary/80 transition-colors"
          >
            {item.icon}
            <span className="md:hidden lg:inline">{item.label}</span>
          </Link>
        ))}
      </div>
    );
  }
);

VendorNavItems.displayName = "VendorNavItems";

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
  const fetchCart = useVendorCartStore(
    useCallback(state => state.fetchCart, [])
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
      fetchCart();
    }
  }, [session?.user, isVendor, isVendorCustomer, fetchCart, isCartInitialized]);

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
      <nav className="bg-black text-white">
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
            <div className="flex items-center justify-between">
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
              <div className="flex items-center gap-3">
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
