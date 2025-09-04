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
          const ScrollSmootherModule = await import("gsap/ScrollSmoother");
          const ScrollSmoother =
            ScrollSmootherModule.default || ScrollSmootherModule;
          gsap.registerPlugin(ScrollSmoother);
          window.ScrollSmoother = ScrollSmoother;
        }

        // Load SplitText if enabled (premium plugin)
        if (enableSplitText) {
          try {
            const SplitTextModule = await import("gsap/SplitText");
            const SplitText = SplitTextModule.default || SplitTextModule;
            gsap.registerPlugin(SplitText);
            window.SplitText = SplitText;
          } catch {
            console.warn(
              "SplitText plugin not available. Make sure you have a valid GSAP license."
            );
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
