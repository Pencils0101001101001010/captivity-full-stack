import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import CopyRight from "@/components/CopyRight/CopyRight";
import CategoriesDropDown from "./_components/CategoriesDropDown";


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
