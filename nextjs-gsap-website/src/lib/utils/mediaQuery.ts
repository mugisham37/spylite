import { useMediaQuery } from "react-responsive";

// Breakpoints matching the original project
export const breakpoints = {
  mobile: "(max-width: 767px)",
  tablet: "(min-width: 768px) and (max-width: 1535px)",
  desktop: "(min-width: 1536px)",
  md: "(min-width: 768px)",
  "2xl": "(min-width: 1536px)",
} as const;

export interface UseMediaQueryResult {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isMd: boolean;
  is2xl: boolean;
}

export const useResponsive = (): UseMediaQueryResult => {
  const isMobile = useMediaQuery({ query: breakpoints.mobile });
  const isTablet = useMediaQuery({ query: breakpoints.tablet });
  const isDesktop = useMediaQuery({ query: breakpoints.desktop });
  const isMd = useMediaQuery({ query: breakpoints.md });
  const is2xl = useMediaQuery({ query: breakpoints["2xl"] });

  return {
    isMobile,
    isTablet,
    isDesktop,
    isMd,
    is2xl,
  };
};

// Server-side safe media query check
export const getBreakpoint = (
  width: number
): "mobile" | "tablet" | "desktop" => {
  if (width < 768) return "mobile";
  if (width < 1536) return "tablet";
  return "desktop";
};
