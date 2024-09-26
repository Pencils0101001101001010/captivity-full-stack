"use client";
import ProductCarousel from "@/components/ProductPageCarousel/ProductCarousel";
import SideMenuDopDown from "@/components/ProductPageSideMenuDropDown/SideMenuDopDown";
import SortDropdown from "@/components/SortCardsDropdown/SortDropdown";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const products = [
  {
    id: 1,
    title: "A-Frame Trucker Cap",
    image: "/A-Frame-White-Foc.jpg",
    image2: "/A-Frame-White-Soc.jpg",
    rating: 4.5,
    price: 29.99,
    status: "new", // 'soldout' or 'new'
  },
  {
    id: 2,
    title: "Snapback",
    image: "/Snapback-Red-Foc-1.jpg",
    image2: "/Snapback-Charcoal-Foc1.jpg",
    rating: 4.0,
    price: "R25.99",
    status: "",
  },
  {
    id: 3,
    title: "Signature Snapback Cap",
    image: "/Signature-Snapback-Denim-model.jpg",
    image2: "/Signature-Snapback-Grey-Melange-Black-Foc-01.jpg",
    rating: 4.0,
    price: "R25.99",
    status: "",
  },
];

export default function Page() {
  const [hoveredProductId, setHoveredProductId] = useState(null);

  function handleMouseEnter(productId) {
    setHoveredProductId(productId);
  }

  function handleMouseLeave() {
    setHoveredProductId(null);
  }
  return (
    <div>
      <div className="w-full">
        <div className="relative group overflow-hidden">
          <Image
            src="/Classic-T-Shirt-Model-1.jpg"
            width={1368}
            height={262}
            alt="Headwear-collection-Header"
            className="w-full h-[200px] sm:h-[300px] filter brightness-75 "
            style={{ objectFit: "cover" }}
          />
          <div class="absolute inset-0 bg-gradient-to-r from-cyan-700 to-green-500 mix-blend-multiply opacity-75"></div>
          <div className="absolute top-20 sm:top-5 md:top-20 lg:top-24 w-full font-bold bg-opacity-50 text-white text-center px-4">
            <span className="text-5xl  sm:text-4xl md:text-5xl lg:text-7xl">
              <span className="text-yellow-300 sm:flex-wrap">JUST </span>{" "}
              T-SHIRTS...
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <div className="container m-5">
          {" "}
          <div className="flex">
            {/* Side Menu */}
            <div className="space-y-5 md:mr-10 lg:mr-10 xl:mr-10 xl:ml-20 lg:ml-20 md:ml-20">
              <ProductCarousel />
              <aside className="w-[300px] mb-0 hidden lg:block">
                <ul className="menu border-2 p-2 text-gray-700">
                  <span className="text-xl font-bold">HEADWEAR</span>
                  <li>
                    <Link href="/headwear/new-in-headwear">T-Shirts</Link>
                  </li>
                  <li>
                    <Link href="/headwear/flat-peaks">Flat Peaks</Link>
                  </li>
                  <li>
                    <Link href="/headwear/pre-curved-peaks">
                      Pre-Curved Peaks
                    </Link>
                  </li>
                  <li>
                    <Link href="/headwear/hats">Hats</Link>
                  </li>
                  <li>
                    <Link href="/headwear/multifunctional-headwear">
                      Multifunctional Headwear
                    </Link>
                  </li>
                  <li>
                    <Link href="/headwear/beanies">Beanies</Link>
                  </li>
                  <li>
                    <Link href="/headwear/trucker-caps">Trucker Caps</Link>
                  </li>
                  <li>
                    <Link href="/headwear/bucket-hats">Bucket Hats</Link>
                  </li>
                </ul>
              </aside>
              <aside className="w-[300px] hidden lg:block">
                <ul className="menu border-2 p-2 text-gray-700">
                  <span className="text-xl font-bold">APPAREL</span>
                  <li>
                    <Link href="/apparel/new-in-apparel">New in Apparel</Link>
                  </li>
                  <li>
                    <Link href="/apparel/men">Men</Link>
                  </li>
                  <li>
                    <Link href="/apparel/women">Women</Link>
                  </li>
                  <li>
                    <Link href="/apparel/kids">Kids</Link>
                  </li>
                  <li>
                    <Link href="/apparel/t-shirts">T - Shirts</Link>
                  </li>
                  <li>
                    <Link href="/apparel/golfers">Golfers</Link>
                  </li>
                  <li>
                    <Link href="/apparel/hoodies">Hoodies</Link>
                  </li>
                  <li>
                    <Link href="/apparel/jackets">Jackets</Link>
                  </li>
                  <li>
                    <Link href="/apparel/bottoms">Bottoms</Link>
                  </li>
                </ul>
              </aside>
              <SideMenuDopDown />
            </div>

            {/* Main Content */}
            <div className="w-full lg:w-3/4 m-5">
              {/* Products Grid */}
              <div className="mb-20">
                <span className="font-bold ml-5 text-2xl text-gray-400">
                  T-Shirts
                </span>
              </div>
              <div className="grid sm:grid-cols-1 grid-cols-2 lg:grid-cols-4 gap-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="card rounded-md bg-gray-200 shadow-sm hover:shadow-xl"
                  >
                    <figure>
                      <Image
                        src={
                          hoveredProductId === product.id
                            ? product.image2
                            : product.image
                        }
                        alt={product.title}
                        id={product.id}
                        onMouseEnter={() => handleMouseEnter(product.id)}
                        onMouseLeave={handleMouseLeave}
                        width={300}
                        height={200}
                      />
                    </figure>
                    <div className="card-compact p-2">
                      <h2 className="card-title text-sm text-black">
                        {product.title}
                        {product.status === "new" && (
                          <div className="absolute top-5 left-5  badge badge-secondary p-2 ml-2">
                            New
                          </div>
                        )}
                        {product.status === "soldout" && (
                          <div className="absolute top-5 left-5 badge badge-error p-4 ml-2">
                            Sold Out
                          </div>
                        )}
                      </h2>
                      <p className="text-yellow-500">
                        {"★".repeat(Math.floor(product.rating))}
                        {product.rating % 1 !== 0 && "★"}
                      </p>
                      <p>{product.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
