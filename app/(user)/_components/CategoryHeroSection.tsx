import Image from "next/image";

function HeroSection({ imageUrl }: { imageUrl: string }) {
    return (
      <div className="relative w-full h-[350px] mb-8">
        <Image
          src={imageUrl}
          alt="Headwear Hero"
          className="fill"
          style={{ objectFit: "cover", objectPosition: "center 20%" }}
          priority
          fill
        />
        <div className="absolute bg-black bg-opacity-50 flex items-center inset-0 bg-gradient-to-r from-gray-500 via-transparent to-cyan-500 opacity-60">
          <h1 className=" sm:text-8xl text-4xl pl-10 font-bold text-white">
            BEANIES
          </h1>
        </div>
      </div>
    );
} 

export default HeroSection;