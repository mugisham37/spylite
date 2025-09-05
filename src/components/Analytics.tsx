/**
 * Analytics integration component for production monitoring
 */

"use client";

import { useEffect } from "react";
import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import {
  GA_MEASUREMENT_ID,
  GTM_ID,
  isAnalyticsEnabled,
  trackPageView,
  initializeAnalytics,
} from "@/utils/analytics";
import {
  initializeErrorMonitoring,
  monitorPerformance,
} from "@/utils/errorMonitoring";

// Google Analytics component
export function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isAnalyticsEnabled() || !GA_MEASUREMENT_ID) return;

    const url =
      pathname +
      (searchParams?.toString() ? `?${searchParams.toString()}` : "");
    trackPageView(url);
  }, [pathname, searchParams]);

  if (!isAnalyticsEnabled() || !GA_MEASUREMENT_ID) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
              anonymize_ip: true,
              allow_google_signals: false,
              allow_ad_personalization_signals: false,
            });
          `,
        }}
      />
    </>
  );
}

// Google Tag Manager component
export function GoogleTagManager() {
  if (!isAnalyticsEnabled() || !GTM_ID) {
    return null;
  }

  return (
    <>
      <Script
        id="google-tag-manager"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
          `,
        }}
      />
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
      </noscript>
    </>
  );
}

// Web Vitals tracking component
export function WebVitalsTracker() {
  useEffect(() => {
    if (!isAnalyticsEnabled()) return;

    // Dynamic import of web-vitals to avoid increasing bundle size
    import("web-vitals")
      .then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
        onCLS((metric) => {
          if (window.gtag) {
            window.gtag("event", "web_vitals", {
              event_category: "Web Vitals",
              event_label: metric.name,
              value: Math.round(metric.value * 1000),
              custom_map: { metric_id: "custom_metric_id" },
            });
          }
        });

        onINP((metric) => {
          if (window.gtag) {
            window.gtag("event", "web_vitals", {
              event_category: "Web Vitals",
              event_label: metric.name,
              value: Math.round(metric.value),
            });
          }
        });

        onFCP((metric) => {
          if (window.gtag) {
            window.gtag("event", "web_vitals", {
              event_category: "Web Vitals",
              event_label: metric.name,
              value: Math.round(metric.value),
            });
          }
        });

        onLCP((metric) => {
          if (window.gtag) {
            window.gtag("event", "web_vitals", {
              event_category: "Web Vitals",
              event_label: metric.name,
              value: Math.round(metric.value),
            });
          }
        });

        onTTFB((metric) => {
          if (window.gtag) {
            window.gtag("event", "web_vitals", {
              event_category: "Web Vitals",
              event_label: metric.name,
              value: Math.round(metric.value),
            });
          }
        });
      })
      .catch((error) => {
        console.warn("Failed to load web-vitals:", error);
      });
  }, []);

  return null;
}

// Error monitoring component
export function ErrorMonitoring() {
  useEffect(() => {
    // Initialize error monitoring
    initializeErrorMonitoring();

    // Initialize performance monitoring
    monitorPerformance();

    // Initialize analytics
    initializeAnalytics();
  }, []);

  return null;
}

// Sentry integration (optional)
export function SentryIntegration() {
  useEffect(() => {
    if (!process.env.SENTRY_DSN || process.env.NODE_ENV !== "production") {
      return;
    }

    // Dynamic import of Sentry to avoid increasing bundle size
    import("@sentry/nextjs")
      .then((Sentry) => {
        if (process.env.SENTRY_DSN) {
          Sentry.init({
            dsn: process.env.SENTRY_DSN,
            environment: process.env.NEXT_PUBLIC_APP_ENV || "production",
            tracesSampleRate: 0.1,
            debug: false,
            beforeSend(event) {
              // Filter out non-critical errors in production
              if (event.exception) {
                const error = event.exception.values?.[0];
                if (
                  error?.type === "ChunkLoadError" ||
                  error?.type === "ResizeObserver loop limit exceeded"
                ) {
                  return null;
                }
              }
              return event;
            },
          });
        }

        // Set user context if available
        const userId = localStorage.getItem("userId");
        if (userId) {
          Sentry.setUser({ id: userId });
        }

        window.Sentry = Sentry;
      })
      .catch((error) => {
        console.warn("Failed to load Sentry:", error);
      });
  }, []);

  return null;
}

// Main Analytics provider component
export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <GoogleAnalytics />
      <GoogleTagManager />
      <WebVitalsTracker />
      <ErrorMonitoring />
      <SentryIntegration />
    </>
  );
}

// Performance monitoring hook
export function usePerformanceMonitoring() {
  useEffect(() => {
    if (!isAnalyticsEnabled()) return;

    // Monitor GSAP animations performance
    const originalGSAPTo = window.gsap?.to;
    if (originalGSAPTo && window.gsap) {
      const gsapInstance = window.gsap;
      gsapInstance.to = function (...args: any[]) {
        const startTime = performance.now();
        const tween = (originalGSAPTo as any).apply(this, args);

        if (tween && typeof tween.eventCallback === "function") {
          tween.eventCallback("onComplete", () => {
            const animationDuration = performance.now() - startTime;
            if (window.gtag) {
              window.gtag("event", "gsap_animation_performance", {
                event_category: "Performance",
                event_label: "animation_duration",
                value: Math.round(animationDuration),
              });
            }
          });
        }

        return tween;
      };
    }

    // Monitor scroll performance
    let scrollStartTime = 0;
    let isScrolling = false;

    const handleScrollStart = () => {
      if (!isScrolling) {
        scrollStartTime = performance.now();
        isScrolling = true;
      }
    };

    const handleScrollEnd = () => {
      if (isScrolling) {
        const scrollDuration = performance.now() - scrollStartTime;
        if (scrollDuration > 100 && window.gtag) {
          // Only track long scrolls
          window.gtag("event", "scroll_performance", {
            event_category: "Performance",
            event_label: "scroll_duration",
            value: Math.round(scrollDuration),
          });
        }
        isScrolling = false;
      }
    };

    let scrollTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      handleScrollStart();
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleScrollEnd, 150);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);
}

// Note: Global types are declared in src/types/global.d.ts
