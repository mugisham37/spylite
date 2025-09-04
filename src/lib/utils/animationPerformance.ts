/**
 * Animation performance testing and monitoring utilities
 */

import { gsap } from "gsap";

export interface AnimationPerformanceMetrics {
  fps: number;
  frameDrops: number;
  averageFrameTime: number;
  maxFrameTime: number;
  minFrameTime: number;
  totalFrames: number;
  duration: number;
  animationName: string;
  timestamp: number;
}

export interface DeviceCapabilities {
  deviceMemory: number | undefined;
  hardwareConcurrency: number;
  connection:
    | {
        effectiveType: string;
        downlink: number;
      }
    | undefined;
  isLowEndDevice: boolean;
  preferReducedMotion: boolean;
}

// Performance monitoring class for GSAP animations
export class AnimationPerformanceMonitor {
  private frameTimes: number[] = [];
  private startTime: number = 0;
  private lastFrameTime: number = 0;
  private frameCount: number = 0;
  private animationName: string = "";
  private isMonitoring: boolean = false;
  private animationFrame: number = 0;

  constructor(animationName: string = "unknown") {
    this.animationName = animationName;
  }

  start(): void {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    this.startTime = performance.now();
    this.lastFrameTime = this.startTime;
    this.frameTimes = [];
    this.frameCount = 0;

    this.measureFrame();
  }

  stop(): AnimationPerformanceMetrics {
    if (!this.isMonitoring) {
      throw new Error("Monitor is not running");
    }

    this.isMonitoring = false;
    cancelAnimationFrame(this.animationFrame);

    const endTime = performance.now();
    const duration = endTime - this.startTime;
    const fps = (this.frameCount / duration) * 1000;
    const frameDrops = this.frameTimes.filter((time) => time > 16.67).length; // 60fps = 16.67ms per frame
    const averageFrameTime =
      this.frameTimes.reduce((sum, time) => sum + time, 0) /
      this.frameTimes.length;
    const maxFrameTime = Math.max(...this.frameTimes);
    const minFrameTime = Math.min(...this.frameTimes);

    return {
      fps,
      frameDrops,
      averageFrameTime,
      maxFrameTime,
      minFrameTime,
      totalFrames: this.frameCount,
      duration,
      animationName: this.animationName,
      timestamp: Date.now(),
    };
  }

  private measureFrame = (): void => {
    if (!this.isMonitoring) return;

    const currentTime = performance.now();
    const frameTime = currentTime - this.lastFrameTime;

    this.frameTimes.push(frameTime);
    this.frameCount++;
    this.lastFrameTime = currentTime;

    this.animationFrame = requestAnimationFrame(this.measureFrame);
  };
}

// Get device capabilities for performance optimization
export const getDeviceCapabilities = (): DeviceCapabilities => {
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: {
      effectiveType: string;
      downlink: number;
    };
    mozConnection?: {
      effectiveType: string;
      downlink: number;
    };
    webkitConnection?: {
      effectiveType: string;
      downlink: number;
    };
  };

  const deviceMemory = nav.deviceMemory;
  const hardwareConcurrency = nav.hardwareConcurrency || 4;
  const connection =
    nav.connection || nav.mozConnection || nav.webkitConnection;

  // Determine if this is a low-end device
  const isLowEndDevice = Boolean(
    (deviceMemory && deviceMemory <= 4) ||
      hardwareConcurrency <= 2 ||
      (connection &&
        (connection.effectiveType === "slow-2g" ||
          connection.effectiveType === "2g"))
  );

  const preferReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  return {
    deviceMemory,
    hardwareConcurrency,
    connection: connection
      ? {
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
        }
      : undefined,
    isLowEndDevice,
    preferReducedMotion,
  };
};

// Optimize GSAP settings based on device capabilities
export const optimizeGSAPForDevice = (
  capabilities: DeviceCapabilities
): void => {
  if (capabilities.isLowEndDevice || capabilities.preferReducedMotion) {
    // Reduce animation complexity for low-end devices
    gsap.config({
      force3D: false,
      nullTargetWarn: false,
    });

    // Disable or simplify complex animations
    gsap.globalTimeline.timeScale(
      capabilities.preferReducedMotion ? 0.01 : 0.5
    );
  } else {
    // Enable hardware acceleration for capable devices
    gsap.config({
      force3D: true,
      nullTargetWarn: false,
    });
  }
};

// Test animation performance across different scenarios
export const testAnimationPerformance = async (
  animationFunction: () => gsap.core.Timeline | gsap.core.Tween,
  testName: string = "animation-test"
): Promise<AnimationPerformanceMetrics> => {
  const monitor = new AnimationPerformanceMonitor(testName);

  return new Promise((resolve, reject) => {
    try {
      monitor.start();

      const animation = animationFunction();

      // Stop monitoring when animation completes
      animation.eventCallback("onComplete", () => {
        try {
          const metrics = monitor.stop();
          resolve(metrics);
        } catch (error) {
          reject(error);
        }
      });

      // Fallback timeout
      setTimeout(() => {
        try {
          const metrics = monitor.stop();
          resolve(metrics);
        } catch (error) {
          reject(error);
        }
      }, 10000); // 10 second timeout
    } catch (error) {
      reject(error);
    }
  });
};

