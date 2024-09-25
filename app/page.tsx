import "./globals.css";
import CustomContainer from "@/components/CustomContainer/CustomContainer";
import HowToRegister from "@/components/Register/HowToRegister";
import BestSeller from "@/components/BestSeller/BestSeller";
import ProductSection from "@/components/ProductSection/ProductSection";
import CarouselPlugin from "@/components/Carousel/CarouselPlugin";
import Carousel from "@/components/SmallCarousel/SmallCarousel";
//import connectDB from "@/config/database"

const Home = async () => {
  return (
    <div>
      <main>
        {" "}
        <CarouselPlugin />
        <Carousel />
        <ProductSection />
        <BestSeller />
        <CustomContainer />
        <HowToRegister />
      </main>
    </div>
  );
};

export default Home;
