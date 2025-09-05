"use client";

// Asset optimization utilities for performance enhancement
export interface AssetOptimizationConfig {
  enableLazyLoading: boolean;
  enableWebP: boolean;
  enableAVIF: boolean;
  quality: number;
  threshold: number;
  rootMargin: string;
  enableAdaptiveLoading: boolean;
}

export interface DeviceCapabilities {
  isLowEnd: boolean;
  supportsWebP: boolean;
  supportsAVIF: boolean;
  connectionType: string;
  memoryGB?: number;
  cores: number;
}

class AssetOptimizer {
  private config: AssetOptimizationConfig;
  private deviceCapabilities: DeviceCapabilities;

  constructor(config: Partial<AssetOptimizationConfig> = {}) {
    this.config = {
      enableLazyLoading: true,
      enableWebP: true,
      enableAVIF: true,
      quality: 90,
      threshold: 0.1,
      rootMargin: "50px",
      enableAdaptiveLoading: true,
      ...config,
    };

    this.deviceCapabilities = this.detectDeviceCapabilities();
  }

  private detectDeviceCapabilities(): DeviceCapabilities {
    if (typeof window === "undefined") {
      return {
        isLowEnd: false,
        supportsWebP: false,
        supportsAVIF: false,
        connectionType: "unknown",
        cores: 1,
      };
    }

    const cores = navigator.hardwareConcurrency || 1;
    const memory = (navigator as any).deviceMemory;
    const connection = (navigator as any).connection;
    const connectionType = connection?.effectiveType || "unknown";

    // Detect low-end device
    const isLowEnd =
      cores < 4 ||
      (memory && memory < 4) ||
      ["slow-2g", "2g", "3g"].includes(connectionType);

    return {
      isLowEnd,
      supportsWebP: this.supportsImageFormat("webp"),
      supportsAVIF: this.supportsImageFormat("avif"),
      connectionType,
      memoryGB: memory,
      cores,
    };
  }

  private supportsImageFormat(format: "webp" | "avif"): boolean {
    if (typeof window === "undefined") return false;

    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;

    const mimeType = format === "webp" ? "image/webp" : "image/avif";
    return canvas.toDataURL(mimeType).indexOf(`data:${mimeType}`) === 0;
  }

  // Get optimal image configuration based on device capabilities
  getOptimalImageConfig(isAboveFold = false) {
    const baseConfig = {
      quality: this.deviceCapabilities.isLowEnd ? 75 : this.config.quality,
      priority: isAboveFold,
      loading: isAboveFold ? ("eager" as const) : ("lazy" as const),
      placeholder: "empty" as const,
    };

    // Adjust quality based on connection
    if (this.deviceCapabilities.connectionType === "slow-2g") {
      baseConfig.quality = 60;
    } else if (this.deviceCapabilities.connectionType === "2g") {
      baseConfig.quality = 70;
    }

    return baseConfig;
  }

  // Get optimal video configuration
  getOptimalVideoConfig(isAboveFold = false) {
    const isLowBandwidth = ["slow-2g", "2g", "3g"].includes(
      this.deviceCapabilities.connectionType
    );

    return {
      preload: isAboveFold ? ("metadata" as const) : ("none" as const),
      autoPlay: isAboveFold && !isLowBandwidth,
      muted: true,
      playsInline: true,
      lazy: !isAboveFold,
      threshold: this.config.threshold,
      rootMargin: this.config.rootMargin,
      quality: this.deviceCapabilities.isLowEnd ? "low" : "medium",
    };
  }

  // Get responsive image sizes based on breakpoints
  getResponsiveSizes(type: "hero" | "card" | "thumbnail" | "full"): string {
    switch (type) {
      case "hero":
        return "(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw";
      case "card":
        return "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";
      case "thumbnail":
        return "(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw";
      case "full":
        return "100vw";
      default:
        return "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";
    }
  }

