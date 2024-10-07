import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "./CartContext";

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
            <CartProvider>{children}</CartProvider>
          </ThemeProvider>
          <Toaster />
        </div>
      </body>
    </html>
  );
}
