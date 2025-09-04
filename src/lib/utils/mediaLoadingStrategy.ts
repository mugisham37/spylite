/**
 * Media loading strategy utilities for optimized performance
 */

// Intersection Observer for lazy loading
export const createIntersectionObserver = (
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {}
): IntersectionObserver => {
  const defaultOptions: IntersectionObserverInit = {
    rootMargin: "50px",
    threshold: 0.1,
    ...options,
  };

  return new IntersectionObserver(callback, defaultOptions);
};

// Preload critical resources
export const preloadCriticalResources = () => {
  const criticalImages = [
    "/images/hero-bg.png",
    "/images/hero-img.png",
    "/images/nav-logo.svg",
  ];

  const criticalVideos = ["/videos/hero-bg.mp4"];

  // Preload critical images
  criticalImages.forEach((src) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = src;
    document.head.appendChild(link);
  });

  // Preload critical videos
  criticalVideos.forEach((src) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "video";
    link.href = src;
    document.head.appendChild(link);
  });
};

// Progressive image loading with blur-up effect
export const createProgressiveImageLoader = (
  _lowQualitySrc: string,
  highQualitySrc: string,
  onLoad?: () => void
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      onLoad?.();
      resolve();
    };

    img.onerror = reject;
    img.src = highQualitySrc;
  });
};

// Video preloading strategy
export const preloadVideo = (
  src: string,
  preloadType: "none" | "metadata" | "auto" = "metadata"
): Promise<HTMLVideoElement> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = preloadType;
    video.muted = true;

    video.addEventListener("loadedmetadata", () => resolve(video));
    video.addEventListener("error", reject);

    video.src = src;
  });
};

// Adaptive loading based on connection speed
export const getAdaptiveLoadingStrategy = () => {
  // Check for Network Information API support
  const connection =
    (
      navigator as unknown as {
        connection?: { effectiveType: string };
        mozConnection?: { effectiveType: string };
        webkitConnection?: { effectiveType: string };
      }
    ).connection ||
    (navigator as unknown as { mozConnection?: { effectiveType: string } })
      .mozConnection ||
    (navigator as unknown as { webkitConnection?: { effectiveType: string } })
      .webkitConnection;

  if (!connection) {
    return {
      imageQuality: 85,
      videoPreload: "metadata" as const,
      enableLazyLoading: true,
    };
  }

  const effectiveType = connection.effectiveType;

  switch (effectiveType) {
    case "slow-2g":
    case "2g":
      return {
        imageQuality: 60,
        videoPreload: "none" as const,
        enableLazyLoading: true,
      };
    case "3g":
      return {
        imageQuality: 75,
        videoPreload: "metadata" as const,
        enableLazyLoading: true,
      };
    case "4g":
    default:
      return {
        imageQuality: 85,
        videoPreload: "metadata" as const,
        enableLazyLoading: true,
      };
  }
};

// Memory-aware loading
export const getMemoryAwareStrategy = () => {
  // Check for Device Memory API support
  const deviceMemory = (navigator as unknown as { deviceMemory?: number })
    .deviceMemory;

  if (!deviceMemory) {
    return {
      maxConcurrentLoads: 4,
      enableImageOptimization: true,
    };
  }

  if (deviceMemory <= 2) {
    return {
      maxConcurrentLoads: 2,
      enableImageOptimization: true,
    };
  } else if (deviceMemory <= 4) {
    return {
      maxConcurrentLoads: 4,
      enableImageOptimization: true,
    };
  } else {
    return {
      maxConcurrentLoads: 6,
      enableImageOptimization: false, // High-end devices can handle unoptimized images
    };
  }
};

// Resource hints for better loading performance
export const addResourceHints = () => {
  // DNS prefetch for external domains
  const dnsPrefetchDomains = ["//fonts.googleapis.com", "//fonts.gstatic.com"];

  dnsPrefetchDomains.forEach((domain) => {
    const link = document.createElement("link");
    link.rel = "dns-prefetch";
    link.href = domain;
    document.head.appendChild(link);
  });

  // Preconnect to critical origins
  const preconnectOrigins = [
    "https://fonts.googleapis.com",
    "https://fonts.gstatic.com",
  ];

  preconnectOrigins.forEach((origin) => {
    const link = document.createElement("link");
    link.rel = "preconnect";
    link.href = origin;
    link.crossOrigin = "anonymous";
    document.head.appendChild(link);
  });
};

// Image format detection and fallback
export const getSupportedImageFormat = (): "avif" | "webp" | "jpg" => {
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;

  // Check AVIF support
  if (canvas.toDataURL("image/avif").indexOf("data:image/avif") === 0) {
    return "avif";
  }

  // Check WebP support
  if (canvas.toDataURL("image/webp").indexOf("data:image/webp") === 0) {
    return "webp";
  }

  // Fallback to JPEG
  return "jpg";
};

// Batch loading utility
export class BatchLoader {
  private queue: Array<() => Promise<void>> = [];
  private maxConcurrent: number;
  private currentLoading = 0;

  constructor(maxConcurrent = 4) {
    this.maxConcurrent = maxConcurrent;
  }

  add(loadFn: () => Promise<void>) {
    this.queue.push(loadFn);
    this.processQueue();
  }

  private async processQueue() {
    if (this.currentLoading >= this.maxConcurrent || this.queue.length === 0) {
      return;
    }

    const loadFn = this.queue.shift();
    if (!loadFn) return;

    this.currentLoading++;

    try {
      await loadFn();
    } catch (error) {
      console.warn("Batch loading failed:", error);
    } finally {
      this.currentLoading--;
      this.processQueue();
    }
  }
}