// Batch test multiple animations
export const batchTestAnimations = async (
  tests: Array<{
    name: string;
    animation: () => gsap.core.Timeline | gsap.core.Tween;
  }>
): Promise<AnimationPerformanceMetrics[]> => {
  const results: AnimationPerformanceMetrics[] = [];

  for (const test of tests) {
    try {
      const metrics = await testAnimationPerformance(test.animation, test.name);
      results.push(metrics);

      // Wait between tests to avoid interference
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Failed to test animation ${test.name}:`, error);
    }
  }

  return results;
};

// Generate performance report
export const generatePerformanceReport = (
  metrics: AnimationPerformanceMetrics[]
): string => {
  const report = {
    summary: {
      totalAnimations: metrics.length,
      averageFPS: metrics.reduce((sum, m) => sum + m.fps, 0) / metrics.length,
      totalFrameDrops: metrics.reduce((sum, m) => sum + m.frameDrops, 0),
      worstPerformer: metrics.reduce((worst, current) =>
        current.fps < worst.fps ? current : worst
      ),
      bestPerformer: metrics.reduce((best, current) =>
        current.fps > best.fps ? current : best
      ),
    },
    details: metrics.map((m) => ({
      name: m.animationName,
      fps: Math.round(m.fps * 100) / 100,
      frameDrops: m.frameDrops,
      avgFrameTime: Math.round(m.averageFrameTime * 100) / 100,
      maxFrameTime: Math.round(m.maxFrameTime * 100) / 100,
      duration: Math.round(m.duration),
      rating:
        m.fps >= 55
          ? "excellent"
          : m.fps >= 45
          ? "good"
          : m.fps >= 30
          ? "fair"
          : "poor",
    })),
    recommendations: generateRecommendations(metrics),
  };

  return JSON.stringify(report, null, 2);
};

// Generate optimization recommendations based on performance data
const generateRecommendations = (
  metrics: AnimationPerformanceMetrics[]
): string[] => {
  const recommendations: string[] = [];

  const avgFPS = metrics.reduce((sum, m) => sum + m.fps, 0) / metrics.length;
  const totalFrameDrops = metrics.reduce((sum, m) => sum + m.frameDrops, 0);

  if (avgFPS < 45) {
    recommendations.push("Consider reducing animation complexity or duration");
    recommendations.push(
      "Use transform and opacity properties for better GPU acceleration"
    );
  }

  if (totalFrameDrops > metrics.length * 5) {
    recommendations.push(
      "High frame drop count detected - consider optimizing heavy animations"
    );
    recommendations.push("Implement animation culling for off-screen elements");
  }

  const longAnimations = metrics.filter((m) => m.duration > 3000);
  if (longAnimations.length > 0) {
    recommendations.push(
      "Consider breaking down long animations into smaller chunks"
    );
  }

  const poorPerformers = metrics.filter((m) => m.fps < 30);
  if (poorPerformers.length > 0) {
    recommendations.push(
      `Poor performing animations: ${poorPerformers
        .map((p) => p.animationName)
        .join(", ")}`
    );
  }

  return recommendations;
};

// Real-time performance monitoring for production
export const startRealTimeMonitoring = (): (() => void) => {
  if (typeof window === "undefined") return () => {};

  const observers: PerformanceObserver[] = [];

  // Monitor long tasks
  if ("PerformanceObserver" in window) {
    const longTaskObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.duration > 50) {
          // Tasks longer than 50ms
          console.warn(`Long task detected: ${entry.duration}ms`, entry);
        }
      });
    });

    try {
      longTaskObserver.observe({ entryTypes: ["longtask"] });
      observers.push(longTaskObserver);
    } catch (error) {
      // longtask not supported
      console.debug("Long task monitoring not supported:", error);
    }
  }

  // Monitor layout shifts
  if ("PerformanceObserver" in window) {
    const layoutShiftObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        const layoutShiftEntry = entry as PerformanceEntry & { value?: number };
        if (layoutShiftEntry.value && layoutShiftEntry.value > 0.1) {
          // Significant layout shift
          console.warn(
            `Layout shift detected: ${layoutShiftEntry.value}`,
            entry
          );
        }
      });
    });

    try {
      layoutShiftObserver.observe({ entryTypes: ["layout-shift"] });
      observers.push(layoutShiftObserver);
    } catch (error) {
      // layout-shift not supported
      console.debug("Layout shift monitoring not supported:", error);
    }
  }

  // Cleanup function
  return () => {
    observers.forEach((observer) => observer.disconnect());
  };
};

// Export performance data for analysis
export const exportPerformanceData = (
  metrics: AnimationPerformanceMetrics[]
): void => {
  const data = {
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    deviceCapabilities: getDeviceCapabilities(),
    metrics,
    report: generatePerformanceReport(metrics),
  };

  // Create downloadable file
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `animation-performance-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
