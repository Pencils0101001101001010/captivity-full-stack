import React from "react";
import Image from "next/image";

interface HeroSectionProps {
  categoryImage: string;
  categoryName: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  categoryImage,
  categoryName,
}) => {
  return (
    <div className="relative w-full h-[300px] mb-8">
      <Image
        src={categoryImage}
        alt={`${categoryName} category`}
        fill
        style={{ objectFit: "cover" }}
        sizes="10vw"
        priority
      />
      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
          {categoryName}
        </h1>
      </div>
    </div>
  );
};

export default HeroSection;
