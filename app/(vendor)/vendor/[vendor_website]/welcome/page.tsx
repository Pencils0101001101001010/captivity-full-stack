import CustomContainer from "@/components/(how to register section on home page)/CustomContainer/CustomContainer";
import HowToRegister from "@/components/(how to register section on home page)/Register/HowToRegister";
import BestSeller from "@/components/BestSeller/BestSeller";
import ProductSection from "@/components/ProductSection/ProductSection";
import React from "react";

const WelcomePage = () => {
  return (
    <div className="my-4">
      <ProductSection />
      <BestSeller />
      <CustomContainer />
      <HowToRegister />
    </div>
  );
};

export default WelcomePage;
