"use client";

// Performance monitoring utilities for GSAP and ScrollSmoother
export interface PerformanceMetrics {
  fps: number;
  scrollProgress: number;
  animationCount: number;
  memoryUsage?: number;
  timestamp: number;
}

export interface PerformanceConfig {
  enableFPSMonitoring?: boolean;
  enableMemoryMonitoring?: boolean;
  sampleInterval?: number;
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void;
}

class PerformanceMonitor {
  private config: Required<PerformanceConfig>;
  private isMonitoring = false;
  private frameCount = 0;
  private lastTime = 0;
  private fps = 0;
  private animationFrameId: number | undefined;
  private metricsInterval: number | undefined;

  constructor(config: PerformanceConfig = {}) {
    this.config = {
      enableFPSMonitoring: config.enableFPSMonitoring ?? true,
      enableMemoryMonitoring: config.enableMemoryMonitoring ?? false,
      sampleInterval: config.sampleInterval ?? 1000, // 1 second
      onMetricsUpdate: config.onMetricsUpdate ?? (() => {}),
    };
  }

  start(): void {
    if (typeof window === "undefined" || this.isMonitoring) return;

    this.isMonitoring = true;
    this.lastTime = performance.now();

    if (this.config.enableFPSMonitoring) {
      this.startFPSMonitoring();
    }

    // Start metrics collection interval
    this.metricsInterval = window.setInterval(() => {
      this.collectMetrics();
    }, this.config.sampleInterval);

    console.log("Performance monitoring started");
  }

  stop(): void {
    if (!this.isMonitoring) return;

    this.isMonitoring = false;

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = undefined;
    }

    if (this.metricsInterval) {
      clearInterval(this.metricsInterval);
      this.metricsInterval = undefined;
    }

    console.log("Performance monitoring stopped");
  }

  private startFPSMonitoring(): void {
    const measureFPS = (currentTime: number) => {
      this.frameCount++;

      if (currentTime - this.lastTime >= 1000) {
        this.fps = Math.round(
          (this.frameCount * 1000) / (currentTime - this.lastTime)
        );
        this.frameCount = 0;
        this.lastTime = currentTime;
      }

      if (this.isMonitoring) {
        this.animationFrameId = requestAnimationFrame(measureFPS);
      }
    };

    this.animationFrameId = requestAnimationFrame(measureFPS);
  }

  private collectMetrics(): void {
    if (!this.isMonitoring) return;

    const metrics: PerformanceMetrics = {
      fps: this.fps,
      scrollProgress: this.getScrollProgress(),
      animationCount: this.getActiveAnimationCount(),
      timestamp: performance.now(),
    };

    if (this.config.enableMemoryMonitoring) {
      const memoryUsage = this.getMemoryUsage();
      if (memoryUsage !== undefined) {
        metrics.memoryUsage = memoryUsage;
      }
    }

    this.config.onMetricsUpdate(metrics);

    // Log performance warnings
    if (this.fps < 30 && this.fps > 0) {
      console.warn(`Low FPS detected: ${this.fps}fps`);
    }

    if (metrics.animationCount > 50) {
      console.warn(
        `High animation count: ${metrics.animationCount} active animations`
      );
    }
  }

  private getScrollProgress(): number {
    if (typeof window === "undefined") return 0;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    return scrollHeight > 0 ? scrollTop / scrollHeight : 0;
  }

  private getActiveAnimationCount(): number {
    if (typeof window === "undefined" || !window.gsap) return 0;

    // Count active GSAP animations
    const globalTimeline = window.gsap.globalTimeline;
    let count = 0;

    if (globalTimeline && globalTimeline.getChildren) {
      count = globalTimeline.getChildren(true, true, false).length;
    }

    return count;
  }

  private getMemoryUsage(): number | undefined {
    if (typeof window === "undefined" || !("performance" in window))
      return undefined;

    const memory = (performance as any).memory;

    if (memory && memory.usedJSHeapSize) {
      return Math.round(memory.usedJSHeapSize / 1024 / 1024); // MB
    }

    return undefined;
  }

  getCurrentMetrics(): PerformanceMetrics {
    const metrics: PerformanceMetrics = {
      fps: this.fps,
      scrollProgress: this.getScrollProgress(),
      animationCount: this.getActiveAnimationCount(),
      timestamp: performance.now(),
    };

    if (this.config.enableMemoryMonitoring) {
      const memoryUsage = this.getMemoryUsage();
      if (memoryUsage !== undefined) {
        metrics.memoryUsage = memoryUsage;
      }
    }

    return metrics;
  }
}

// Singleton instance
let performanceMonitor: PerformanceMonitor | null = null;

export function createPerformanceMonitor(
  config?: PerformanceConfig
): PerformanceMonitor {
  if (!performanceMonitor) {
    performanceMonitor = new PerformanceMonitor(config);
  }
  return performanceMonitor;
}

export function getPerformanceMonitor(): PerformanceMonitor | null {
  return performanceMonitor;
}

// React hook for performance monitoring
export function usePerformanceMonitor(config?: PerformanceConfig) {
  if (typeof window === "undefined") {
    return {
      monitor: null,
      metrics: null,
      startMonitoring: () => {},
      stopMonitoring: () => {},
    };
  }

  const monitor = createPerformanceMonitor(config);

  return {
    monitor,
    metrics: monitor.getCurrentMetrics(),
    startMonitoring: () => monitor.start(),
    stopMonitoring: () => monitor.stop(),
  };
}

// Utility functions for performance optimization
export const performanceUtils = {
  // Debounce function for performance-critical operations
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number,
    immediate = false
  ): ((...args: Parameters<T>) => void) => {
    let timeout: number | undefined;

    return function executedFunction(...args: Parameters<T>) {
      const later = () => {
        timeout = undefined;
        if (!immediate) func(...args);
      };

      const callNow = immediate && !timeout;

      if (timeout) clearTimeout(timeout);
      timeout = window.setTimeout(later, wait);

      if (callNow) func(...args);
    };
  },

  // Throttle function for scroll and resize events
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean;

    return function executedFunction(...args: Parameters<T>) {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  // Check if device supports hardware acceleration
  supportsHardwareAcceleration: (): boolean => {
    if (typeof window === "undefined") return false;

    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

    return !!gl;
  },

  // Check if device is low-end based on various factors
  isLowEndDevice: (): boolean => {
    if (typeof window === "undefined") return false;

    // Check hardware concurrency (CPU cores)
    const cores = navigator.hardwareConcurrency || 1;

    // Check memory (if available)
    const memory = (navigator as any).deviceMemory;

    // Check connection (if available)
    const connection = (navigator as any).connection;
    const effectiveType = connection?.effectiveType;

    // Consider device low-end if:
    // - Less than 4 CPU cores
    // - Less than 4GB RAM (if available)
    // - Slow connection (if available)
    return (
      cores < 4 ||
      (memory && memory < 4) ||
      (effectiveType && ["slow-2g", "2g", "3g"].includes(effectiveType))
    );
  },

  // Get optimal animation settings based on device capabilities
  getOptimalAnimationSettings: () => {
    const isLowEnd = performanceUtils.isLowEndDevice();
    const supportsHW = performanceUtils.supportsHardwareAcceleration();

    return {
      force3D: supportsHW,
      smoothTouch: isLowEnd ? 0 : 0.1,
      smooth: isLowEnd ? 0.8 : 1.2,
      effects: !isLowEnd,
      normalizeScroll: true,
      ignoreMobileResize: true,
    };
  },
};

export default PerformanceMonitor;
