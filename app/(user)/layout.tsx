import type { Metadata } from "next";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import CopyRight from "@/components/CopyRight/CopyRight";
import CategoriesDropDown from "./_compnents/CategoriesDropDown";

export const metadata = {
  title: "Captivity-Headwear And Apparel",
  description: "Headwear and Apparel",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <div>
            <Navbar />
            <CategoriesDropDown />
            {children}
            <Footer />
            <CopyRight />
        </div>
  );
}
