/**
 * Asset utility functions for optimized loading and management
 */

/**
 * Generate responsive image sizes string for Next.js Image component
 */
export const generateImageSizes = (breakpoints: {
  mobile?: string;
  tablet?: string;
  desktop?: string;
  xl?: string;
}): string => {
  const {
    mobile = "100vw",
    tablet = "50vw",
    desktop = "33vw",
    xl = "25vw",
  } = breakpoints;

  return `(max-width: 768px) ${mobile}, (max-width: 1024px) ${tablet}, (max-width: 1440px) ${desktop}, ${xl}`;
};

/**
 * Common image sizes for different use cases
 */
export const imageSizes = {
  hero: generateImageSizes({
    mobile: "100vw",
    tablet: "100vw",
    desktop: "100vw",
    xl: "100vw",
  }),
  card: generateImageSizes({
    mobile: "100vw",
    tablet: "50vw",
    desktop: "33vw",
    xl: "25vw",
  }),
  thumbnail: generateImageSizes({
    mobile: "25vw",
    tablet: "20vw",
    desktop: "15vw",
    xl: "10vw",
  }),
  fullWidth: "100vw",
  halfWidth: "50vw",
  thirdWidth: "33vw",
  quarterWidth: "25vw",
} as const;

/**
 * Generate blur data URL for image placeholders
 */
export const generateBlurDataURL = (
  width: number = 10,
  height: number = 10
): string => {
  const canvas =
    typeof window !== "undefined" ? document.createElement("canvas") : null;
  if (!canvas) return "";

  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  // Create a simple gradient blur effect
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#f3f4f6");
  gradient.addColorStop(1, "#e5e7eb");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  return canvas.toDataURL();
};

/**
 * Video optimization settings for different use cases
 */
export const videoSettings = {
  hero: {
    preload: "metadata" as const,
    autoPlay: true,
    muted: true,
    loop: true,
    playsInline: true,
    lazy: false,
  },
  background: {
    preload: "metadata" as const,
    autoPlay: true,
    muted: true,
    loop: true,
    playsInline: true,
    lazy: true,
  },
  content: {
    preload: "none" as const,
    autoPlay: false,
    muted: false,
    loop: false,
    playsInline: true,
    lazy: true,
    controls: true,
  },
} as const;

/**
 * Image quality settings for different use cases
 */
export const imageQuality = {
  hero: 95,
  high: 90,
  medium: 80,
  low: 70,
  thumbnail: 60,
} as const;

/**
 * Check if an image should be prioritized (above the fold)
 */
export const shouldPrioritizeImage = (
  position: "hero" | "above-fold" | "below-fold"
): boolean => {
  return position === "hero" || position === "above-fold";
};

/**
 * Get optimal image dimensions for different screen sizes
 */
export const getOptimalImageDimensions = (
  originalWidth: number,
  originalHeight: number,
  maxWidth: number = 1920
): { width: number; height: number } => {
  if (originalWidth <= maxWidth) {
    return { width: originalWidth, height: originalHeight };
  }

  const aspectRatio = originalHeight / originalWidth;
  return {
    width: maxWidth,
    height: Math.round(maxWidth * aspectRatio),
  };
};

/**
 * Asset paths for consistent asset management
 */
export const assetPaths = {
  images: "/images",
  videos: "/videos",
  fonts: "/fonts",
  icons: "/icons",
} as const;

/**
 * Build asset URL with proper path
 */
export const buildAssetUrl = (
  type: keyof typeof assetPaths,
  filename: string
): string => {
  return `${assetPaths[type]}/${filename}`;
};
