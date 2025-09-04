/**
 * Utility functions for image optimization
 */

// Generate blur data URL for placeholder
export const generateBlurDataURL = (
  width: number = 10,
  height: number = 10
): string => {
  if (typeof document === "undefined") return "";

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  if (!ctx) return "";

  // Create a simple gradient blur placeholder
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#f3f4f6");
  gradient.addColorStop(1, "#e5e7eb");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  return canvas.toDataURL();
};

// Generate responsive sizes string based on breakpoints
export const generateResponsiveSizes = (config: {
  mobile?: string;
  tablet?: string;
  desktop?: string;
  defaultSize?: string;
}): string => {
  const {
    mobile = "100vw",
    tablet = "50vw",
    desktop = "33vw",
    defaultSize = "100vw",
  } = config;

  return `(max-width: 640px) ${mobile}, (max-width: 1024px) ${tablet}, (max-width: 1920px) ${desktop}, ${defaultSize}`;
};

// Image dimension configurations for different use cases
export const imageDimensions = {
  hero: {
    width: 1920,
    height: 1080,
    sizes: generateResponsiveSizes({
      mobile: "100vw",
      tablet: "100vw",
      desktop: "100vw",
      defaultSize: "100vw",
    }),
  },
  flavor: {
    width: 800,
    height: 800,
    sizes: generateResponsiveSizes({
      mobile: "80vw",
      tablet: "40vw",
      desktop: "25vw",
      defaultSize: "25vw",
    }),
  },
  nutrition: {
    width: 1920,
    height: 1200,
    sizes: generateResponsiveSizes({
      mobile: "100vw",
      tablet: "100vw",
      desktop: "100vw",
      defaultSize: "100vw",
    }),
  },
  testimonial: {
    width: 400,
    height: 600,
    sizes: generateResponsiveSizes({
      mobile: "80vw",
      tablet: "50vw",
      desktop: "25vw",
      defaultSize: "25vw",
    }),
  },
  footer: {
    width: 1920,
    height: 400,
    sizes: generateResponsiveSizes({
      mobile: "100vw",
      tablet: "100vw",
      desktop: "100vw",
      defaultSize: "100vw",
    }),
  },
  icon: {
    width: 64,
    height: 64,
    sizes: "64px",
  },
  logo: {
    width: 200,
    height: 80,
    sizes: generateResponsiveSizes({
      mobile: "80px",
      tablet: "120px",
      desktop: "200px",
      defaultSize: "200px",
    }),
  },
};

// Video optimization configurations
export const videoConfigs = {
  hero: {
    preload: "metadata" as const,
    lazy: false,
    poster: "/images/hero-bg.png",
  },
  testimonial: {
    preload: "none" as const,
    lazy: true,
    poster: undefined, // Will use person images as posters
  },
  benefit: {
    preload: "metadata" as const,
    lazy: true,
    poster: "/images/video-img.webp",
  },
  footer: {
    preload: "metadata" as const,
    lazy: true,
    poster: "/images/footer-drink.png",
  },
};

// Priority loading configuration
export const priorityImages = [
  "/images/hero-bg.png",
  "/images/hero-img.png",
  "/images/nav-logo.svg",
];

// Check if image should be loaded with priority
export const shouldLoadWithPriority = (src: string): boolean => {
  return priorityImages.includes(src);
};

// Generate srcSet for responsive images
export const generateSrcSet = (baseSrc: string, sizes: number[]): string => {
  const extension = baseSrc.split(".").pop();
  const baseName = baseSrc.replace(`.${extension}`, "");

  return sizes
    .map((size) => `${baseName}-${size}w.${extension} ${size}w`)
    .join(", ");
};

// Optimize image loading based on viewport
export const getOptimalImageSize = (containerWidth: number): number => {
  // Return appropriate image size based on container width
  if (containerWidth <= 640) return 640;
  if (containerWidth <= 1024) return 1024;
  if (containerWidth <= 1920) return 1920;
  return 2048;
};
