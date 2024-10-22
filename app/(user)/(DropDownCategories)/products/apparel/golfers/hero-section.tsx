import Image from "next/image";

interface Product {
  name: string;
  imageUrl: string;
}

interface HeroSectionProps {
  product: Product;
}

export function HeroSection({ product }: HeroSectionProps) {
  const largeImageUrl = product.imageUrl.split(",")[1].trim();

  return (
    <div className="w-full h-[300px] relative mb-8">
      <Image
        src={largeImageUrl}
        alt={product.name}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-white">{product.name}</h1>
        </div>
      </div>
    </div>
  );
}