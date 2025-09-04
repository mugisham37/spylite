/**
 * Core Web Vitals monitoring and optimization utilities
 */

import { onCLS, onINP, onFCP, onLCP, onTTFB } from "web-vitals";
import type { Metric } from "web-vitals";

// Web Vitals thresholds (good, needs improvement, poor)
export const WEB_VITALS_THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  INP: { good: 200, poor: 500 },
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  TTFB: { good: 800, poor: 1800 },
} as const;

export type WebVitalName = keyof typeof WEB_VITALS_THRESHOLDS;

export interface WebVitalReport {
  name: WebVitalName;
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  delta: number;
  id: string;
  timestamp: number;
}

// Rate a metric based on thresholds
export const rateMetric = (
  name: WebVitalName,
  value: number
): WebVitalReport["rating"] => {
  const thresholds = WEB_VITALS_THRESHOLDS[name];
  if (value <= thresholds.good) return "good";
  if (value <= thresholds.poor) return "needs-improvement";
  return "poor";
};

// Convert web-vitals Metric to our WebVitalReport
const createReport = (metric: Metric): WebVitalReport => ({
  name: metric.name as WebVitalName,
  value: metric.value,
  rating: rateMetric(metric.name as WebVitalName, metric.value),
  delta: metric.delta,
  id: metric.id,
  timestamp: Date.now(),
});

// Analytics reporting function
const sendToAnalytics = (report: WebVitalReport) => {
  // In a real app, you'd send this to your analytics service
  console.log("Web Vital Report:", report);

  // Example: Send to Google Analytics 4
  if (typeof window !== "undefined" && "gtag" in window) {
    const gtag = (window as Window & { gtag?: (...args: unknown[]) => void })
      .gtag;
    gtag("event", report.name, {
      event_category: "Web Vitals",
      event_label: report.id,
      value: Math.round(report.value),
      custom_map: {
        metric_rating: report.rating,
        metric_delta: report.delta,
      },
    });
  }

  // Store in localStorage for debugging
  if (typeof localStorage !== "undefined") {
    const existingReports = JSON.parse(
      localStorage.getItem("webVitalsReports") || "[]"
    );
    existingReports.push(report);
    localStorage.setItem(
      "webVitalsReports",
      JSON.stringify(existingReports.slice(-50))
    ); // Keep last 50 reports
  }
};

// Initialize Web Vitals monitoring
export const initWebVitalsMonitoring = () => {
  if (typeof window === "undefined") return;

  // Monitor all Core Web Vitals
  onLCP((metric) => sendToAnalytics(createReport(metric)));
  onINP((metric) => sendToAnalytics(createReport(metric)));
  onCLS((metric) => sendToAnalytics(createReport(metric)));
  onFCP((metric) => sendToAnalytics(createReport(metric)));
  onTTFB((metric) => sendToAnalytics(createReport(metric)));
};

// Get current Web Vitals snapshot
export const getWebVitalsSnapshot = async (): Promise<WebVitalReport[]> => {
  if (typeof window === "undefined") return [];

  const reports: WebVitalReport[] = [];

  try {
    // Web Vitals v3+ uses callback-based approach only
    // We'll collect metrics as they become available
    const metricsPromises: Promise<Metric>[] = [];

    metricsPromises.push(
      new Promise<Metric>((resolve) =>
        onLCP(resolve, { reportAllChanges: true })
      )
    );
    metricsPromises.push(
      new Promise<Metric>((resolve) =>
        onINP(resolve, { reportAllChanges: true })
      )
    );
    metricsPromises.push(
      new Promise<Metric>((resolve) =>
        onCLS(resolve, { reportAllChanges: true })
      )
    );
    metricsPromises.push(
      new Promise<Metric>((resolve) =>
        onFCP(resolve, { reportAllChanges: true })
      )
    );
    metricsPromises.push(
      new Promise<Metric>((resolve) =>
        onTTFB(resolve, { reportAllChanges: true })
      )
    );

    const results = await Promise.allSettled(metricsPromises);

    results.forEach((result) => {
      if (result.status === "fulfilled") {
        reports.push(createReport(result.value));
      }
    });
  } catch (error) {
    console.error("Error getting Web Vitals snapshot:", error);
  }

  return reports;
};

