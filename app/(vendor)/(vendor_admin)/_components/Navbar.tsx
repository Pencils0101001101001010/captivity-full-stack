"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { RxDividerVertical } from "react-icons/rx";
import { Trash2 } from "lucide-react";
import { useSession } from "../SessionProvider";
import UserButton from "./UserButton";
import { uploadLogo, removeLogo, getLogo } from "../actions";

const Navbar = () => {
  const session = useSession();
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showRemoveButton, setShowRemoveButton] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchLogo = async () => {
      const result = await getLogo();
      if (result.success && result.url) {
        setLogoUrl(result.url);
      }
    };

    if (session?.user) {
      fetchLogo();
    }
  }, [session?.user]);

  const handleLogoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
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
      className="relative w-[170px] h-[54px] group"
      onMouseEnter={() => logoUrl && setShowRemoveButton(true)}
      onMouseLeave={() => setShowRemoveButton(false)}
    >
      {logoUrl ? (
        <>
          <Image
            src={logoUrl}
            alt="Company Logo"
            fill
            className="object-contain hover:opacity-80 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          />
          {showRemoveButton && !uploading && (
            <button
              onClick={handleRemoveLogo}
              className="absolute top-0 right-0 bg-red-500 p-1 rounded-bl-md hover:bg-red-600 transition-colors"
              title="Remove logo"
            >
              <Trash2 size={16} className="text-white" />
            </button>
          )}
        </>
      ) : (
        <div
          className="w-full h-full border-2 border-dashed border-white flex items-center justify-center cursor-pointer hover:border-gray-300"
          onClick={() => fileInputRef.current?.click()}
        >
          <span className="text-sm text-center">
            {uploading ? "Uploading..." : "Click to upload logo"}
          </span>
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleLogoUpload}
        disabled={uploading}
      />
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

  return (
    <div className="sticky top-0 z-50">
      <nav className="bg-black text-white">
        <div className="flex items-center justify-between text-xs mx-auto w-full py-6 px-8">
          {logoSection}

          <div className="hidden md:flex items-center space-x-6">
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
              </>
            )}
          </div>

          <div className="md:hidden flex items-center">
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
  );
};

export default Navbar;
