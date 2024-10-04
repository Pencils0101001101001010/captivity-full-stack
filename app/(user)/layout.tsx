import type { Metadata } from "next";
import "../globals.css";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import CopyRight from "@/components/CopyRight/CopyRight";
import CategoriesDropDown from "./_compnents/CategoriesDropDown";


export const metadata = {
  title: "Captivity-Headwear And Apparel",
  description: "Headwear and Apparel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg">
        <div>
          
            <Navbar />
            <CategoriesDropDown />
            {children}
            <Footer />
            <CopyRight />
        </div>
      </body>
    </html>
  );
}
