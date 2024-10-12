// useTouchSwipe.ts

import { useEffect, RefObject } from "react";

export const useTouchSwipe = (ref: RefObject<HTMLDivElement>) => {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

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

    element.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    element.addEventListener("touchmove", handleTouchMove, { passive: false });
    element.addEventListener("touchend", handleTouchEnd, { passive: false });

    return () => {
      element.removeEventListener("touchstart", handleTouchStart);
      element.removeEventListener("touchmove", handleTouchMove);
      element.removeEventListener("touchend", handleTouchEnd);
    };
  }, [ref]);
};
