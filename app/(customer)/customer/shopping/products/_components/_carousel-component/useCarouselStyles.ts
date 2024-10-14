// useCarouselStyles.ts

import { useEffect } from "react";

export const useCarouselStyles = () => {
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .react-multi-carousel-list {
        overflow: hidden !important;
      }
      .react-multi-carousel-track {
        touch-action: pan-y;
      }
      .react-multiple-carousel__arrow {
        z-index: 10 !important;
      }
      .react-multiple-carousel__arrow--left {
        left: 0 !important;
      }
      .react-multiple-carousel__arrow--right {
        right: 0 !important;
      }
    `;
    document.head.append(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
};
