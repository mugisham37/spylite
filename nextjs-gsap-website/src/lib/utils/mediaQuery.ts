import { useMediaQuery } from "react-responsive";
import { useState, useEffect } from "react";
import type { UseResponsiveReturn, UseViewportReturn } from "@/types/hooks";

// Comprehensive breakpoints configuration
export const breakpoints = {
  mobile: "(max-width: 767px)",
  tablet: "(min-width: 768px) and (max-width: 1535px)",
  desktop: "(min-width: 1536px)",
  md: "(min-width: 768px)",
  "2xl": "(min-width: 1536px)",
  // Additional breakpoints for more granular control
  xs: "(max-width: 479px)",
  sm: "(min-width: 480px) and (max-width: 767px)",
  lg: "(min-width: 1024px) and (max-width: 1535px)",
  xl: "(min-width: 1280px) and (max-width: 1535px)",
  "3xl": "(min-width: 1920px)",
  // Orientation queries
  portrait: "(orientation: portrait)",
  landscape: "(orientation: landscape)",
  // Feature queries
  hover: "(hover: hover)",
  touch: "(pointer: coarse)",
  reducedMotion: "(prefers-reduced-motion: reduce)",
  darkMode: "(prefers-color-scheme: dark)",
  lightMode: "(prefers-color-scheme: light)",
  highContrast: "(prefers-contrast: high)",
} as const;

// Breakpoint values for programmatic use
export const breakpointValues = {
  xs: 0,
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
  "3xl": 1920,
} as const;

export type BreakpointKey = keyof typeof breakpointValues;
export type BreakpointValue = (typeof breakpointValues)[BreakpointKey];

// Enhanced responsive hook with comprehensive device detection
export const useResponsive = (): UseResponsiveReturn => {
  const isMobile = useMediaQuery({ query: breakpoints.mobile });
  const isTablet = useMediaQuery({ query: breakpoints.tablet });
  const isDesktop = useMediaQuery({ query: breakpoints.desktop });
  const isMd = useMediaQuery({ query: breakpoints.md });
  const is2xl = useMediaQuery({ query: breakpoints["2xl"] });

  // Additional breakpoints
  const isXs = useMediaQuery({ query: breakpoints.xs });
  const isSm = useMediaQuery({ query: breakpoints.sm });
  const isLg = useMediaQuery({ query: breakpoints.lg });
  const isXl = useMediaQuery({ query: breakpoints.xl });
  const is3xl = useMediaQuery({ query: breakpoints["3xl"] });

  // Orientation detection
  const isPortrait = useMediaQuery({ query: breakpoints.portrait });
  const isLandscape = useMediaQuery({ query: breakpoints.landscape });

  // Viewport dimensions
  const [viewport, setViewport] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateViewport = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    if (typeof window !== "undefined") {
      updateViewport();
      window.addEventListener("resize", updateViewport);
      return () => window.removeEventListener("resize", updateViewport);
    }
  }, []);

  // Determine current breakpoint
  const getBreakpoint = (): "mobile" | "tablet" | "desktop" => {
    if (isMobile) return "mobile";
    if (isTablet) return "tablet";
    return "desktop";
  };

  return {
    // Original breakpoints for backward compatibility
    isMobile,
    isTablet,
    isDesktop,
    isMd,
    is2xl,

    // Additional breakpoints
    isXs,
    isSm,
    isLg,
    isXl,
    is3xl,

    // Orientation
    orientation: isPortrait ? "portrait" : "landscape",
    isPortrait,
    isLandscape,

    // Current breakpoint
    breakpoint: getBreakpoint(),

    // Viewport dimensions
    viewport,
  } as UseResponsiveReturn;
};

// Viewport dimensions hook
export const useViewport = (
  options: {
    debounceMs?: number;
    initialWidth?: number;
    initialHeight?: number;
  } = {}
): UseViewportReturn => {
  const { debounceMs = 100, initialWidth = 0, initialHeight = 0 } = options;

  const [dimensions, setDimensions] = useState({
    width: initialWidth,
    height: initialHeight,
  });

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const updateDimensions = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }, debounceMs);
    };

    if (typeof window !== "undefined") {
      // Set initial dimensions
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });

      window.addEventListener("resize", updateDimensions);
      return () => {
        window.removeEventListener("resize", updateDimensions);
        clearTimeout(timeoutId);
      };
    }
  }, [debounceMs]);

  const aspectRatio =
    dimensions.height > 0 ? dimensions.width / dimensions.height : 0;
  const isLandscape = dimensions.width > dimensions.height;
  const isPortrait = dimensions.height > dimensions.width;

  return {
    width: dimensions.width,
    height: dimensions.height,
    aspectRatio,
    isLandscape,
    isPortrait,
  };
};