// Performance optimization utilities
export const optimizeForWebVitals = () => {
  if (typeof window === "undefined") return;

  // Optimize LCP by preloading critical resources
  const optimizeLCP = () => {
    // Preload hero image
    const heroImage = document.querySelector(
      'img[data-priority="true"]'
    ) as HTMLImageElement;
    if (heroImage && !heroImage.complete) {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = heroImage.src;
      document.head.appendChild(link);
    }

    // Preload critical fonts
    const criticalFonts = ["/fonts/ProximaNova-Regular.otf"];

    criticalFonts.forEach((fontUrl) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "font";
      link.type = "font/otf";
      link.crossOrigin = "anonymous";
      link.href = fontUrl;
      document.head.appendChild(link);
    });
  };

  // Optimize CLS by setting dimensions on media elements
  const optimizeCLS = () => {
    // Ensure all images have dimensions
    const images = document.querySelectorAll("img:not([width]):not([height])");
    images.forEach((img) => {
      const element = img as HTMLImageElement;
      if (element.naturalWidth && element.naturalHeight) {
        element.width = element.naturalWidth;
        element.height = element.naturalHeight;
      }
    });

    // Add aspect ratio to video elements
    const videos = document.querySelectorAll(
      'video:not([style*="aspect-ratio"])'
    );
    videos.forEach((video) => {
      const element = video as HTMLVideoElement;
      if (element.videoWidth && element.videoHeight) {
        const aspectRatio = element.videoWidth / element.videoHeight;
        element.style.aspectRatio = aspectRatio.toString();
      }
    });
  };

  // Optimize FID by deferring non-critical JavaScript
  const optimizeFID = () => {
    // Defer non-critical animations
    const deferredAnimations = document.querySelectorAll("[data-gsap-defer]");
    deferredAnimations.forEach((element) => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Trigger animation initialization
              element.dispatchEvent(new CustomEvent("gsap:init"));
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );
      observer.observe(element);
    });
  };

  // Run optimizations
  optimizeLCP();
  optimizeCLS();
  optimizeFID();

  // Re-run CLS optimization after dynamic content loads
  const observer = new MutationObserver(() => {
    optimizeCLS();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Cleanup observer after 10 seconds
  setTimeout(() => observer.disconnect(), 10000);
};

// Performance budget monitoring
export const monitorPerformanceBudget = () => {
  if (typeof window === "undefined") return;

  const budget = {
    maxLCP: 2500,
    maxINP: 200,
    maxCLS: 0.1,
    maxBundleSize: 500 * 1024, // 500KB
    maxImageSize: 200 * 1024, // 200KB per image
  };

  // Monitor bundle size
  if ("performance" in window && "getEntriesByType" in performance) {
    const resources = performance.getEntriesByType(
      "resource"
    ) as PerformanceResourceTiming[];

    let totalJSSize = 0;
    resources.forEach((resource) => {
      if (resource.name.includes(".js")) {
        totalJSSize += resource.transferSize || 0;
      }
      if (resource.name.match(/\.(jpg|jpeg|png|webp|avif)$/)) {
        // Check individual image size
        if ((resource.transferSize || 0) > budget.maxImageSize) {
          console.warn(
            `Large image detected: ${resource.name} (${Math.round(
              (resource.transferSize || 0) / 1024
            )}KB)`
          );
        }
      }
    });

    if (totalJSSize > budget.maxBundleSize) {
      console.warn(
        `Bundle size exceeds budget: ${Math.round(
          totalJSSize / 1024
        )}KB > ${Math.round(budget.maxBundleSize / 1024)}KB`
      );
    }
  }

  // Monitor Web Vitals against budget
  onLCP((metric) => {
    if (metric.value > budget.maxLCP) {
      console.warn(
        `LCP exceeds budget: ${metric.value}ms > ${budget.maxLCP}ms`
      );
    }
  });

  onINP((metric) => {
    if (metric.value > budget.maxINP) {
      console.warn(
        `INP exceeds budget: ${metric.value}ms > ${budget.maxINP}ms`
      );
    }
  });

  onCLS((metric) => {
    if (metric.value > budget.maxCLS) {
      console.warn(`CLS exceeds budget: ${metric.value} > ${budget.maxCLS}`);
    }
  });
};

// Export utility to get stored reports for debugging
export const getStoredWebVitalsReports = (): WebVitalReport[] => {
  if (typeof localStorage === "undefined") return [];

  try {
    return JSON.parse(localStorage.getItem("webVitalsReports") || "[]");
  } catch {
    return [];
  }
};
