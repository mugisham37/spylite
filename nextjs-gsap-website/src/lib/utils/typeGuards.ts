// Type guard utilities for runtime type checking
import type { FlavorData, NutrientData, CardData } from "@/types/constants";
import type {
  GSAPError,
  MediaError,
  APIError,
  ValidationError,
} from "@/types/errors";

// Basic type guards
export const isString = (value: unknown): value is string => {
  return typeof value === "string";
};

export const isNumber = (value: unknown): value is number => {
  return typeof value === "number" && !isNaN(value);
};

export const isBoolean = (value: unknown): value is boolean => {
  return typeof value === "boolean";
};

export const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

export const isArray = <T>(value: unknown): value is T[] => {
  return Array.isArray(value);
};

export const isFunction = (
  value: unknown
): value is (...args: unknown[]) => unknown => {
  return typeof value === "function";
};

export const isNull = (value: unknown): value is null => {
  return value === null;
};

export const isUndefined = (value: unknown): value is undefined => {
  return value === undefined;
};

export const isNullish = (value: unknown): value is null | undefined => {
  return value === null || value === undefined;
};

// DOM type guards
export const isElement = (value: unknown): value is Element => {
  return value instanceof Element;
};

export const isHTMLElement = (value: unknown): value is HTMLElement => {
  return value instanceof HTMLElement;
};

export const isHTMLImageElement = (
  value: unknown
): value is HTMLImageElement => {
  return value instanceof HTMLImageElement;
};

export const isHTMLVideoElement = (
  value: unknown
): value is HTMLVideoElement => {
  return value instanceof HTMLVideoElement;
};

// Error type guards
export const isError = (value: unknown): value is Error => {
  return value instanceof Error;
};

export const isGSAPError = (error: unknown): error is GSAPError => {
  return (
    isError(error) &&
    "type" in error &&
    isString(error.type) &&
    [
      "timeline",
      "scrolltrigger",
      "splittext",
      "scrollsmoother",
      "tween",
      "plugin",
    ].includes(error.type)
  );
};

export const isMediaError = (error: unknown): error is MediaError => {
  return (
    isError(error) &&
    "type" in error &&
    isString(error.type) &&
    ["image", "video", "audio"].includes(error.type) &&
    "src" in error &&
    isString(error.src)
  );
};

export const isAPIError = (error: unknown): error is APIError => {
  return (
    isError(error) &&
    "endpoint" in error &&
    isString(error.endpoint) &&
    "method" in error &&
    isString(error.method) &&
    "status" in error &&
    isNumber(error.status)
  );
};

export const isValidationError = (error: unknown): error is ValidationError => {
  return (
    isError(error) &&
    "field" in error &&
    isString(error.field) &&
    "rule" in error &&
    isString(error.rule)
  );
};

// Data model type guards
export const isFlavorData = (value: unknown): value is FlavorData => {
  return (
    isObject(value) &&
    "name" in value &&
    isString(value.name) &&
    "color" in value &&
    isString(value.color) &&
    ["brown", "red", "blue", "orange", "white", "black"].includes(
      value.color as string
    ) &&
    "rotation" in value &&
    isString(value.rotation)
  );
};

export const isNutrientData = (value: unknown): value is NutrientData => {
  return (
    isObject(value) &&
    "label" in value &&
    isString(value.label) &&
    "amount" in value &&
    isString(value.amount)
  );
};

export const isCardData = (value: unknown): value is CardData => {
  return (
    isObject(value) &&
    "src" in value &&
    isString(value.src) &&
    "rotation" in value &&
    isString(value.rotation) &&
    "name" in value &&
    isString(value.name) &&
    "img" in value &&
    isString(value.img)
  );
};

// Network type guards
export const isOnline = (): boolean => {
  return typeof navigator !== "undefined" ? navigator.onLine : true;
};

export const hasNetworkInformation = (): boolean => {
  return (
    "connection" in navigator ||
    "mozConnection" in navigator ||
    "webkitConnection" in navigator
  );
};

// Feature detection type guards
export const supportsIntersectionObserver = (): boolean => {
  return typeof window !== "undefined" && "IntersectionObserver" in window;
};

export const supportsResizeObserver = (): boolean => {
  return typeof window !== "undefined" && "ResizeObserver" in window;
};

export const supportsWebP = (): boolean => {
  if (typeof window === "undefined") return false;

  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL("image/webp").indexOf("data:image/webp") === 0;
};

export const supportsAVIF = (): boolean => {
  if (typeof window === "undefined") return false;

  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL("image/avif").indexOf("data:image/avif") === 0;
};

export const supportsLazyLoading = (): boolean => {
  return (
    typeof window !== "undefined" && "loading" in HTMLImageElement.prototype
  );
};

// GSAP type guards
export const isGSAPTimeline = (value: unknown): value is gsap.core.Timeline => {
  return (
    isObject(value) &&
    "play" in value &&
    "pause" in value &&
    "reverse" in value &&
    "restart" in value &&
    isFunction(value.play) &&
    isFunction(value.pause)
  );
};

export const isScrollTrigger = (value: unknown): value is ScrollTrigger => {
  return (
    isObject(value) &&
    "trigger" in value &&
    "start" in value &&
    "end" in value &&
    "refresh" in value &&
    isFunction(value.refresh)
  );
};

// Media type guards
export const isImageURL = (url: string): boolean => {
  const imageExtensions = /\.(jpg|jpeg|png|gif|webp|avif|svg)$/i;
  return imageExtensions.test(url);
};

export const isVideoURL = (url: string): boolean => {
  const videoExtensions = /\.(mp4|webm|ogg|avi|mov)$/i;
  return videoExtensions.test(url);
};

// Responsive type guards
export const isMobileDevice = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768;
};

export const isTabletDevice = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.innerWidth >= 768 && window.innerWidth < 1536;
};

export const isDesktopDevice = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.innerWidth >= 1536;
};

export const isTouchDevice = (): boolean => {
  if (typeof window === "undefined") return false;
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
};

export const isRetinaDisplay = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.devicePixelRatio > 1;
};

// Performance type guards
export const hasPerformanceAPI = (): boolean => {
  return typeof window !== "undefined" && "performance" in window;
};

export const hasMemoryAPI = (): boolean => {
  return (
    typeof window !== "undefined" &&
    "performance" in window &&
    "memory" in window.performance
  );
};

export const hasConnectionAPI = (): boolean => {
  return (
    typeof navigator !== "undefined" &&
    ("connection" in navigator ||
      "mozConnection" in navigator ||
      "webkitConnection" in navigator)
  );
};

// Accessibility type guards
export const prefersReducedMotion = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

export const prefersHighContrast = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-contrast: high)").matches;
};

export const prefersDarkMode = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

// Generic type guard creator
export const createTypeGuard = <T>(
  predicate: (value: unknown) => boolean
): ((value: unknown) => value is T) => {
  return (value: unknown): value is T => predicate(value);
};

// Array type guard creator
export const createArrayTypeGuard = <T>(
  itemGuard: (value: unknown) => value is T
): ((value: unknown) => value is T[]) => {
  return (value: unknown): value is T[] => {
    return isArray(value) && value.every(itemGuard);
  };
};

// Object type guard creator
export const createObjectTypeGuard = <
  T extends Record<string, unknown>
>(schema: { [K in keyof T]: (value: unknown) => value is T[K] }): ((
  value: unknown
) => value is T) => {
  return (value: unknown): value is T => {
    if (!isObject(value)) return false;

    return Object.entries(schema).every(([key, guard]) => {
      return key in value && guard(value[key]);
    });
  };
};
