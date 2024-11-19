"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { RxDividerVertical } from "react-icons/rx";
import {
  ShoppingCart,
  Trash2,
  Package,
  Users,
  ClipboardList,
  PlusCircle,
  Menu,
  Search,
  X,
} from "lucide-react";
import { useSession } from "../SessionProvider";
import UserButton from "./UserButton";
import {
  uploadLogo,
  removeLogo,
  getLogo,
  getVendorLogoBySlug,
} from "../actions";
import { useParams } from "next/navigation";
import CartSidebar from "./CartSidebar";
import { Button } from "@/components/ui/button";

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

const Navbar = () => {
  const session = useSession() as Session;
  const params = useParams();
  const vendorWebsite =
    typeof params?.vendor_website === "string" ? params.vendor_website : "";
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isLogoLoading, setIsLogoLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showRemoveButton, setShowRemoveButton] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const defaultLogoUrl = "/captivity-logo-white.png";
  const isVendor = session?.user?.role === "VENDOR";
  const isVendorCustomer = [
    "VENDORCUSTOMER",
    "APPROVEDVENDORCUSTOMER",
  ].includes(session?.user?.role || "");

  useEffect(() => {
    const fetchLogo = async () => {
      if (!session?.user) {
        setIsLogoLoading(false);
        return;
      }

      try {
        setIsLogoLoading(true);
        if (isVendor) {
          const result = await getLogo();
          if (result.success && result.url) {
            setLogoUrl(result.url);
          }
        } else if (isVendorCustomer && vendorWebsite) {
          const result = await getVendorLogoBySlug(vendorWebsite);
          if (result.success && result.url) {
            setLogoUrl(result.url);
          }
        }
      } catch (error) {
        console.error("Error fetching logo:", error);
      } finally {
        setIsLogoLoading(false);
      }
    };

    fetchLogo();
  }, [session?.user, vendorWebsite, isVendor, isVendorCustomer]);

  const handleLogoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!isVendor) return;

    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("logo", file);

      const result = await uploadLogo(formData);
      if (result.success && result.url) {
        setLogoUrl(result.url);
      } else {
        alert(result.error || "Failed to upload logo");
      }
    } catch (error) {
      console.error("Error uploading logo:", error);
      alert("Failed to upload logo");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveLogo = async () => {
    if (!isVendor) return;

    if (window.confirm("Are you sure you want to remove your logo?")) {
      try {
        setUploading(true);
        const result = await removeLogo();
        if (result.success) {
          setLogoUrl(null);
        } else {
          alert(result.error || "Failed to remove logo");
        }
      } catch (error) {
        console.error("Error removing logo:", error);
        alert("Failed to remove logo");
      } finally {
        setUploading(false);
        setShowRemoveButton(false);
      }
    }
  };

  const LogoSection = () => (
    <div
      className="relative w-[170px] h-[54px] group"
      onMouseEnter={() => isVendor && logoUrl && setShowRemoveButton(true)}
      onMouseLeave={() => setShowRemoveButton(false)}
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
            {isVendor && showRemoveButton && !uploading && (
              <button
                onClick={e => {
                  e.preventDefault();
                  handleRemoveLogo();
                }}
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
            {uploading ? "Uploading..." : "Click to upload logo"}
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
          disabled={uploading}
        />
      )}
    </div>
  );

  const NavigationButtons = () => (
    <div className="flex flex-col md:flex-row gap-2 md:gap-3">
      <Button asChild className="bg-blue-300 w-full md:w-auto">
        <Link href={`/vendor/${vendorWebsite}/welcome`}>Back</Link>
      </Button>
      <Button asChild variant="secondary" className="w-full md:w-auto">
        <Link href={`/vendor/${vendorWebsite}`}>Home</Link>
      </Button>
      <Button asChild variant="destructive" className="w-full md:w-auto">
        <Link
          href={`/vendor/${vendorWebsite}/shopping/product_categories/summer`}
        >
          Shop
        </Link>
      </Button>
    </div>
  );

  const SearchBar = () => (
    <div className="flex w-full md:w-auto">
      <input
        type="text"
        placeholder="Search for product"
        className="px-2 w-full md:w-[150px] py-2 rounded-l-sm bg-white text-black"
      />
      <button className="bg-red-600 text-sm rounded-r-sm text-white px-4 py-2 hover:bg-red-500 whitespace-nowrap">
        SEARCH
      </button>
    </div>
  );

  const VendorNavItems = () => {
    if (!isVendor) return null;

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
            className="flex items-center gap-2 hover:text-gray-300 transition-colors"
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div className="sticky top-0 z-50">
      <nav className="bg-black text-white p-9">
        <div className="mx-auto w-full py-6 px-4 md:px-8">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-between">
            <div className="flex items-center gap-6">
              <LogoSection />
              <NavigationButtons />
            </div>

            <div className="flex items-center gap-6">
              {isVendor && <VendorNavItems />}
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
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="relative p-2 hover:bg-gray-800 rounded-full transition-colors"
                >
                  <ShoppingCart className="w-6 h-6" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    0
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <div className="flex items-center justify-between mb-4">
              <LogoSection />
              <div className="flex items-center gap-4">
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
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="relative p-2 hover:bg-gray-800 rounded-full transition-colors"
                >
                  <ShoppingCart className="w-6 h-6" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    0
                  </span>
                </button>
              </div>
            </div>

            {/* Mobile Search */}
            {showMobileSearch && (
              <div className="mb-4">
                <SearchBar />
              </div>
            )}

            {/* Mobile Navigation Buttons */}
            <NavigationButtons />

            {/* Mobile Vendor Menu */}
            {isMobileMenuOpen && isVendor && (
              <div className="mt-4 border-t border-gray-800 pt-4">
                <VendorNavItems />
              </div>
            )}
          </div>
        </div>
      </nav>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default Navbar;
