"use client";

import { useEffect, useState, useCallback } from "react";
import { useAssetOptimization } from "@/utils/asset-optimization";
import { useCachingStrategy } from "@/utils/caching-strategy";
import { usePerformanceMonitor } from "@/utils/performance-monitor";

export interface PerformanceOptimizationConfig {
  enableAssetOptimization: boolean;
  enableCaching: boolean;
  enablePerformanceMonitoring: boolean;
  enableServiceWorker: boolean;
  criticalAssets: Array<{ src: string; type: "image" | "video" | "font" }>;
}

export interface PerformanceMetrics {
  cacheHitRate: number;
  averageLoadTime: number;
  totalAssets: number;
  optimizedAssets: number;
  fps: number;
  memoryUsage?: number;
}

export function usePerformanceOptimization(
  config: Partial<PerformanceOptimizationConfig> = {}
) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    cacheHitRate: 0,
    averageLoadTime: 0,
    totalAssets: 0,
    optimizedAssets: 0,
    fps: 0,
  });

  const fullConfig: PerformanceOptimizationConfig = {
    enableAssetOptimization: true,
    enableCaching: true,
    enablePerformanceMonitoring: true,
    enableServiceWorker: true,
    criticalAssets: [
      { src: "/fonts/ProximaNova-Regular.otf", type: "font" },
      { src: "/images/hero-bg.png", type: "image" },
      { src: "/images/logo.png", type: "image" },
      { src: "/videos/hero-bg.mp4", type: "video" },
    ],
    ...config,
  };

  // Initialize optimization utilities
  const assetOptimization = useAssetOptimization({
    enableLazyLoading: fullConfig.enableAssetOptimization,
    enableWebP: true,
    enableAVIF: true,
    quality: 90,
    threshold: 0.1,
    rootMargin: "50px",
    enableAdaptiveLoading: true,
  });

  const cachingStrategy = useCachingStrategy();

  const performanceMonitor = usePerformanceMonitor({
    enableFPSMonitoring: fullConfig.enablePerformanceMonitoring,
    enableMemoryMonitoring: fullConfig.enablePerformanceMonitoring,
    sampleInterval: 1000,
    onMetricsUpdate: (newMetrics) => {
      setMetrics((prev) => {
        const updated: PerformanceMetrics = {
          ...prev,
          fps: newMetrics.fps,
        };

        if (newMetrics.memoryUsage !== undefined) {
          updated.memoryUsage = newMetrics.memoryUsage;
        }

        return updated;
      });
    },
  });

  // Initialize performance optimizations
  useEffect(() => {
    if (typeof window === "undefined" || isInitialized) return;

    const initializeOptimizations = async () => {
      try {
        // Initialize caching strategy
        if (fullConfig.enableCaching && cachingStrategy.strategy) {
          cachingStrategy.manageBrowserCache();

          if (fullConfig.enableServiceWorker) {
            await cachingStrategy.registerServiceWorker();
          }
        }

        // Preload critical assets
        if (fullConfig.enableAssetOptimization && assetOptimization.optimizer) {
          assetOptimization.optimizer.preloadCriticalAssets(
            fullConfig.criticalAssets
          );
        }

        // Start performance monitoring
        if (
          fullConfig.enablePerformanceMonitoring &&
          performanceMonitor.monitor
        ) {
          performanceMonitor.startMonitoring();
        }

        setIsInitialized(true);
        console.log("Performance optimizations initialized");
      } catch (error) {
        console.error("Failed to initialize performance optimizations:", error);
      }
    };

    initializeOptimizations();

    // Cleanup on unmount
    return () => {
      if (performanceMonitor.monitor) {
        performanceMonitor.stopMonitoring();
      }
    };
  }, [
    isInitialized,
    fullConfig.enableCaching,
    fullConfig.enableAssetOptimization,
    fullConfig.enablePerformanceMonitoring,
    fullConfig.enableServiceWorker,
    assetOptimization.optimizer,
    cachingStrategy.strategy,
    performanceMonitor.monitor,
    performanceMonitor.startMonitoring,
    performanceMonitor.stopMonitoring,
    fullConfig.criticalAssets,
  ]);

  // Monitor resource loading performance
  useEffect(() => {
    if (
      !fullConfig.enablePerformanceMonitoring ||
      typeof window === "undefined"
    )
      return;

    let cacheHits = 0;
    let cacheMisses = 0;
    let totalLoadTime = 0;
    let loadCount = 0;

    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === "resource") {
          const resourceEntry = entry as PerformanceResourceTiming;

          // Check if resource was served from cache
          const fromCache =
            resourceEntry.transferSize === 0 &&
            resourceEntry.decodedBodySize > 0;

          if (fromCache) {
            cacheHits++;
          } else {
            cacheMisses++;
          }

          // Calculate load time
          const loadTime =
            resourceEntry.responseEnd - resourceEntry.requestStart;
          totalLoadTime += loadTime;
          loadCount++;

          // Update metrics
          setMetrics((prev) => ({
            ...prev,
            cacheHitRate: cacheHits / (cacheHits + cacheMisses),
            averageLoadTime: totalLoadTime / loadCount,
            totalAssets: cacheHits + cacheMisses,
          }));
        }
      });
    });

    observer.observe({ entryTypes: ["resource"] });

    return () => observer.disconnect();
  }, [fullConfig.enablePerformanceMonitoring]);

  // Get optimal image configuration
  const getOptimalImageConfig = useCallback(
    (
      isAboveFold = false,
      imageType: "hero" | "card" | "thumbnail" | "full" = "card"
    ) => {
      if (!assetOptimization.optimizer) {
        return {
          quality: 90,
          priority: isAboveFold,
          loading: isAboveFold ? ("eager" as const) : ("lazy" as const),
          sizes: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
        };
      }

      const baseConfig = assetOptimization.getOptimalImageConfig(isAboveFold);
      const sizes = assetOptimization.getResponsiveSizes(imageType);

      return {
        ...baseConfig,
        sizes,
      };
    },
    [assetOptimization]
  );

  // Get optimal video configuration
  const getOptimalVideoConfig = useCallback(
    (isAboveFold = false) => {
      if (!assetOptimization.optimizer) {
        return {
          preload: isAboveFold ? ("metadata" as const) : ("none" as const),
          autoPlay: false,
          muted: true,
          playsInline: true,
          lazy: !isAboveFold,
        };
      }

      return assetOptimization.getOptimalVideoConfig(isAboveFold);
    },
    [assetOptimization]
  );

  // Check if lazy loading should be enabled
  const shouldLazyLoad = useCallback(
    (isAboveFold: boolean) => {
      if (!assetOptimization.optimizer) return !isAboveFold;
      return assetOptimization.shouldLazyLoad(isAboveFold);
    },
    [assetOptimization]
  );

  // Get cache headers for assets
  const getCacheHeaders = useCallback(
    (assetType: "image" | "video" | "font" | "static") => {
      if (!cachingStrategy.strategy) return {};

      const cacheConfigMap = {
        image: "images" as const,
        video: "videos" as const,
        font: "fonts" as const,
        static: "staticAssets" as const,
      };

      return cachingStrategy.generateCacheHeaders(cacheConfigMap[assetType]);
    },
    [cachingStrategy]
  );

  // Preload specific assets
  const preloadAssets = useCallback(
    (assets: Array<{ src: string; type: "image" | "video" | "font" }>) => {
      if (!assetOptimization.optimizer) return;
      assetOptimization.optimizer.preloadCriticalAssets(assets);
    },
    [assetOptimization]
  );

  // Get performance report
  const getPerformanceReport = useCallback(() => {
    return {
      ...metrics,
      deviceCapabilities: assetOptimization.deviceCapabilities,
      isInitialized,
      optimizationsEnabled: {
        assetOptimization: fullConfig.enableAssetOptimization,
        caching: fullConfig.enableCaching,
        performanceMonitoring: fullConfig.enablePerformanceMonitoring,
        serviceWorker: fullConfig.enableServiceWorker,
      },
    };
  }, [
    metrics,
    assetOptimization.deviceCapabilities,
    isInitialized,
    fullConfig,
  ]);

  return {
    // State
    isInitialized,
    metrics,
    deviceCapabilities: assetOptimization.deviceCapabilities,

    // Configuration methods
    getOptimalImageConfig,
    getOptimalVideoConfig,
    shouldLazyLoad,
    getCacheHeaders,

    // Asset management
    preloadAssets,

    // Performance monitoring
    getPerformanceReport,

    // Utilities
    optimizer: assetOptimization.optimizer,
    cachingStrategy: cachingStrategy.strategy,
    performanceMonitor: performanceMonitor.monitor,
  };
}

export default usePerformanceOptimization;
