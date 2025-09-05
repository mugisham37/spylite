"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { gsap } from "gsap";
import { GSAPContextValue, AnimationCleanup, GSAPConfig } from "@/types/gsap";

// GSAP Context
const GSAPContext = createContext<GSAPContextValue | null>(null);

// GSAP Provider Props
interface GSAPProviderProps {
  children: React.ReactNode;
  config?: GSAPConfig;
  enableScrollTrigger?: boolean;
  enableScrollSmoother?: boolean;
  enableSplitText?: boolean;
  enableTextPlugin?: boolean;
}

// Default GSAP configuration for optimal performance
const DEFAULT_GSAP_CONFIG: GSAPConfig = {
  force3D: true,
  nullTargetWarn: false,
  trialWarn: false,
  autoSleep: 60,
  units: {
    left: "%",
    top: "%",
    rotation: "deg",
  },
};

// Fallback SplitText class
class FallbackSplitText {
  public target: Element | null;
  public config: any;
  public chars: Element[];
  public words: Element[];
  public lines: Element[];

  constructor(target: any, config?: any) {
    this.target =
      typeof target === "string" ? document.querySelector(target) : target;
    this.config = config || {};
    this.chars = [];
    this.words = [];
    this.lines = [];

    if (this.target) {
      this.split();
    }
  }

  split() {
    const text = this.target?.textContent || "";
    if (this.config.type === "chars") {
      // Simple character splitting for fallback
      if (this.target) {
        this.target.innerHTML = text
          .split("")
          .map(
            (char: string) =>
              `<span style="display: inline-block;">${
                char === " " ? "&nbsp;" : char
              }</span>`
          )
          .join("");
        this.chars = Array.from(this.target.children) as Element[];
      }
    }
    if (this.config.type === "words") {
      // Simple word splitting for fallback
      if (this.target) {
        this.target.innerHTML = text
          .split(" ")
          .map(
            (word: string) =>
              `<span style="display: inline-block;">${word}</span>`
          )
          .join(" ");
        this.words = Array.from(this.target.children) as Element[];
      }
    }
  }

  revert() {
    if (this.target && this.target.textContent) {
      const originalText = this.target.textContent;
      this.target.innerHTML = originalText;
    }
  }
}

// Fallback ScrollSmoother
const createFallbackScrollSmoother = () => ({
  kill: () => {},
  refresh: () => ({} as any),
  paused: (value?: boolean) => {
    if (value !== undefined) return {} as any;
    return false;
  },
  progress: (value?: number) => {
    if (value !== undefined) return {} as any;
    return 0;
  },
  scrollTop: (value?: number) => {
    if (value !== undefined) return {} as any;
    return window.scrollY || 0;
  },
  scrollTo: () => ({} as any),
  offset: () => 0,
  normalizeScroll: () => ({} as any),
  smooth: (value?: number) => {
    if (value !== undefined) return {} as any;
    return 1;
  },
  effects: () => {},
});