// Server-side safe media query check
export const getBreakpoint = (
  width: number
): "mobile" | "tablet" | "desktop" => {
  if (width < breakpointValues.md) return "mobile";
  if (width < breakpointValues["2xl"]) return "tablet";
  return "desktop";
};

// Get breakpoint key from width
export const getBreakpointKey = (width: number): BreakpointKey => {
  if (width < breakpointValues.sm) return "xs";
  if (width < breakpointValues.md) return "sm";
  if (width < breakpointValues.lg) return "md";
  if (width < breakpointValues.xl) return "lg";
  if (width < breakpointValues["2xl"]) return "xl";
  if (width < breakpointValues["3xl"]) return "2xl";
  return "3xl";
};

// Check if current width matches breakpoint
export const matchesBreakpoint = (
  width: number,
  breakpoint: BreakpointKey,
  direction: "up" | "down" | "only" = "up"
): boolean => {
  const value = breakpointValues[breakpoint];

  switch (direction) {
    case "up":
      return width >= value;
    case "down":
      return width < value;
    case "only":
      const keys = Object.keys(breakpointValues) as BreakpointKey[];
      const index = keys.indexOf(breakpoint);
      const nextKey = keys[index + 1];
      const nextValue = nextKey ? breakpointValues[nextKey] : Infinity;
      return width >= value && width < nextValue;
    default:
      return false;
  }
};

// Create responsive value based on breakpoints
export const createResponsiveValue = <T>(
  values: Partial<Record<BreakpointKey, T>>,
  currentWidth: number,
  fallback: T
): T => {
  const keys = (Object.keys(breakpointValues) as BreakpointKey[]).reverse();

  for (const key of keys) {
    if (
      values[key] !== undefined &&
      matchesBreakpoint(currentWidth, key, "up")
    ) {
      return values[key]!;
    }
  }

  return fallback;
};

// Media query utilities for CSS-in-JS
export const mediaQueries = {
  up: (breakpoint: BreakpointKey) =>
    `@media (min-width: ${breakpointValues[breakpoint]}px)`,
  down: (breakpoint: BreakpointKey) =>
    `@media (max-width: ${breakpointValues[breakpoint] - 1}px)`,
  between: (min: BreakpointKey, max: BreakpointKey) =>
    `@media (min-width: ${breakpointValues[min]}px) and (max-width: ${
      breakpointValues[max] - 1
    }px)`,
  only: (breakpoint: BreakpointKey) => {
    const keys = Object.keys(breakpointValues) as BreakpointKey[];
    const index = keys.indexOf(breakpoint);
    const nextKey = keys[index + 1];

    if (!nextKey) {
      return `@media (min-width: ${breakpointValues[breakpoint]}px)`;
    }

    return `@media (min-width: ${
      breakpointValues[breakpoint]
    }px) and (max-width: ${breakpointValues[nextKey] - 1}px)`;
  },
} as const;

// Device detection utilities
export const deviceDetection = {
  isMobile: () =>
    typeof window !== "undefined" && window.innerWidth < breakpointValues.md,
  isTablet: () =>
    typeof window !== "undefined" &&
    window.innerWidth >= breakpointValues.md &&
    window.innerWidth < breakpointValues["2xl"],
  isDesktop: () =>
    typeof window !== "undefined" &&
    window.innerWidth >= breakpointValues["2xl"],
  isTouchDevice: () =>
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0),
  isRetina: () => typeof window !== "undefined" && window.devicePixelRatio > 1,
  supportsHover: () =>
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover)").matches,
  prefersReducedMotion: () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  prefersDarkMode: () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches,
  prefersHighContrast: () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-contrast: high)").matches,
} as const;
