import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import Categories from "@/components/Categories/Categories";
import CopyRight from "@/components/CopyRight/CopyRight";
import { ThemeProvider } from "next-themes";

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
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            <Categories />
            {children}
            <Footer />
            <CopyRight />
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}
