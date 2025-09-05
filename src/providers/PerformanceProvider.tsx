"use client";

import React, { createContext, useContext, useEffect, ReactNode } from "react";
import usePerformanceOptimization from "@/hooks/usePerformanceOptimization";

interface PerformanceContextValue {
  isInitialized: boolean;
  getOptimalImageConfig: (
    isAboveFold?: boolean,
    imageType?: "hero" | "card" | "thumbnail" | "full"
  ) => any;
  getOptimalVideoConfig: (isAboveFold?: boolean) => any;
  shouldLazyLoad: (isAboveFold: boolean) => boolean;
  preloadAssets: (
    assets: Array<{ src: string; type: "image" | "video" | "font" }>
  ) => void;
  deviceCapabilities: any;
  metrics: any;
}

const PerformanceContext = createContext<PerformanceContextValue | null>(null);

interface PerformanceProviderProps {
  children: ReactNode;
  enableAssetOptimization?: boolean;
  enableCaching?: boolean;
  enablePerformanceMonitoring?: boolean;
  enableServiceWorker?: boolean;
}

export function PerformanceProvider({
  children,
  enableAssetOptimization = true,
  enableCaching = true,
  enablePerformanceMonitoring = true,
  enableServiceWorker = true,
}: PerformanceProviderProps) {
  const performance = usePerformanceOptimization({
    enableAssetOptimization,
    enableCaching,
    enablePerformanceMonitoring,
    enableServiceWorker,
    criticalAssets: [
      { src: "/fonts/ProximaNova-Regular.otf", type: "font" },
      { src: "/images/hero-bg.png", type: "image" },
      { src: "/images/logo.png", type: "image" },
      { src: "/images/nav-logo.svg", type: "image" },
      { src: "/videos/hero-bg.mp4", type: "video" },
    ],
  });

  // Log performance metrics in development
  useEffect(() => {
    if (process.env.NODE_ENV === "development" && performance.isInitialized) {
      const report = performance.getPerformanceReport();
      console.log("Performance Report:", report);
    }
  }, [performance.isInitialized, performance]);

  const contextValue: PerformanceContextValue = {
    isInitialized: performance.isInitialized,
    getOptimalImageConfig: performance.getOptimalImageConfig,
    getOptimalVideoConfig: performance.getOptimalVideoConfig,
    shouldLazyLoad: performance.shouldLazyLoad,
    preloadAssets: performance.preloadAssets,
    deviceCapabilities: performance.deviceCapabilities,
    metrics: performance.metrics,
  };

  return (
    <PerformanceContext.Provider value={contextValue}>
      {children}
    </PerformanceContext.Provider>
  );
}

export function usePerformanceContext(): PerformanceContextValue {
  const context = useContext(PerformanceContext);

  if (!context) {
    throw new Error(
      "usePerformanceContext must be used within a PerformanceProvider"
    );
  }

  return context;
}

export default PerformanceProvider;
