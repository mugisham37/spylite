/**
 * Performance monitoring utilities for media optimization
 */

interface PerformanceMetrics {
  imageLoadTime: number;
  videoLoadTime: number;
  totalMediaSize: number;
  coreWebVitals: {
    lcp?: number;
    fid?: number;
    cls?: number;
  };
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    imageLoadTime: 0,
    videoLoadTime: 0,
    totalMediaSize: 0,
    coreWebVitals: {},
  };

  private imageLoadTimes: number[] = [];
  private videoLoadTimes: number[] = [];

  // Track image loading performance
  trackImageLoad(startTime: number, endTime: number, size?: number) {
    const loadTime = endTime - startTime;
    this.imageLoadTimes.push(loadTime);
    this.metrics.imageLoadTime = this.calculateAverage(this.imageLoadTimes);

    if (size) {
      this.metrics.totalMediaSize += size;
    }

    console.log(`Image loaded in ${loadTime}ms`);
  }

  // Track video loading performance
  trackVideoLoad(startTime: number, endTime: number, size?: number) {
    const loadTime = endTime - startTime;
    this.videoLoadTimes.push(loadTime);
    this.metrics.videoLoadTime = this.calculateAverage(this.videoLoadTimes);

    if (size) {
      this.metrics.totalMediaSize += size;
    }

    console.log(`Video loaded in ${loadTime}ms`);
  }

  // Monitor Core Web Vitals
  monitorCoreWebVitals() {
    if (typeof window === "undefined") return;

    // Largest Contentful Paint (LCP)
    if ("PerformanceObserver" in window) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformanceEntry & {
          startTime: number;
        };
        this.metrics.coreWebVitals.lcp = lastEntry.startTime;
        console.log("LCP:", lastEntry.startTime);
      });

      try {
        lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
      } catch {
        console.warn("LCP monitoring not supported");
      }

      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          const fidEntry = entry as PerformanceEntry & {
            processingStart: number;
          };
          if ("processingStart" in fidEntry) {
            this.metrics.coreWebVitals.fid =
              fidEntry.processingStart - fidEntry.startTime;
            console.log("FID:", fidEntry.processingStart - fidEntry.startTime);
          }
        });
      });

      try {
        fidObserver.observe({ entryTypes: ["first-input"] });
      } catch {
        console.warn("FID monitoring not supported");
      }

      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          const clsEntry = entry as PerformanceEntry & {
            hadRecentInput: boolean;
            value: number;
          };
          if ("hadRecentInput" in clsEntry && "value" in clsEntry) {
            if (!clsEntry.hadRecentInput) {
              clsValue += clsEntry.value;
              this.metrics.coreWebVitals.cls = clsValue;
              console.log("CLS:", clsValue);
            }
          }
        });
      });

      try {
        clsObserver.observe({ entryTypes: ["layout-shift"] });
      } catch {
        console.warn("CLS monitoring not supported");
      }
    }
  }

  // Get current metrics
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  // Calculate average from array of numbers
  private calculateAverage(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
  }

  // Generate performance report
  generateReport(): string {
    const metrics = this.getMetrics();
    return `
Performance Report:
==================
Average Image Load Time: ${metrics.imageLoadTime.toFixed(2)}ms
Average Video Load Time: ${metrics.videoLoadTime.toFixed(2)}ms
Total Media Size: ${(metrics.totalMediaSize / 1024 / 1024).toFixed(2)}MB
Core Web Vitals:
  - LCP: ${metrics.coreWebVitals.lcp?.toFixed(2) || "N/A"}ms
  - FID: ${metrics.coreWebVitals.fid?.toFixed(2) || "N/A"}ms
  - CLS: ${metrics.coreWebVitals.cls?.toFixed(4) || "N/A"}
    `;
  }

  // Reset metrics
  reset() {
    this.metrics = {
      imageLoadTime: 0,
      videoLoadTime: 0,
      totalMediaSize: 0,
      coreWebVitals: {},
    };
    this.imageLoadTimes = [];
    this.videoLoadTimes = [];
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// Initialize performance monitoring
export const initializePerformanceMonitoring = () => {
  if (typeof window === "undefined") return;

  performanceMonitor.monitorCoreWebVitals();

  // Log performance report after page load
  window.addEventListener("load", () => {
    setTimeout(() => {
      console.log(performanceMonitor.generateReport());
    }, 5000); // Wait 5 seconds after load to get accurate metrics
  });
};

// Utility to measure resource loading time
export const measureResourceLoad = async (
  url: string,
  type: "image" | "video"
): Promise<number> => {
  const startTime = performance.now();

  try {
    if (type === "image") {
      await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = url;
      });
    } else {
      await new Promise((resolve, reject) => {
        const video = document.createElement("video");
        video.addEventListener("loadedmetadata", resolve);
        video.addEventListener("error", reject);
        video.src = url;
      });
    }

    const endTime = performance.now();
    const loadTime = endTime - startTime;

    if (type === "image") {
      performanceMonitor.trackImageLoad(startTime, endTime);
    } else {
      performanceMonitor.trackVideoLoad(startTime, endTime);
    }

    return loadTime;
  } catch (error) {
    console.warn(`Failed to load ${type}:`, url, error);
    return -1;
  }
};
