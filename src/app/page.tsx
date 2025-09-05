"use client";

import { useEffect, useRef, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { SectionSkeleton } from "@/components/LoadingStates";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useGSAPContext } from "@/providers/GSAPProvider";
import {
  performanceUtils,
  usePerformanceMonitor,
} from "@/utils/performance-monitor";
import {
  killAllScrollTriggers,
  refreshAllScrollTriggers,
} from "@/utils/gsap-utils";
import NavBar from "@/components/NavBar";

// Dynamic imports for optimal code splitting and performance
// Hero section loads immediately as it's above the fold
const HeroSection = dynamic(() => import("@/sections/HeroSection"), {
  ssr: false,
  loading: () => <SectionSkeleton showTitle={false} />,
});

// Message section loads with slight delay as it's near the fold
const MessageSection = dynamic(() => import("@/sections/MessageSection"), {
  ssr: false,
  loading: () => <SectionSkeleton showTitle={false} />,
});

// Flavor section loads when needed (below the fold)
const FlavorSection = dynamic(() => import("@/sections/FlavorSection"), {
  ssr: false,
  loading: () => <SectionSkeleton showTitle={false} />,
});

// Nutrition section loads with progressive delay
const NutritionSection = dynamic(() => import("@/sections/NutritionSection"), {
  ssr: false,
  loading: () => <SectionSkeleton showTitle={false} />,
});

// Benefit section loads when scrolled to
const BenefitSection = dynamic(() => import("@/sections/BenefitSection"), {
  ssr: false,
  loading: () => <SectionSkeleton showTitle={false} />,
});

// Testimonial section loads with benefit section
const TestimonialSection = dynamic(
  () => import("@/sections/TestimonialSection"),
  {
    ssr: false,
    loading: () => <SectionSkeleton showTitle={false} />,
  }
);

// Footer section loads last
const FooterSection = dynamic(() => import("@/sections/FooterSection"), {
  ssr: false,
  loading: () => <SectionSkeleton showTitle={false} />,
});

