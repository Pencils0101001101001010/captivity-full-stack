import CustomContainer from "@/components/(how to register section on home page)/CustomContainer/CustomContainer";
import HowToRegister from "@/components/(how to register section on home page)/Register/HowToRegister";
import BestSeller from "@/components/BestSeller/BestSeller";
import CarouselPlugin from "@/components/Carousel/CarouselPlugin";
import ProductSection from "@/components/ProductSection/ProductSection";
 
import Carousel from "@/components/(small screen carousel)/SmallCarousel/SmallCarousel";
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