export function GSAPProvider({
  children,
  config = DEFAULT_GSAP_CONFIG,
  enableScrollTrigger = true,
  enableScrollSmoother = false,
  enableSplitText = false,
  enableTextPlugin = false,
}: GSAPProviderProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const cleanupFunctions = useRef<Set<AnimationCleanup>>(new Set());
  const timelineRegistry = useRef<Map<string, any>>(new Map());

  // Register animation cleanup function
  const registerAnimation = useCallback((cleanup: AnimationCleanup) => {
    cleanupFunctions.current.add(cleanup);
  }, []);

  // Unregister animation cleanup function
  const unregisterAnimation = useCallback((cleanup: AnimationCleanup) => {
    cleanupFunctions.current.delete(cleanup);
  }, []);

  // Create timeline with automatic registration
  const createTimeline = useCallback(
    (timelineConfig?: any) => {
      if (!isLoaded) {
        console.warn("GSAP not loaded yet, timeline creation deferred");
        return null;
      }

      const timeline = gsap.timeline(timelineConfig);
      const timelineId = `timeline_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      timelineRegistry.current.set(timelineId, timeline);

      // Register cleanup for this timeline
      const cleanup = () => {
        timeline.kill();
        timelineRegistry.current.delete(timelineId);
      };

      registerAnimation(cleanup);
      return timeline;
    },
    [isLoaded, registerAnimation]
  );

  // Kill all animations
  const killAllAnimations = useCallback(() => {
    // Execute all cleanup functions
    cleanupFunctions.current.forEach((cleanup) => {
      try {
        cleanup();
      } catch (error) {
        console.error("Error during animation cleanup:", error);
      }
    });

    // Clear the cleanup registry
    cleanupFunctions.current.clear();

    // Clear timeline registry
    timelineRegistry.current.clear();

    // Kill all GSAP animations
    gsap.killTweensOf("*");
  }, []);

  // Refresh ScrollTrigger
  const refreshScrollTrigger = useCallback(() => {
    if (typeof window !== "undefined" && window.ScrollTrigger) {
      window.ScrollTrigger.refresh();
    }
  }, []);

  // Load GSAP plugins dynamically on client side
  useEffect(() => {
    if (typeof window === "undefined") return;

    const loadPlugins = async () => {
      try {
        // Configure GSAP
        gsap.config(config);

        // Load ScrollTrigger if enabled
        if (enableScrollTrigger) {
          const { ScrollTrigger } = await import("gsap/ScrollTrigger");
          gsap.registerPlugin(ScrollTrigger);

          // Configure ScrollTrigger for optimal performance
          ScrollTrigger.config({
            limitCallbacks: true,
            syncInterval: 150,
          });

          // Make ScrollTrigger available globally
          window.ScrollTrigger = ScrollTrigger;
        }

        // Load ScrollSmoother if enabled
        if (enableScrollSmoother) {
          try {
            const ScrollSmootherModule = await import("gsap/ScrollSmoother");
            const ScrollSmoother =
              ScrollSmootherModule.default || ScrollSmootherModule;
            gsap.registerPlugin(ScrollSmoother);
            window.ScrollSmoother = ScrollSmoother;
            console.log("ScrollSmoother loaded successfully");
          } catch (error) {
            console.warn("ScrollSmoother not available:", error);
            // Provide a fallback that doesn't break the app
            window.ScrollSmoother = {
              create: createFallbackScrollSmoother,
              get: () => undefined,
              refresh: () => {},
              normalizeScroll: () => {},
            } as any;
          }
        }

        // Load SplitText if enabled (premium plugin)
        if (enableSplitText) {
          try {
            const SplitTextModule = await import("gsap/SplitText");
            const SplitText = SplitTextModule.default || SplitTextModule;
            gsap.registerPlugin(SplitText);
            window.SplitText = SplitText;
          } catch (error) {
            console.warn(
              "SplitText plugin not available. Using fallback text animation. Error:",
              error
            );
            // Create a fallback SplitText-like object for basic functionality
            window.SplitText = FallbackSplitText as any;
          }
        }

        // Load TextPlugin if enabled
        if (enableTextPlugin) {
          const TextPluginModule = await import("gsap/TextPlugin");
          const TextPlugin = TextPluginModule.default || TextPluginModule;
          gsap.registerPlugin(TextPlugin);
        }

        // Make GSAP available globally
        window.gsap = gsap;

        setIsLoaded(true);
        setIsInitialized(true);

        console.log("GSAP initialized successfully with plugins:", {
          ScrollTrigger: enableScrollTrigger,
          ScrollSmoother: enableScrollSmoother,
          SplitText: enableSplitText,
          TextPlugin: enableTextPlugin,
        });
      } catch (error) {
        console.error("Failed to load GSAP plugins:", error);
        setIsLoaded(false);
        setIsInitialized(false);
      }
    };

    loadPlugins();

    // Cleanup on unmount
    return () => {
      killAllAnimations();
    };
  }, [
    config,
    enableScrollTrigger,
    enableScrollSmoother,
    enableSplitText,
    enableTextPlugin,
    killAllAnimations,
  ]);

  // Handle page visibility changes to pause/resume animations
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Pause all animations when page is hidden
        gsap.globalTimeline.pause();
      } else {
        // Resume animations when page becomes visible
        gsap.globalTimeline.resume();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Context value
  const contextValue: GSAPContextValue = {
    isLoaded,
    isInitialized,
    registerAnimation,
    unregisterAnimation,
    createTimeline,
    killAllAnimations,
    refreshScrollTrigger,
  };

  return (
    <GSAPContext.Provider value={contextValue}>{children}</GSAPContext.Provider>
  );
}

// Hook to use GSAP context
export function useGSAPContext(): GSAPContextValue {
  const context = useContext(GSAPContext);

  if (!context) {
    throw new Error("useGSAPContext must be used within a GSAPProvider");
  }

  return context;
}

// Export context for advanced usage
export { GSAPContext };
