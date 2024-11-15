"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Trash2, Plus } from "lucide-react";
import { useCategoryStore } from "../_store/CategoryStore";
import { useParams } from "next/navigation";
import { useSession } from "@/app/(vendor)/SessionProvider";

const MAX_CATEGORIES = 4;

export default function CategoryImages() {
  const fileInputRefs = useRef<HTMLInputElement[]>([]);
  const [categoryNames, setCategoryNames] = useState<string[]>(
    Array(MAX_CATEGORIES).fill("")
  );

  const { user } = useSession();
  const params = useParams();
  const vendorWebsite =
    typeof params?.vendor_website === "string" ? params.vendor_website : "";

  const {
    categories,
    isLoading,
    error,
    uploadCategory,
    removeCategory,
    fetchCategories,
    fetchVendorCategories,
  } = useCategoryStore();

  const isVendor = user?.role === "VENDOR";

  useEffect(() => {
    const fetchAppropriateContent = async () => {
      if (!user) return;

      try {
        if (user.role === "VENDOR") {
          await fetchCategories();
        } else if (user.role === "VENDORCUSTOMER" && vendorWebsite) {
          await fetchVendorCategories(vendorWebsite);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchAppropriateContent();
  }, [user, vendorWebsite, fetchCategories, fetchVendorCategories]);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    if (!isVendor) return;

    const file = event.target.files?.[0];
    if (!file) return;

    if (categories.length >= MAX_CATEGORIES) {
      alert(`Maximum ${MAX_CATEGORIES} categories allowed`);
      return;
    }

    const categoryName = categoryNames[index].trim();
    if (!categoryName) {
      alert("Please enter a category name first");
      return;
    }

    const formData = new FormData();
    formData.append("category", file);
    formData.append("categoryName", categoryName);
    await uploadCategory(formData);

    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index].value = "";
    }

    const newNames = [...categoryNames];
    newNames[index] = "";
    setCategoryNames(newNames);
  };

  const handleCategoryNameChange = (index: number, name: string) => {
    const newNames = [...categoryNames];
    newNames[index] = name;
    setCategoryNames(newNames);
  };

  const handleRemoveCategory = async (url: string) => {
    if (!isVendor) return;

    if (window.confirm("Are you sure you want to remove this category?")) {
      await removeCategory(url);
    }
  };

  const handleUploadClick = (index: number) => {
    if (fileInputRefs.current[index] && categoryNames[index].trim()) {
      fileInputRefs.current[index].click();
    }
  };

  const setInputRef = (el: HTMLInputElement | null, index: number) => {
    if (el) {
      fileInputRefs.current[index] = el;
    }
  };

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <p>Loading categories...</p>
      </div>
    );
  }

  const renderBlock = (index: number) => {
    const category = categories[index];
    const isEmpty = !category;

    return (
      <div key={index} className="w-full sm:w-1/2 md:w-1/4 p-2">
        <div className="relative group rounded-lg overflow-hidden">
          {isEmpty && isVendor ? (
            <>
              <div
                className="aspect-[786/1239] relative flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleUploadClick(index)}
              >
                <input
                  type="file"
                  ref={el => setInputRef(el, index)}
                  onChange={e => handleFileSelect(e, index)}
                  accept="image/*"
                  className="hidden"
                />
                <div className="flex flex-col items-center gap-3 px-4">
                  <div className="p-2 rounded-full bg-gray-100">
                    <Plus
                      size={20}
                      className={`${categoryNames[index].trim() ? "text-gray-500" : "text-gray-300"}`}
                    />
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <p className="text-xs text-gray-500 font-medium mb-1">
                      Category slot ({index + 1}/4)
                    </p>
                    <p className="text-[11px] text-gray-400">
                      {categoryNames[index].trim()
                        ? "Click to upload image"
                        : "⚠️ Enter category name below first"}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-1">
                      Image Dimensions: width=786 x height=1239
                    </p>
                  </div>
                </div>
                <input
                  type="text"
                  placeholder="Enter category name*"
                  value={categoryNames[index]}
                  onChange={e =>
                    handleCategoryNameChange(index, e.target.value)
                  }
                  className="absolute bottom-4 left-4 right-4 p-2 rounded border border-gray-400 text-center text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white/90"
                />
              </div>
            </>
          ) : (
            category && (
              <>
                <Image
                  src={category.url}
                  alt={category.categoryName}
                  width={786}
                  height={1239}
                  className="w-full h-auto group-hover:brightness-50 transition duration-1000"
                />
                {isVendor && (
                  <button
                    onClick={() => handleRemoveCategory(category.url)}
                    className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full 
                             opacity-0 group-hover:opacity-100 transition-opacity
                             hover:bg-white hover:text-red-500 z-10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <div className="absolute bottom-8 left-0 w-full font-bold text-white text-center py-2 transition duration-700 group-hover:bg-opacity-75">
                  <span className="text-lg group-hover:text-xl transition duration-700">
                    {category.categoryName.toUpperCase()}
                  </span>
                </div>
              </>
            )
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-6xl">
      <section className="max-container max-sm:mt-12">
        <div className="flex flex-col justify-center gap-2 mb-6">
          <h2 className="text-3xl sm:text-2xl md:text-2xl lg:text-3xl flex items-center justify-center text-red-600 font-semibold">
            PRODUCT CATEGORIES
          </h2>
        </div>

        <div className="flex flex-wrap items-start justify-center">
          {Array.from({ length: MAX_CATEGORIES }).map((_, index) =>
            renderBlock(index)
          )}
        </div>
      </section>

      {isVendor && error && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-3 py-2 rounded-md text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
