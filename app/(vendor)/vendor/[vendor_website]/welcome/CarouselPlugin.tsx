"use client";

import Image from "next/image";
import { useEffect, useState, useRef, useCallback } from "react";
import { Trash2, Plus } from "lucide-react";
import { useBannerStore } from "./_store/BannerStore";
import { useSession } from "@/app/(vendor)/SessionProvider";

const MAX_BANNERS = 5;

export default function CarouselPlugin() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useSession();

  const {
    banners,
    isLoading,
    error,
    uploadBanner,
    removeBanner,
    fetchBanners,
  } = useBannerStore();

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

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
    if (window.confirm("Are you sure you want to remove this banner?")) {
      await removeBanner(url);
      if (currentIndex >= banners.length - 1) {
        setCurrentIndex(0);
      }
    }
  };

  if (banners.length === 0 && !showUploadSlot) {
    return null;
  }

  return (
    <div className="relative overflow-hidden w-full h-[438px] group">
      <div
        className="flex transition-transform duration-500"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {allSlides.map((slide, index) => (
          <div
            key={slide === "upload-slot" ? "upload" : `banner-${index}`}
            className="flex-shrink-0 w-full h-full flex items-center justify-center"
          >
            {slide === "upload-slot" && isVendor ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="w-[800px] h-[300px] flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-3 rounded-full bg-gray-100">
                      <Plus size={30} className="text-gray-500" />
                    </div>
                    <p className="text-gray-500 text-sm">
                      Click to upload banner ({banners.length}/{MAX_BANNERS})
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative group">
                {" "}
                {/* Added group class here */}
                <Image
                  src={slide}
                  alt={`Banner ${index + 1}`}
                  width={1903}
                  height={438}
                  priority
                  className="object-cover"
                />
                {isVendor && (
                  <button
                    onClick={() => handleRemoveBanner(slide)}
                    className="absolute top-4 left-4 p-2 bg-white/80 rounded-full 
                             opacity-0 group-hover:opacity-100 transition-opacity
                             hover:bg-white hover:text-red-500 z-10"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {allSlides.length > 1 && (
        <section className="flex my-4">
          <div className="absolute bottom-4 w-full flex justify-center">
            {allSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-1 w-1 mx-1 rounded-full ${
                  currentIndex === index ? "bg-red-600" : "bg-gray-400"
                }`}
              />
            ))}
          </div>
        </section>
      )}

      {isVendor && isLoading && (
        <div className="absolute top-4 right-4 bg-white/80 px-3 py-1 rounded-md text-sm">
          Uploading...
        </div>
      )}

      {isVendor && error && (
        <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-md text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