function MainPageContent() {
  const { isLoaded, registerAnimation } = useGSAPContext();
  const scrollSmootherRef = useRef<any>(null);
  const isInitializedRef = useRef(false);
  const cleanupFunctionsRef = useRef<Set<() => void>>(new Set());
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null);

  // Performance monitoring
  const { startMonitoring, stopMonitoring } = usePerformanceMonitor({
    enableFPSMonitoring: process.env.NODE_ENV === "development",
    enableMemoryMonitoring: process.env.NODE_ENV === "development",
    onMetricsUpdate: (metrics) => {
      // Log performance metrics in development
      if (
        process.env.NODE_ENV === "development" &&
        metrics.fps < 30 &&
        metrics.fps > 0
      ) {
        console.warn("Performance warning:", {
          fps: metrics.fps,
          animations: metrics.animationCount,
          memory: metrics.memoryUsage,
        });
      }
    },
  });

  // Memoize optimal settings to prevent unnecessary recalculations
  const optimalSettings = useMemo(() => {
    return performanceUtils.getOptimalAnimationSettings();
  }, []);

  // Register cleanup function for proper memory management
  const registerCleanup = useCallback(
    (cleanup: () => void) => {
      cleanupFunctionsRef.current.add(cleanup);
      registerAnimation(cleanup);
    },
    [registerAnimation]
  );

  // Initialize ScrollSmoother with proper configuration
  const initializeScrollSmoother = useCallback(() => {
    if (
      typeof window === "undefined" ||
      !window.ScrollSmoother ||
      !window.gsap ||
      isInitializedRef.current
    ) {
      return;
    }

    try {
      // Kill existing ScrollSmoother instance and cleanup
      if (scrollSmootherRef.current) {
        scrollSmootherRef.current.kill();
        scrollSmootherRef.current = null;
      }

      // Kill any existing ScrollTriggers to prevent conflicts
      killAllScrollTriggers();

      // Create ScrollSmoother instance with optimal configuration
      scrollSmootherRef.current = window.ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: optimalSettings.smooth,
        effects: optimalSettings.effects,
        smoothTouch: optimalSettings.smoothTouch,
        normalizeScroll: optimalSettings.normalizeScroll,
        ignoreMobileResize: optimalSettings.ignoreMobileResize,
        onUpdate: (self: any) => {
          // Add scroll progress tracking for CSS custom properties
          const progress = self.progress;
          document.documentElement.style.setProperty(
            "--scroll-progress",
            progress.toString()
          );

          // Dispatch custom scroll event for other components
          window.dispatchEvent(
            new CustomEvent("gsap:scroll:update", {
              detail: {
                progress,
                direction: self.direction,
                velocity: self.getVelocity(),
                scrollTop: self.scrollTop(),
              },
            })
          );
        },
        onRefresh: () => {
          // Refresh ScrollTrigger instances when ScrollSmoother refreshes
          refreshAllScrollTriggers();
        },
      });

      // Register cleanup function with proper error handling
      const cleanup = () => {
        try {
          if (scrollSmootherRef.current) {
            scrollSmootherRef.current.kill();
            scrollSmootherRef.current = null;
          }
          // Clean up CSS custom properties
          document.documentElement.style.removeProperty("--scroll-progress");
        } catch (error) {
          console.error("Error during ScrollSmoother cleanup:", error);
        }
      };

      registerCleanup(cleanup);
      isInitializedRef.current = true;

      // Start performance monitoring after initialization
      if (process.env.NODE_ENV === "development") {
        startMonitoring();
      }

      console.log(
        "ScrollSmoother initialized successfully with optimal settings:",
        optimalSettings
      );
    } catch (error) {
      console.error("Failed to initialize ScrollSmoother:", error);
      // Fallback: ensure page is still scrollable without ScrollSmoother
      document.body.style.overflow = "auto";
    }
  }, [optimalSettings, registerCleanup, startMonitoring]);

  // Handle ScrollSmoother initialization with proper timing
  useEffect(() => {
    if (!isLoaded) return;

    // Wait for DOM to be fully ready and all dynamic imports to load
    const initTimer = setTimeout(() => {
      // Ensure all sections are mounted before initializing ScrollSmoother
      const checkSectionsLoaded = () => {
        const requiredSections = [
          "#hero-section",
          "#message-section",
          "#flavor-section",
          "#nutrition-section",
          "#benefit-section",
          "#testimonial-section",
          "#footer-section",
        ];

        const allSectionsLoaded = requiredSections.every((selector) =>
          document.querySelector(selector)
        );

        if (allSectionsLoaded || document.readyState === "complete") {
          initializeScrollSmoother();
        } else {
          // Retry after a short delay if sections aren't ready
          setTimeout(checkSectionsLoaded, 50);
        }
      };

      checkSectionsLoaded();
    }, 100);

    return () => {
      clearTimeout(initTimer);
    };
  }, [isLoaded, initializeScrollSmoother]);

  // Handle window resize for ScrollSmoother refresh with improved debouncing
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = performanceUtils.debounce(() => {
      if (scrollSmootherRef.current) {
        try {
          scrollSmootherRef.current.refresh();
          refreshAllScrollTriggers();

          // Dispatch resize event for other components
          window.dispatchEvent(
            new CustomEvent("gsap:resize", {
              detail: {
                width: window.innerWidth,
                height: window.innerHeight,
              },
            })
          );
        } catch (error) {
          console.error("Error during resize refresh:", error);
        }
      }
    }, 250);

    const handleOrientationChange = () => {
      // Handle orientation changes on mobile devices
      setTimeout(() => {
        handleResize();
      }, 500); // Delay to allow for orientation change completion
    };

    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("orientationchange", handleOrientationChange, {
      passive: true,
    });

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleOrientationChange);
    };
  }, []);

  // Handle page visibility changes for performance optimization
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleVisibilityChange = () => {
      if (scrollSmootherRef.current) {
        if (document.hidden) {
          // Pause ScrollSmoother when page is hidden
          scrollSmootherRef.current.paused(true);
        } else {
          // Resume ScrollSmoother when page becomes visible
          scrollSmootherRef.current.paused(false);
          // Refresh to ensure proper state
          setTimeout(() => {
            if (scrollSmootherRef.current) {
              scrollSmootherRef.current.refresh();
            }
          }, 100);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Setup intersection observer for performance optimization
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Create intersection observer for section visibility tracking
    intersectionObserverRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sectionId = entry.target.id;

          if (entry.isIntersecting) {
            // Dispatch section enter event
            window.dispatchEvent(
              new CustomEvent("section:enter", {
                detail: { sectionId, target: entry.target },
              })
            );
          } else {
            // Dispatch section leave event
            window.dispatchEvent(
              new CustomEvent("section:leave", {
                detail: { sectionId, target: entry.target },
              })
            );
          }
        });
      },
      {
        threshold: [0.1, 0.5, 0.9],
        rootMargin: "50px 0px",
      }
    );

    // Observe sections when they're mounted
    const observeSections = () => {
      const sections = document.querySelectorAll('[id$="-section"]');
      sections.forEach((section) => {
        intersectionObserverRef.current?.observe(section);
      });
    };

    // Start observing after a short delay to ensure sections are mounted
    const observeTimer = setTimeout(observeSections, 1000);

    return () => {
      clearTimeout(observeTimer);
      if (intersectionObserverRef.current) {
        intersectionObserverRef.current.disconnect();
      }
    };
  }, []);

  // Preload critical resources
  useEffect(() => {
    if (typeof window === "undefined") return;

    const preloadCriticalResources = () => {
      // Preload hero video
      const heroVideo = document.createElement("link");
      heroVideo.rel = "preload";
      heroVideo.as = "video";
      heroVideo.href = "/videos/hero-background.mp4";
      document.head.appendChild(heroVideo);

      // Preload critical images
      const criticalImages = [
        "/images/hero-mobile-fallback.jpg",
        "/images/spylt-bottle-hero.png",
      ];

      criticalImages.forEach((src) => {
        const link = document.createElement("link");
        link.rel = "preload";
        link.as = "image";
        link.href = src;
        document.head.appendChild(link);
      });
    };

    preloadCriticalResources();
  }, []);

  // Comprehensive cleanup on unmount
  useEffect(() => {
    return () => {
      isInitializedRef.current = false;

      // Stop performance monitoring
      if (process.env.NODE_ENV === "development") {
        stopMonitoring();
      }

      // Disconnect intersection observer
      if (intersectionObserverRef.current) {
        intersectionObserverRef.current.disconnect();
        intersectionObserverRef.current = null;
      }

      // Execute all registered cleanup functions
      cleanupFunctionsRef.current.forEach((cleanup) => {
        try {
          cleanup();
        } catch (error) {
          console.error("Error during cleanup:", error);
        }
      });
      cleanupFunctionsRef.current.clear();

      // Kill ScrollSmoother instance
      if (scrollSmootherRef.current) {
        try {
          scrollSmootherRef.current.kill();
          scrollSmootherRef.current = null;
        } catch (error) {
          console.error("Error killing ScrollSmoother:", error);
        }
      }

      // Kill all ScrollTriggers
      killAllScrollTriggers();

      // Clean up global GSAP animations
      if (typeof window !== "undefined" && window.gsap) {
        window.gsap.killTweensOf("*");
      }

      // Clean up CSS custom properties
      if (typeof document !== "undefined") {
        document.documentElement.style.removeProperty("--scroll-progress");
      }

      console.log("Main page cleanup completed");
    };
  }, [stopMonitoring]);

  return (
    <main className="relative">
      <NavBar />

      {/* Main content sections with proper structure for ScrollSmoother */}
      <div className="relative">
        <section id="hero-section" className="relative">
          <ErrorBoundary
            onError={(error) => console.error("HeroSection error:", error)}
            fallback={<SectionSkeleton showTitle={false} />}
          >
            <HeroSection />
          </ErrorBoundary>
        </section>

        <section id="message-section" className="relative">
          <ErrorBoundary
            onError={(error) => console.error("MessageSection error:", error)}
            fallback={<SectionSkeleton showTitle={false} />}
          >
            <MessageSection />
          </ErrorBoundary>
        </section>

        <section id="flavor-section" className="relative">
          <ErrorBoundary
            onError={(error) => console.error("FlavorSection error:", error)}
            fallback={<SectionSkeleton showTitle={false} />}
          >
            <FlavorSection />
          </ErrorBoundary>
        </section>

        <section id="nutrition-section" className="relative">
          <ErrorBoundary
            onError={(error) => console.error("NutritionSection error:", error)}
            fallback={<SectionSkeleton showTitle={false} />}
          >
            <NutritionSection />
          </ErrorBoundary>
        </section>

        {/* Group benefit and testimonial sections for better performance */}
        <div className="relative">
          <section id="benefit-section" className="relative">
            <ErrorBoundary
              onError={(error) => console.error("BenefitSection error:", error)}
              fallback={<SectionSkeleton showTitle={false} />}
            >
              <BenefitSection />
            </ErrorBoundary>
          </section>

          <section id="testimonial-section" className="relative">
            <ErrorBoundary
              onError={(error) =>
                console.error("TestimonialSection error:", error)
              }
              fallback={<SectionSkeleton showTitle={false} />}
            >
              <TestimonialSection />
            </ErrorBoundary>
          </section>
        </div>

        <section id="footer-section" className="relative">
          <ErrorBoundary
            onError={(error) => console.error("FooterSection error:", error)}
            fallback={<SectionSkeleton showTitle={false} />}
          >
            <FooterSection />
          </ErrorBoundary>
        </section>
      </div>
    </main>
  );
}

export default function HomePage() {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error("HomePage error:", error, errorInfo);

        // Optional: Send error to monitoring service
        if (typeof window !== "undefined" && window.gtag) {
          window.gtag("event", "exception", {
            description: error.message,
            fatal: false,
          });
        }
      }}
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-milk">
          <div className="text-center space-y-4 p-8">
            <h1 className="text-4xl font-antonio font-bold text-dark-brown">
              Unable to Load SPYLT
            </h1>
            <p className="text-dark-brown/70 font-paragraph max-w-md">
              We're experiencing technical difficulties. Please refresh the page
              to try again.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-mid-brown hover:bg-light-brown text-white font-antonio font-semibold rounded-full transition-colors"
              >
                Refresh Page
              </button>
              <button
                onClick={() => window.history.back()}
                className="px-6 py-3 border-2 border-mid-brown text-mid-brown hover:bg-mid-brown hover:text-white font-antonio font-semibold rounded-full transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      }
    >
      <MainPageContent />
    </ErrorBoundary>
  );
}
