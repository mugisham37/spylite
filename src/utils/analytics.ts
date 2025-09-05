/**
 * Analytics and tracking utilities for production monitoring
 */

// Google Analytics 4 Configuration
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// Google Tag Manager Configuration
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

// Check if analytics should be enabled
export const isAnalyticsEnabled = () => {
  return (
    process.env.NODE_ENV === "production" &&
    process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true" &&
    (GA_MEASUREMENT_ID || GTM_ID)
  );
};

// Google Analytics 4 Events
export interface GAEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

// Track page views
export const trackPageView = (url: string) => {
  if (!isAnalyticsEnabled() || typeof window === "undefined") return;

  if (window.gtag) {
    window.gtag("config", GA_MEASUREMENT_ID!, {
      page_path: url,
    });
  }
};

// Track custom events
export const trackEvent = ({ action, category, label, value }: GAEvent) => {
  if (!isAnalyticsEnabled() || typeof window === "undefined") return;

  if (window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track GSAP animation performance
export const trackAnimationPerformance = (
  animationName: string,
  duration: number
) => {
  trackEvent({
    action: "animation_performance",
    category: "GSAP",
    label: animationName,
    value: Math.round(duration),
  });
};

// Track scroll depth
export const trackScrollDepth = (depth: number) => {
  trackEvent({
    action: "scroll_depth",
    category: "Engagement",
    label: `${depth}%`,
    value: depth,
  });
};

// Track video interactions
export const trackVideoEvent = (
  action: "play" | "pause" | "ended",
  videoId: string
) => {
  trackEvent({
    action: `video_${action}`,
    category: "Video",
    label: videoId,
  });
};

// Track Core Web Vitals
export const trackWebVitals = (metric: any) => {
  if (!isAnalyticsEnabled()) return;

  trackEvent({
    action: metric.name,
    category: "Web Vitals",
    label: metric.id,
    value: Math.round(
      metric.name === "CLS" ? metric.value * 1000 : metric.value
    ),
  });
};

// Track errors
export const trackError = (error: Error, errorInfo?: any) => {
  if (!isAnalyticsEnabled()) return;

  trackEvent({
    action: "javascript_error",
    category: "Error",
    label: `${error.name}: ${error.message}`,
  });

  // Send to error monitoring service if configured
  if (typeof window !== "undefined" && window.Sentry) {
    window.Sentry.captureException(error, {
      extra: errorInfo,
    });
  }
};

// Performance monitoring
export const trackPerformanceMetric = (name: string, value: number) => {
  if (!isAnalyticsEnabled()) return;

  trackEvent({
    action: "performance_metric",
    category: "Performance",
    label: name,
    value: Math.round(value),
  });
};

// Track user interactions
export const trackUserInteraction = (element: string, action: string) => {
  trackEvent({
    action: "user_interaction",
    category: "UI",
    label: `${element}_${action}`,
  });
};

// Initialize analytics
export const initializeAnalytics = () => {
  if (!isAnalyticsEnabled() || typeof window === "undefined") return;

  // Initialize scroll depth tracking
  let maxScrollDepth = 0;
  const trackScrollDepthThrottled = throttle(() => {
    const scrollDepth = Math.round(
      (window.scrollY /
        (document.documentElement.scrollHeight - window.innerHeight)) *
        100
    );

    if (scrollDepth > maxScrollDepth && scrollDepth % 25 === 0) {
      maxScrollDepth = scrollDepth;
      trackScrollDepth(scrollDepth);
    }
  }, 1000);

  window.addEventListener("scroll", trackScrollDepthThrottled, {
    passive: true,
  });

  // Track page load performance
  if ("performance" in window) {
    window.addEventListener("load", () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType(
          "navigation"
        )[0] as PerformanceNavigationTiming;
        if (navigation) {
          trackPerformanceMetric(
            "page_load_time",
            navigation.loadEventEnd - navigation.fetchStart
          );
          trackPerformanceMetric(
            "dom_content_loaded",
            navigation.domContentLoadedEventEnd - navigation.fetchStart
          );
        }
      }, 0);
    });
  }
};

// Utility function for throttling
function throttle(func: Function, limit: number) {
  let inThrottle: boolean;
  return function (this: any, ...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Note: Global types are declared in src/types/global.d.ts
