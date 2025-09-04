import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { SplitText } from "gsap/SplitText";
import type { GSAPAppConfig, GSAPPerformanceMetrics } from "@/types/gsap";

// Enhanced GSAP configuration with comprehensive typing
export const defaultGSAPConfig: GSAPAppConfig = {
  scrollSmoother: {
    smooth: 1.5,
    effects: true,
    smoothTouch: false,
    normalizeScroll: true,
    ignoreMobileResize: true,
  },
  scrollTrigger: {
    defaults: {
      toggleActions: "restart pause resume pause",
      markers: false,
      anticipatePin: 1,
      fastScrollEnd: true,
      preventOverlaps: true,
      refreshPriority: 0,
      invalidateOnRefresh: false,
    },
  },
  performance: {
    force3D: true,
    nullTargetWarn: false,
    autoSleep: 60,
  },
  debug: {
    markers: process.env.NODE_ENV === "development",
    verbose: process.env.NODE_ENV === "development",
  },
} as const;

// Performance monitoring
let performanceMetrics: GSAPPerformanceMetrics = {
  animationCount: 0,
  scrollTriggerCount: 0,
  averageFPS: 0,
  memoryUsage: 0,
  renderTime: 0,
};

// Initialize GSAP with comprehensive configuration
export const initializeGSAP = (
  config: Partial<GSAPAppConfig> = {}
): GSAPAppConfig => {
  const mergedConfig = { ...defaultGSAPConfig, ...config };

  try {
    // Register plugins
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

    // Set global GSAP configuration
    gsap.config({
      force3D: mergedConfig.performance.force3D,
      nullTargetWarn: mergedConfig.performance.nullTargetWarn,
      autoSleep: mergedConfig.performance.autoSleep,
    });

    // Configure ScrollTrigger
    ScrollTrigger.config({
      ignoreMobileResize: true,
      autoRefreshEvents: "visibilitychange,DOMContentLoaded,load,resize",
      limitCallbacks: true,
    });

    // Set ScrollTrigger defaults
    const { snap: _, ...scrollTriggerDefaults } =
      mergedConfig.scrollTrigger.defaults;
    ScrollTrigger.defaults(scrollTriggerDefaults);

    // Initialize performance monitoring
    if (typeof window !== "undefined") {
      initializePerformanceMonitoring();
    }

    // Log initialization in development
    if (mergedConfig.debug.verbose) {
      console.log("GSAP initialized with config:", mergedConfig);
    }

    return mergedConfig;
  } catch (error) {
    console.error("Failed to initialize GSAP:", error);
    throw error;
  }
};

// Enhanced cleanup with performance tracking
export const cleanupGSAP = (): void => {
  try {
    // Kill all ScrollTrigger instances
    const triggers = ScrollTrigger.getAll();
    triggers.forEach((trigger) => {
      try {
        trigger.kill();
      } catch (error) {
        console.warn("Error killing ScrollTrigger:", error);
      }
    });

    // Kill all GSAP tweens and timelines
    gsap.killTweensOf("*");

    // Clear all timelines
    gsap.globalTimeline.clear();

    // Refresh ScrollTrigger
    ScrollTrigger.refresh();

    // Reset performance metrics
    performanceMetrics = {
      animationCount: 0,
      scrollTriggerCount: 0,
      averageFPS: 0,
      memoryUsage: 0,
      renderTime: 0,
    };

    console.log("GSAP cleanup completed");
  } catch (error) {
    console.error("Error during GSAP cleanup:", error);
  }
};

// Performance monitoring initialization
const initializePerformanceMonitoring = (): void => {
  if (typeof window === "undefined") return;

  let frameCount = 0;
  let lastTime = performance.now();
  let fpsSum = 0;

  const measurePerformance = (): void => {
    const currentTime = performance.now();
    const deltaTime = currentTime - lastTime;

    if (deltaTime >= 1000) {
      // Update every second
      const fps = (frameCount * 1000) / deltaTime;
      fpsSum += fps;

      performanceMetrics.averageFPS = fpsSum / ++frameCount;
      performanceMetrics.animationCount =
        gsap.globalTimeline.getChildren().length;
      performanceMetrics.scrollTriggerCount = ScrollTrigger.getAll().length;

      // Memory usage (if available)
      if ("memory" in performance) {
        const memory = (
          performance as Performance & {
            memory?: { usedJSHeapSize: number; jsHeapSizeLimit: number };
          }
        ).memory;
        if (memory) {
          performanceMetrics.memoryUsage =
            memory.usedJSHeapSize / memory.jsHeapSizeLimit;
        }
      }

      lastTime = currentTime;
      frameCount = 0;
    }

    frameCount++;
    requestAnimationFrame(measurePerformance);
  };

  requestAnimationFrame(measurePerformance);
};

// Get current performance metrics
export const getGSAPPerformanceMetrics = (): GSAPPerformanceMetrics => {
  return { ...performanceMetrics };
};

// Create a safe GSAP context
export const createGSAPContext = (scope?: string | Element): gsap.Context => {
  return gsap.context(() => {}, scope);
};

// Utility to safely register GSAP plugins
export const registerGSAPPlugins = (...plugins: unknown[]): void => {
  try {
    gsap.registerPlugin(...(plugins as gsap.Plugin[]));
  } catch (error) {
    console.error("Failed to register GSAP plugins:", error);
  }
};

// Utility to create responsive GSAP animations
export const createResponsiveAnimation = (
  target: string | Element,
  mobileVars: gsap.TweenVars,
  desktopVars: gsap.TweenVars,
  breakpoint: number = 768
): gsap.core.Tween => {
  const isMobile =
    typeof window !== "undefined" && window.innerWidth < breakpoint;
  return gsap.to(target, isMobile ? mobileVars : desktopVars);
};

// Utility to batch GSAP operations for better performance
export const batchGSAPOperations = (operations: (() => void)[]): void => {
  gsap.set({}, {}); // Trigger a batch update
  operations.forEach((operation) => operation());
  gsap.set({}, {}); // Trigger another batch update
};

// Error handling wrapper for GSAP operations
export const safeGSAPOperation = <T>(
  operation: () => T,
  fallback?: T,
  onError?: (error: Error) => void
): T | undefined => {
  try {
    return operation();
  } catch (error) {
    const gsapError = error as Error;
    console.error("GSAP operation failed:", gsapError);

    if (onError) {
      onError(gsapError);
    }

    return fallback;
  }
};
