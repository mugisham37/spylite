"use client";

import { ScrollSmoother } from "gsap/ScrollSmoother";
import { useEffect, useState } from "react";

/**
 * Hook to access the ScrollSmoother instance
 * Returns the current ScrollSmoother instance or null if not initialized
 */
export function useScrollSmoother() {
  const [scrollSmoother, setScrollSmoother] = useState<ScrollSmoother | null>(
    null
  );

  useEffect(() => {
    // Get the ScrollSmoother instance
    const smoother = ScrollSmoother.get();
    setScrollSmoother(smoother || null);

    // Set up an interval to check for ScrollSmoother initialization
    const checkInterval = setInterval(() => {
      const currentSmoother = ScrollSmoother.get();
      if (currentSmoother && currentSmoother !== scrollSmoother) {
        setScrollSmoother(currentSmoother);
        clearInterval(checkInterval);
      }
    }, 100);

    // Clean up interval after 5 seconds
    const timeout = setTimeout(() => {
      clearInterval(checkInterval);
    }, 5000);

    return () => {
      clearInterval(checkInterval);
      clearTimeout(timeout);
    };
  }, [scrollSmoother]);

  return scrollSmoother;
}

/**
 * Hook to scroll to a specific element or position using ScrollSmoother
 */
export function useScrollTo() {
  const scrollSmoother = useScrollSmoother();

  const scrollTo = (
    target: string | number | Element,
    smooth?: boolean,
    offset?: string
  ) => {
    if (scrollSmoother) {
      scrollSmoother.scrollTo(target, smooth, offset);
    } else {
      // Fallback to native scrolling if ScrollSmoother is not available
      if (typeof target === "string") {
        const element = document.querySelector(target);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      } else if (typeof target === "number") {
        window.scrollTo({ top: target, behavior: "smooth" });
      } else if (target instanceof Element) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return scrollTo;
}
