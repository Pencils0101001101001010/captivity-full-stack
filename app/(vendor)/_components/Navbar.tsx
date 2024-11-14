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

// Define types for session
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
  // Add other user properties as needed
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
  const [uploading, setUploading] = useState(false);
  const [showRemoveButton, setShowRemoveButton] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const defaultLogoUrl = "/captivity-logo-white.png";

  // Derive these values from session rather than storing them
  const isVendor = session?.user?.role === "VENDOR";
  const isVendorCustomer =
    session?.user?.role === "VENDORCUSTOMER" ||
    session?.user?.role === "APPROVEDVENDORCUSTOMER";

  useEffect(() => {
    const fetchLogo = async () => {
      if (!session?.user) return;

      try {
        if (session.user.role === "VENDOR") {
          const result = await getLogo();
          if (result.success && result.url) {
            setLogoUrl(result.url);
          }
        } else if (
          (session.user.role === "VENDORCUSTOMER" ||
            session.user.role === "APPROVEDVENDORCUSTOMER") &&
          vendorWebsite
        ) {
          const result = await getVendorLogoBySlug(vendorWebsite);
          if (result.success && result.url) {
            setLogoUrl(result.url);
          }
        }
      } catch (error) {
        console.error("Error fetching logo:", error);
      }
    };

    fetchLogo();
  }, [session?.user, vendorWebsite]);

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

  const logoSection = session?.user ? (
    <div
      className={`relative w-[170px] h-[54px] group ${isVendor ? "cursor-pointer" : ""}`}
      onMouseEnter={() => isVendor && logoUrl && setShowRemoveButton(true)}
      onMouseLeave={() => setShowRemoveButton(false)}
    >
      {logoUrl ? (
        <Link href={isVendor ? `/vendor/${vendorWebsite}` : "#"}>
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
        <Image
          src="/captivity-logo-white.png"
          alt="captivityLogo"
          width={331}
          height={54}
          className="h-auto border border-white"
          priority
        />
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
  ) : (
    <Link href="/vendor_admin" className="w-[170px] h-[54px]">
      <Image
        src="/captivity-logo-white.png"
        alt="captivityLogo"
        width={331}
        height={54}
        className="h-auto border border-white hover:opacity-80 hover:border-2"
        priority
      />
    </Link>
  );

  const VendorNavItems = () => {
    if (!isVendor) return null;

    return (
      <div
        className={`${isMobileMenuOpen ? "flex flex-col space-y-4" : "hidden md:flex"} items-center space-x-6 mr-6`}
      >
        <Link
          href={`/vendor/${vendorWebsite}/add-product`}
          className="flex items-center space-x-2 hover:text-gray-300"
        >
          <PlusCircle size={18} />
          <span>Add Product</span>
        </Link>
        <Link
          href="/vendor/users"
          className="flex items-center space-x-2 hover:text-gray-300"
        >
          <Users size={18} />
          <span>Users</span>
        </Link>
        <Link
          href="/vendor/orders"
          className="flex items-center space-x-2 hover:text-gray-300"
        >
          <ClipboardList size={18} />
          <span>Orders</span>
        </Link>
      </div>
    );
  };

  return (
    <>
      <div className="sticky top-0 z-50">
        <nav className="bg-black text-white">
          <div className="flex items-center justify-between text-xs mx-auto w-full py-6 px-8">
            {logoSection}

            <div className="hidden md:flex items-center justify-between flex-1 ml-6">
              {/* Vendor Navigation Items */}
              {isVendor && <VendorNavItems />}

              <div className="flex items-center space-x-6">
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
                      className="relative p-2 hover:bg-gray-800 rounded-full transition-colors"
                    >
                      <ShoppingCart className="w-6 h-6" />
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        0
                      </span>
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
                      className="relative p-2 hover:bg-gray-800 rounded-full transition-colors"
                    >
                      <ShoppingCart className="w-6 h-6" />
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        0
                      </span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden flex items-center space-x-4">
              {isVendor && (
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                >
                  <Menu size={24} />
                </button>
              )}
              {session?.user ? (
                <>
                  <UserButton className="text-lg" />
                  <button
                    onClick={() => setIsCartOpen(true)}
                    className="relative p-2 hover:bg-gray-800 rounded-full transition-colors"
                  >
                    <ShoppingCart className="w-6 h-6" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      0
                    </span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="font-bold text-lg hover:text-gray-300"
                  >
                    Login
                  </Link>
                  <button
                    onClick={() => setIsCartOpen(true)}
                    className="relative p-2 hover:bg-gray-800 rounded-full transition-colors"
                  >
                    <ShoppingCart className="w-6 h-6" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      0
                    </span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Mobile Vendor Menu */}
          {isMobileMenuOpen && isVendor && (
            <div className="md:hidden bg-black border-t border-gray-800 px-8 py-4">
              <VendorNavItems />
            </div>
          )}
        </nav>

        {/* Mobile search bar */}
        <div className="md:hidden bg-white">
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
      </div>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;
