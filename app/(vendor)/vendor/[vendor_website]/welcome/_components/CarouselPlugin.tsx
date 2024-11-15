"use client";

import Image from "next/image";
import { useEffect, useState, useRef, useCallback } from "react";
import { Trash2, Plus } from "lucide-react";
import { useBannerStore } from "../_store/BannerStore";
import { useParams } from "next/navigation";
import { useSession } from "@/app/(vendor)/SessionProvider";

const MAX_BANNERS = 5;

export default function CarouselPlugin() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useSession();
  const params = useParams();
  const vendorWebsite =
    typeof params?.vendor_website === "string" ? params.vendor_website : "";

  const {
    banners,
    isLoading,
    error,
    uploadBanner,
    removeBanner,
    fetchBanners,
    fetchVendorBanners,
  } = useBannerStore();

  useEffect(() => {
    const fetchAppropriateContent = async () => {
      if (!user) return;

      try {
        if (user.role === "VENDOR") {
          await fetchBanners();
        } else if (user.role === "VENDORCUSTOMER" && vendorWebsite) {
          await fetchVendorBanners(vendorWebsite);
        }
      } catch (error) {
        console.error("Error fetching banners:", error);
      }
    };

    fetchAppropriateContent();
  }, [user, vendorWebsite, fetchBanners, fetchVendorBanners]);

  const isVendor = user?.role === "VENDOR";
  const showUploadSlot = isVendor && banners.length < MAX_BANNERS;
  const allSlides: (string | "upload-slot")[] = showUploadSlot
    ? [...banners, "upload-slot"]
    : banners;

  const startCarousel = useCallback(() => {
    if (allSlides.length <= 1) return;
    intervalRef.current = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % allSlides.length);
    }, 4000);
  }, [allSlides.length]);

  const stopCarousel = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  useEffect(() => {
    startCarousel();
    return () => stopCarousel();
  }, [startCarousel, stopCarousel]);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!isVendor) return;

    const file = event.target.files?.[0];
    if (!file) return;

    if (banners.length >= MAX_BANNERS) {
      alert(`Maximum ${MAX_BANNERS} banners allowed`);
      return;
    }

    const formData = new FormData();
    formData.append("banner", file);
    await uploadBanner(formData);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveBanner = async (url: string) => {
    if (!isVendor) return;

    if (window.confirm("Are you sure you want to remove this banner?")) {
      await removeBanner(url);
      if (currentIndex >= banners.length - 1) {
        setCurrentIndex(0);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-[150px] sm:h-[200px] md:h-[250px] lg:h-[300px] flex items-center justify-center bg-gray-50">
        <p>Loading banners...</p>
      </div>
    );
  }

  if (banners.length === 0 && !showUploadSlot) {
    return null;
  }

  return (
    <div className="relative overflow-hidden w-full h-[150px] sm:h-[200px] md:h-[250px] lg:h-[300px] group">
      <div
        className="flex transition-transform duration-500 h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {allSlides.map((slide, index) => (
          <div
            key={slide === "upload-slot" ? "upload" : `banner-${index}`}
            className="flex-shrink-0 w-full h-full relative"
          >
            {slide === "upload-slot" && isVendor ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="w-full max-w-[300px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[800px] h-[100px] sm:h-[150px] md:h-[200px] lg:h-[250px] flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-2 rounded-full bg-gray-100">
                      <Plus size={20} className="text-gray-500" />
                    </div>
                    <div className="flex flex-col items-center text-center">
                      <p className="text-xs text-gray-500 mb-1">
                        Click to upload banner ({banners.length}/{MAX_BANNERS})
                      </p>
                      <p className="text-[11px] text-gray-400 font-medium">
                        Recommended dimensions:
                      </p>
                      <p className="text-[11px] text-gray-400">
                        width=1903 x height=438 pixels
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative group w-full h-full">
                <Image
                  src={slide}
                  alt={`Banner ${index + 1}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
                  className="object-cover"
                  priority
                />
                {isVendor && (
                  <button
                    onClick={() => handleRemoveBanner(slide)}
                    className="absolute top-2 sm:top-4 left-2 sm:left-4 p-1.5 sm:p-2 bg-white/80 rounded-full 
                             opacity-0 group-hover:opacity-100 transition-opacity
                             hover:bg-white hover:text-red-500 z-10"
                  >
                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {isVendor && isLoading && (
        <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-white/80 px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm">
          Uploading...
        </div>
      )}

      {isVendor && error && (
        <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-red-500 text-white px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
