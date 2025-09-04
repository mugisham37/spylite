/**
 * Dynamic import utilities for code splitting and performance optimization
 */

import React, { lazy, ComponentType } from "react";

// Lazy load section components for better code splitting
export const LazyHeroSection = lazy(
  () => import("@/components/sections/HeroSection")
);

export const LazyFlavorSection = lazy(
  () => import("@/components/sections/FlavorSection")
);

export const LazyMessageSection = lazy(
  () => import("@/components/sections/MessageSection")
);

export const LazyNutritionSection = lazy(
  () => import("@/components/sections/NutritionSection")
);

export const LazyBenefitSection = lazy(
  () => import("@/components/sections/BenefitSection")
);

export const LazyTestimonialSection = lazy(
  () => import("@/components/sections/TestimonialSection")
);

export const LazyFooterSection = lazy(
  () => import("@/components/sections/FooterSection")
);

// Lazy load animation components
export const LazyClipPathTitle = lazy(
  () => import("@/components/animations/ClipPathTitle")
);

export const LazyFlavorSlider = lazy(
  () => import("@/components/animations/FlavorSlider")
);

export const LazyVideoPinSection = lazy(
  () => import("@/components/animations/VideoPinSection")
);

// GSAP plugins dynamic imports for better tree shaking
export const loadGSAPPlugins = async () => {
  const [{ ScrollTrigger }, { ScrollSmoother }, { SplitText }] =
    await Promise.all([
      import("gsap/ScrollTrigger"),
      import("gsap/ScrollSmoother"),
      import("gsap/SplitText"),
    ]);

  return {
    ScrollTrigger,
    ScrollSmoother,
    SplitText,
  };
};

// Utility function to preload critical components
export const preloadCriticalComponents = () => {
  // Preload above-the-fold components
  import("@/components/sections/HeroSection");
  import("@/components/sections/MessageSection");

  // Preload GSAP core
  import("gsap");
};

// Utility function to preload components based on scroll position
export const preloadOnScroll = (threshold: number = 0.5) => {
  if (typeof window === "undefined") return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement;
          const sectionName = target.dataset.section;

          switch (sectionName) {
            case "flavor":
              import("@/components/sections/FlavorSection");
              break;
            case "nutrition":
              import("@/components/sections/NutritionSection");
              break;
            case "benefits":
              import("@/components/sections/BenefitSection");
              break;
            case "testimonials":
              import("@/components/sections/TestimonialSection");
              break;
            case "footer":
              import("@/components/sections/FooterSection");
              break;
          }

          observer.unobserve(target);
        }
      });
    },
    { threshold }
  );

  // Observe section placeholders
  document.querySelectorAll("[data-section]").forEach((section) => {
    observer.observe(section);
  });

  return observer;
};

// Type-safe component loader with error handling
export const createComponentLoader = <T extends ComponentType<unknown>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: ComponentType
) => {
  return lazy(async () => {
    try {
      return await importFn();
    } catch (error) {
      console.error("Failed to load component:", error);

      if (fallback) {
        return { default: fallback };
      }

      // Return a minimal error component
      const ErrorComponent = () => {
        return React.createElement(
          "div",
          {
            className: "p-4 text-center text-red-500",
          },
          "Failed to load component"
        );
      };

      return { default: ErrorComponent as unknown as T };
    }
  });
};

// Resource hints for better loading performance
export const addResourceHints = () => {
  if (typeof document === "undefined") return;

  const head = document.head;

  // Preload critical GSAP files
  const gsapPreload = document.createElement("link");
  gsapPreload.rel = "modulepreload";
  gsapPreload.href = "/node_modules/gsap/index.js";
  head.appendChild(gsapPreload);

  // Preconnect to external resources
  const preconnects = [
    "https://fonts.googleapis.com",
    "https://fonts.gstatic.com",
  ];

  preconnects.forEach((url) => {
    const link = document.createElement("link");
    link.rel = "preconnect";
    link.href = url;
    link.crossOrigin = "anonymous";
    head.appendChild(link);
  });
};