  // Preload critical assets
  preloadCriticalAssets(
    assets: Array<{ src: string; type: "image" | "video" | "font" }>
  ) {
    if (typeof document === "undefined") return;

    assets.forEach(({ src, type }) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.href = src;

      switch (type) {
        case "image":
          link.as = "image";
          break;
        case "video":
          link.as = "video";
          break;
        case "font":
          link.as = "font";
          link.crossOrigin = "anonymous";
          break;
      }

      document.head.appendChild(link);
    });
  }

  // Generate blur placeholder for images
  generateBlurPlaceholder(width: number, height: number): string {
    if (typeof window === "undefined") return "";

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = width;
    canvas.height = height;

    if (ctx) {
      // Create a simple gradient blur placeholder
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, "#f3f4f6");
      gradient.addColorStop(1, "#e5e7eb");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    }

    return canvas.toDataURL("image/jpeg", 0.1);
  }

  // Check if asset should be lazy loaded
  shouldLazyLoad(isAboveFold: boolean): boolean {
    if (!this.config.enableLazyLoading) return false;
    if (isAboveFold) return false;

    // Don't lazy load on very fast connections
    if (this.deviceCapabilities.connectionType === "4g") return false;

    return true;
  }

  // Get cache headers for different asset types
  getCacheHeaders(assetType: "image" | "video" | "font" | "static") {
    const baseHeaders = {
      "Cache-Control": "public, max-age=31536000, immutable",
    };

    switch (assetType) {
      case "image":
        return {
          ...baseHeaders,
          Vary: "Accept",
        };
      case "video":
        return {
          ...baseHeaders,
          "Accept-Ranges": "bytes",
        };
      case "font":
        return {
          ...baseHeaders,
          "Access-Control-Allow-Origin": "*",
        };
      case "static":
        return baseHeaders;
      default:
        return baseHeaders;
    }
  }

  // Performance monitoring for assets
  monitorAssetPerformance() {
    if (typeof window === "undefined") return;

    // Monitor image loading performance
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === "resource") {
          const resourceEntry = entry as PerformanceResourceTiming;

          if (
            resourceEntry.initiatorType === "img" ||
            resourceEntry.initiatorType === "video"
          ) {
            const loadTime =
              resourceEntry.responseEnd - resourceEntry.requestStart;

            if (loadTime > 3000) {
              // 3 seconds
              console.warn(
                `Slow asset loading detected: ${resourceEntry.name} took ${loadTime}ms`
              );
            }
          }
        }
      });
    });

    observer.observe({ entryTypes: ["resource"] });

    return () => observer.disconnect();
  }

  // Get device capabilities
  getDeviceCapabilities(): DeviceCapabilities {
    return this.deviceCapabilities;
  }

  // Update configuration
  updateConfig(newConfig: Partial<AssetOptimizationConfig>) {
    this.config = { ...this.config, ...newConfig };
  }
}

// Singleton instance
let assetOptimizer: AssetOptimizer | null = null;

export function createAssetOptimizer(
  config?: Partial<AssetOptimizationConfig>
): AssetOptimizer {
  if (!assetOptimizer) {
    assetOptimizer = new AssetOptimizer(config);
  }
  return assetOptimizer;
}

export function getAssetOptimizer(): AssetOptimizer | null {
  return assetOptimizer;
}

// React hook for asset optimization
export function useAssetOptimization(
  config?: Partial<AssetOptimizationConfig>
) {
  if (typeof window === "undefined") {
    return {
      optimizer: null,
      deviceCapabilities: {
        isLowEnd: false,
        supportsWebP: false,
        supportsAVIF: false,
        connectionType: "unknown",
        cores: 1,
      },
      getOptimalImageConfig: () => ({}),
      getOptimalVideoConfig: () => ({}),
    };
  }

  const optimizer = createAssetOptimizer(config);

  return {
    optimizer,
    deviceCapabilities: optimizer.getDeviceCapabilities(),
    getOptimalImageConfig: (isAboveFold?: boolean) =>
      optimizer.getOptimalImageConfig(isAboveFold),
    getOptimalVideoConfig: (isAboveFold?: boolean) =>
      optimizer.getOptimalVideoConfig(isAboveFold),
    getResponsiveSizes: (type: "hero" | "card" | "thumbnail" | "full") =>
      optimizer.getResponsiveSizes(type),
    shouldLazyLoad: (isAboveFold: boolean) =>
      optimizer.shouldLazyLoad(isAboveFold),
  };
}

export default AssetOptimizer;
