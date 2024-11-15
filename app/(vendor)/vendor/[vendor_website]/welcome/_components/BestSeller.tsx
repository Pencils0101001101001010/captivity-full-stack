"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { Trash2, Plus } from "lucide-react";
import { RiStarSFill } from "react-icons/ri";
import { useBestSellerStore } from "../_store/BestSellerStore";
import { useParams } from "next/navigation";
import { useSession } from "@/app/(vendor)/SessionProvider";

const MAX_BESTSELLERS = 4;

export default function BestSeller() {
  const fileInputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const { user } = useSession();
  const params = useParams();
  const vendorWebsite =
    typeof params?.vendor_website === "string" ? params.vendor_website : "";

  const {
    bestSellers,
    isLoading,
    error,
    uploadBestSeller,
    removeBestSeller,
    fetchBestSellers,
    fetchVendorBestSellers,
  } = useBestSellerStore();

  useEffect(() => {
    const fetchAppropriateContent = async () => {
      if (!user) return;

      try {
        if (user.role === "VENDOR") {
          await fetchBestSellers();
        } else if (user.role === "VENDORCUSTOMER" && vendorWebsite) {
          await fetchVendorBestSellers(vendorWebsite);
        }
      } catch (error) {
        console.error("Error fetching best sellers:", error);
      }
    };

    fetchAppropriateContent();
  }, [user, vendorWebsite, fetchBestSellers, fetchVendorBestSellers]);

  const isVendor = user?.role === "VENDOR";

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    if (!isVendor) return;

    const file = event.target.files?.[0];
    if (!file) return;

    if (bestSellers.length >= MAX_BESTSELLERS) {
      alert(`Maximum ${MAX_BESTSELLERS} best seller images allowed`);
      return;
    }

    const formData = new FormData();
    formData.append("bestSeller", file);
    await uploadBestSeller(formData);

    if (fileInputRefs[index].current) {
      fileInputRefs[index].current.value = "";
    }
  };

  const handleRemoveBestSeller = async (url: string) => {
    if (!isVendor) return;

    if (
      window.confirm("Are you sure you want to remove this best seller image?")
    ) {
      await removeBestSeller(url);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <p>Loading best sellers...</p>
      </div>
    );
  }

  const renderBlock = (index: number) => {
    const imageUrl = bestSellers[index];
    const isEmpty = !imageUrl;

    return (
      <div className="py-3">
        <div className="card card-compact rounded-md object-cover w-90 relative group">
          {isEmpty && isVendor ? (
            <div className="aspect-square relative flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-t-md">
              <input
                type="file"
                ref={fileInputRefs[index]}
                onChange={e => handleFileSelect(e, index)}
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              <div className="flex flex-col items-center gap-2">
                <div className="p-2 rounded-full bg-gray-100">
                  <Plus size={20} className="text-gray-500" />
                </div>
                <p className="text-xs text-gray-500">Upload best seller</p>
              </div>
            </div>
          ) : (
            <figure className="aspect-square relative">
              {imageUrl && (
                <>
                  <Image
                    src={imageUrl}
                    alt={`Best Seller ${index + 1}`}
                    fill
                    className="object-cover rounded-t-md"
                  />
                  {isVendor && (
                    <button
                      onClick={() => handleRemoveBestSeller(imageUrl)}
                      className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full 
                               opacity-0 group-hover:opacity-100 transition-opacity
                               hover:bg-white hover:text-red-500 z-10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </>
              )}
            </figure>
          )}
          <div className="card-body bg-gray-300 rounded-b hover:shadow-lg">
            <div className="rating flex justify-center">
              {[...Array(5)].map((_, i) => (
                <RiStarSFill
                  key={i}
                  className="my-3 text-yellow-400 text-2xl"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-6xl">
      <section className="max-container max-sm:mt-12">
        <div className="flex flex-col justify-center gap-2">
          <h2 className="text-3xl sm:text-2xl md:text-2xl lg:text-3xl flex items-center justify-center text-red-600 font-semibold">
            BEST SELLERS
          </h2>
        </div>

        <div className="lg:ml-11 lg:mr-12 p-12 mb-10 lg:mt-0 grid xl:grid-cols-4 lg:grid-cols-4 md:grid-cols-4 sm:grid-cols-1 grid-cols-2 sm:gap-4 gap-2 justify-center items-center">
          {[0, 1, 2, 3].map(index => renderBlock(index))}
        </div>

        {isVendor && error && (
          <div className="fixed top-4 right-4 bg-red-500 text-white px-3 py-2 rounded-md text-sm">
            {error}
          </div>
        )}
      </section>
    </div>
  );
}
