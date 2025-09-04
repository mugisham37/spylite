"use client";

import { ScrollSmoother } from "gsap/ScrollSmoother";

interface PerformanceMetrics {
  fps: number;
  scrollDelta: number;
  timestamp: number;
  smootherActive: boolean;
}

class ScrollPerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private isMonitoring = false;
  private animationFrame: number | null = null;
  private lastTimestamp = 0;
  private frameCount = 0;
  private lastScrollPosition = 0;

  start() {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    this.metrics = [];
    this.lastTimestamp = performance.now();
    this.frameCount = 0;
    this.lastScrollPosition = window.scrollY;

    this.monitor();
  }

  stop() {
    this.isMonitoring = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  private monitor = () => {
    if (!this.isMonitoring) return;

    const now = performance.now();
    const deltaTime = now - this.lastTimestamp;

    if (deltaTime >= 1000) {
      // Calculate FPS every second
      const fps = Math.round((this.frameCount * 1000) / deltaTime);
      const currentScrollPosition = window.scrollY;
      const scrollDelta = Math.abs(
        currentScrollPosition - this.lastScrollPosition
      );
      const smootherActive = !!ScrollSmoother.get();

      this.metrics.push({
        fps,
        scrollDelta,
        timestamp: now,
        smootherActive,
      });

      this.frameCount = 0;
      this.lastTimestamp = now;
      this.lastScrollPosition = currentScrollPosition;
    }

    this.frameCount++;
    this.animationFrame = requestAnimationFrame(this.monitor);
  };

  getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  getAverageMetrics() {
    if (this.metrics.length === 0) return null;

    const totalFps = this.metrics.reduce((sum, metric) => sum + metric.fps, 0);
    const totalScrollDelta = this.metrics.reduce(
      (sum, metric) => sum + metric.scrollDelta,
      0
    );

    return {
      averageFps: Math.round(totalFps / this.metrics.length),
      totalScrollDistance: totalScrollDelta,
      samplesCount: this.metrics.length,
      smootherActive:
        this.metrics[this.metrics.length - 1]?.smootherActive || false,
    };
  }

  reset() {
    this.metrics = [];
    this.frameCount = 0;
    this.lastTimestamp = performance.now();
    this.lastScrollPosition = window.scrollY;
  }
}

// Export singleton instance
export const scrollPerformanceMonitor = new ScrollPerformanceMonitor();

// Utility functions for device detection
export const getDeviceInfo = () => {
  const userAgent = navigator.userAgent;
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      userAgent
    );
  const isTablet =
    /iPad|Android(?=.*\bMobile\b)(?=.*\bSafari\b)|Android(?=.*\bTablet\b)/i.test(
      userAgent
    );
  const isDesktop = !isMobile && !isTablet;

  return {
    isMobile,
    isTablet,
    isDesktop,
    userAgent,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
    pixelRatio: window.devicePixelRatio || 1,
  };
};

// Test scroll performance across different scenarios
export const testScrollPerformance = async (duration = 10000) => {
  const deviceInfo = getDeviceInfo();
  console.log("Starting scroll performance test...", deviceInfo);

  scrollPerformanceMonitor.start();

  // Simulate different scroll patterns
  const scrollSmoother = ScrollSmoother.get();

  if (scrollSmoother) {
    // Test smooth scrolling to different positions
    await new Promise((resolve) => setTimeout(resolve, 2000));
    scrollSmoother.scrollTo(1000, true);

    await new Promise((resolve) => setTimeout(resolve, 2000));
    scrollSmoother.scrollTo(2000, true);

    await new Promise((resolve) => setTimeout(resolve, 2000));
    scrollSmoother.scrollTo(0, true);
  }

  // Wait for test duration
  await new Promise((resolve) => setTimeout(resolve, duration - 6000));

  scrollPerformanceMonitor.stop();

  const results = {
    deviceInfo,
    performanceMetrics: scrollPerformanceMonitor.getAverageMetrics(),
    detailedMetrics: scrollPerformanceMonitor.getMetrics(),
  };

  console.log("Scroll performance test results:", results);
  return results;
};
