import { Product } from "@prisma/client";

export const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
    slidesToSlide: 4,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    slidesToSlide: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1,
  },
};

export const formatPrice = (price: number | null) =>
  price === null ? "Price not available" : `R${price.toFixed(2)}`;

export const getFirstValidImageUrl = (imageUrl: string | null) => {
  if (!imageUrl) return "/placeholder-image.jpg";
  const urls = imageUrl.split(",").map(url => url.trim());
  return (
    urls.find(url => url && !url.endsWith("404")) || "/placeholder-image.jpg"
  );
};

export const setupCarouselTouchHandlers = (carousel: HTMLDivElement) => {
  let startX: number;
  let startY: number;
  let startTime: number;
  let isSwiping = false;
  const threshold = 10;
  const restraint = 100;
  const allowedTime = 300;

  const handleTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    startTime = new Date().getTime();
    isSwiping = false;
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!startX || !startY) return;

    const touch = e.touches[0];
    const distX = touch.clientX - startX;
    const distY = touch.clientY - startY;
    const elapsedTime = new Date().getTime() - startTime;

    if (elapsedTime <= allowedTime) {
      if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
        e.preventDefault();
        isSwiping = true;
      }
    }
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (isSwiping) {
      e.preventDefault();
    }
    isSwiping = false;
  };

  carousel.addEventListener("touchstart", handleTouchStart, { passive: false });
  carousel.addEventListener("touchmove", handleTouchMove, { passive: false });
  carousel.addEventListener("touchend", handleTouchEnd, { passive: false });

  return () => {
    carousel.removeEventListener("touchstart", handleTouchStart);
    carousel.removeEventListener("touchmove", handleTouchMove);
    carousel.removeEventListener("touchend", handleTouchEnd);
  };
};

export const addCarouselStyles = () => {
  const style = document.createElement("style");
  style.textContent = `
    .react-multi-carousel-list {
      overflow: hidden !important;
    }
    .react-multi-carousel-track {
      touch-action: pan-y;
    }
  `;
  document.head.append(style);
  return () => {
    document.head.removeChild(style);
  };
};
