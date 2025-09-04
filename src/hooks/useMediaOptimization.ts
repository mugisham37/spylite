"use client";

import { useEffect, useState } from "react";
import {
  getAdaptiveLoadingStrategy,
  getMemoryAwareStrategy,
  addResourceHints,
  preloadCriticalResources,
} from "@/lib/utils/mediaLoadingStrategy";

interface MediaOptimizationConfig {
  imageQuality: number;
  videoPreload: "none" | "metadata" | "auto";
  enableLazyLoading: boolean;
  maxConcurrentLoads: number;
  enableImageOptimization: boolean;
}

export const useMediaOptimization = () => {
  const [config, setConfig] = useState<MediaOptimizationConfig>({
    imageQuality: 85,
    videoPreload: "metadata",
    enableLazyLoading: true,
    maxConcurrentLoads: 4,
    enableImageOptimization: true,
  });

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize media optimization on client side only
    if (typeof window === "undefined") return;

    const adaptiveStrategy = getAdaptiveLoadingStrategy();
    const memoryStrategy = getMemoryAwareStrategy();

    setConfig({
      ...adaptiveStrategy,
      ...memoryStrategy,
    });

    // Add resource hints for better performance
    addResourceHints();

    // Preload critical resources
    preloadCriticalResources();

    setIsInitialized(true);
  }, []);

  // Get optimized image props based on current config
  const getOptimizedImageProps = (priority: boolean = false) => ({
    quality: config.imageQuality,
    priority,
    loading: priority ? ("eager" as const) : ("lazy" as const),
    placeholder: "empty" as const,
  });

  // Get optimized video props based on current config
  const getOptimizedVideoProps = (priority: boolean = false) => ({
    preload: priority ? ("metadata" as const) : config.videoPreload,
    lazy: !priority && config.enableLazyLoading,
  });

  // Check if device supports modern image formats
  const supportsModernFormats = () => {
    if (typeof window === "undefined") return false;

    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;

    return (
      canvas.toDataURL("image/webp").indexOf("data:image/webp") === 0 ||
      canvas.toDataURL("image/avif").indexOf("data:image/avif") === 0
    );
  };

  // Get responsive sizes based on viewport
  const getResponsiveSizes = (breakpoints: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
    defaultSize?: string;
  }) => {
    const {
      mobile = "100vw",
      tablet = "50vw",
      desktop = "33vw",
      defaultSize = "100vw",
    } = breakpoints;

    return `(max-width: 640px) ${mobile}, (max-width: 1024px) ${tablet}, (max-width: 1920px) ${desktop}, ${defaultSize}`;
  };

  return {
    config,
    isInitialized,
    getOptimizedImageProps,
    getOptimizedVideoProps,
    supportsModernFormats,
    getResponsiveSizes,
  };
};
