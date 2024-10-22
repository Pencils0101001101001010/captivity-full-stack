import React, { useCallback, useEffect, useState, memo } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductWithRelations } from "../../_store/useSummerStore";
import ProductCard from "./ProductsCard";

interface CarouselProps {
  products: ProductWithRelations[];
  category: string;
}

// Memoized carousel controls
const CarouselButton = memo(
  ({
    direction,
    onClick,
    enabled,
  }: {
    direction: "left" | "right";
    onClick: () => void;
    enabled: boolean;
  }) => (
    <button
      className="absolute top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md z-10 disabled:opacity-50 disabled:cursor-not-allowed"
      style={{ [direction]: 0 }}
      onClick={onClick}
      disabled={!enabled}
    >
      {direction === "left" ? (
        <ChevronLeft className="w-6 h-6" />
      ) : (
        <ChevronRight className="w-6 h-6" />
      )}
    </button>
  )
);

CarouselButton.displayName = "CarouselButton";

// Memoized product card wrapper
const MemoizedProductCard = memo(ProductCard);

const EmblaProductCarousel: React.FC<CarouselProps> = memo(
  ({ products, category }) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({
      slidesToScroll: 4,
      align: "start",
      loop: true,
      skipSnaps: false,
      dragFree: false,
    });

    const [controlsEnabled, setControlsEnabled] = useState({
      prev: false,
      next: false,
    });

    const scrollPrev = useCallback(() => {
      emblaApi?.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
      emblaApi?.scrollNext();
    }, [emblaApi]);

    const onSelect = useCallback(() => {
      if (!emblaApi) return;

      setControlsEnabled({
        prev: emblaApi.canScrollPrev(),
        next: emblaApi.canScrollNext(),
      });
    }, [emblaApi]);

    useEffect(() => {
      if (!emblaApi) return;

      onSelect();
      emblaApi.on("select", onSelect);
      emblaApi.on("reInit", onSelect);

      return () => {
        emblaApi.off("select", onSelect);
        emblaApi.off("reInit", onSelect);
      };
    }, [emblaApi, onSelect]);

    // Memoize the products list rendering
    const productsList = React.useMemo(
      () =>
        products.map(product => (
          <div key={product.id} className="flex-[0_0_25%] min-w-0 px-2">
            <MemoizedProductCard product={product} />
          </div>
        )),
      [products]
    );

    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 capitalize">{category}</h2>
        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">{productsList}</div>
          </div>
          <CarouselButton
            direction="left"
            onClick={scrollPrev}
            enabled={controlsEnabled.prev}
          />
          <CarouselButton
            direction="right"
            onClick={scrollNext}
            enabled={controlsEnabled.next}
          />
        </div>
      </div>
    );
  }
);

EmblaProductCarousel.displayName = "EmblaProductCarousel";

export default EmblaProductCarousel;
