"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { gsap } from "gsap";
import { useGSAPContext } from "@/providers/GSAPProvider";
import {
  UseGSAPReturn,
  TimelineConfig,
  AnimationCleanup,
  UseAnimationConfig,
} from "@/types/gsap";

// Custom hook for GSAP animations with SSR safety and cleanup management
export function useGSAP(
  animationFn?: (context: {
    timeline: any;
    gsap: typeof gsap;
  }) => void | AnimationCleanup,
  config?: UseAnimationConfig,
  dependencies: unknown[] = []
): UseGSAPReturn {
  const { isLoaded, registerAnimation, unregisterAnimation, createTimeline } =
    useGSAPContext();
  const timelineRef = useRef<any>(null);
  const cleanupRef = useRef<AnimationCleanup | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  // Initialize animation
  const initializeAnimation = useCallback(() => {
    if (!isLoaded || !animationFn) return;

    // Clean up previous animation
    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }

    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current = null;
    }

    try {
      // Create new timeline
      const timeline = createTimeline({
        paused: config?.paused ?? config?.autoPlay === false,
        reversed: config?.reversed ?? false,
        onComplete: () => {
          setIsPlaying(false);
          config?.onComplete?.();
        },
        onStart: () => {
          setIsPlaying(true);
          config?.onStart?.();
        },
        onUpdate: function (this: any) {
          const currentProgress = this.progress();
          setProgress(currentProgress);
          config?.onUpdate?.(currentProgress);
        },
      });

      if (!timeline) return;

      timelineRef.current = timeline;

      // Execute animation function
      const cleanup = animationFn({ timeline, gsap });

      // Store cleanup function if returned
      if (typeof cleanup === "function") {
        cleanupRef.current = cleanup;
        registerAnimation(cleanup);
      }

      // Auto-play if enabled
      if (config?.autoPlay !== false && !config?.paused) {
        timeline.play();
      }
    } catch (error) {
      console.error("Error initializing GSAP animation:", error);
    }
  }, [isLoaded, animationFn, createTimeline, registerAnimation, config]);

  // Initialize animation when dependencies change
  useEffect(() => {
    initializeAnimation();

    // Cleanup on unmount or dependency change
    return () => {
      if (cleanupRef.current) {
        unregisterAnimation(cleanupRef.current);
        cleanupRef.current();
        cleanupRef.current = null;
      }

      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }
    };
  }, [initializeAnimation, unregisterAnimation, ...dependencies]);

  // Animation control methods
  const play = useCallback(() => {
    if (timelineRef.current) {
      timelineRef.current.play();
      setIsPlaying(true);
    }
  }, []);

  const pause = useCallback(() => {
    if (timelineRef.current) {
      timelineRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const reverse = useCallback(() => {
    if (timelineRef.current) {
      timelineRef.current.reverse();
    }
  }, []);

  const restart = useCallback(() => {
    if (timelineRef.current) {
      timelineRef.current.restart();
      setIsPlaying(true);
    }
  }, []);

  const seek = useCallback((time: number) => {
    if (timelineRef.current) {
      timelineRef.current.seek(time);
      setProgress(timelineRef.current.progress());
    }
  }, []);

  const kill = useCallback(() => {
    if (cleanupRef.current) {
      unregisterAnimation(cleanupRef.current);
      cleanupRef.current();
      cleanupRef.current = null;
    }

    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current = null;
    }

    setIsPlaying(false);
    setProgress(0);
  }, [unregisterAnimation]);

  return {
    timeline: timelineRef.current,
    isPlaying,
    progress,
    play,
    pause,
    reverse,
    restart,
    seek,
    kill,
  };
}

// Hook for simple GSAP animations without timeline
export function useGSAPAnimation(
  target: string | Element | null,
  animation: any,
  trigger?: "immediate" | "hover" | "scroll",
  dependencies: unknown[] = []
) {
  const { isLoaded, registerAnimation, unregisterAnimation } = useGSAPContext();
  const tweenRef = useRef<any>(null);
  const cleanupRef = useRef<AnimationCleanup | null>(null);

  useEffect(() => {
    if (!isLoaded || !target || !animation) return;

    // Clean up previous animation
    if (cleanupRef.current) {
      cleanupRef.current();
    }

    const cleanup = () => {
      if (tweenRef.current) {
        tweenRef.current.kill();
        tweenRef.current = null;
      }
    };

    cleanupRef.current = cleanup;
    registerAnimation(cleanup);

    // Create animation based on trigger
    if (trigger === "immediate" || !trigger) {
      tweenRef.current = gsap.to(target, animation);
    } else if (trigger === "hover") {
      const element =
        typeof target === "string" ? document.querySelector(target) : target;
      if (element) {
        const handleMouseEnter = () => {
          tweenRef.current = gsap.to(element, animation);
        };

        const handleMouseLeave = () => {
          if (tweenRef.current) {
            tweenRef.current.reverse();
          }
        };

        element.addEventListener("mouseenter", handleMouseEnter);
        element.addEventListener("mouseleave", handleMouseLeave);

        // Update cleanup to remove event listeners
        cleanupRef.current = () => {
          element.removeEventListener("mouseenter", handleMouseEnter);
          element.removeEventListener("mouseleave", handleMouseLeave);
          cleanup();
        };
      }
    }

    return () => {
      if (cleanupRef.current) {
        unregisterAnimation(cleanupRef.current);
        cleanupRef.current();
      }
    };
  }, [
    isLoaded,
    target,
    animation,
    trigger,
    registerAnimation,
    unregisterAnimation,
    ...dependencies,
  ]);

  return tweenRef.current;
}

// Hook for ScrollTrigger animations with SSR safety
export function useScrollTrigger(
  animationFn: (context: {
    gsap: typeof gsap;
    ScrollTrigger: any;
  }) => AnimationCleanup | void,
  dependencies: unknown[] = []
) {
  const { isLoaded } = useGSAPContext();
  const cleanupRef = useRef<AnimationCleanup | null>(null);

  useEffect(() => {
    if (!isLoaded || typeof window === "undefined") return;

    // Ensure ScrollTrigger is available
    if (!window.ScrollTrigger) {
      console.warn(
        "ScrollTrigger not available. Make sure it's enabled in GSAPProvider."
      );
      return;
    }

    // Clean up previous ScrollTrigger
    if (cleanupRef.current) {
      cleanupRef.current();
    }

    try {
      const cleanup = animationFn({
        gsap,
        ScrollTrigger: window.ScrollTrigger,
      });

      if (typeof cleanup === "function") {
        cleanupRef.current = cleanup;
      } else {
        // Default cleanup - kill all ScrollTriggers for this component
        cleanupRef.current = () => {
          window.ScrollTrigger?.getAll()?.forEach((trigger: any) => {
            trigger.kill();
          });
        };
      }
    } catch (error) {
      console.error("Error creating ScrollTrigger animation:", error);
    }

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, [isLoaded, animationFn, ...dependencies]);
}

// Hook for timeline-based animations with better control
export function useTimeline(
  config?: TimelineConfig,
  dependencies: unknown[] = []
) {
  const { isLoaded, createTimeline, registerAnimation, unregisterAnimation } =
    useGSAPContext();
  const timelineRef = useRef<any>(null);
  const cleanupRef = useRef<AnimationCleanup | null>(null);

  useEffect(() => {
    if (!isLoaded) return;

    // Clean up previous timeline
    if (cleanupRef.current) {
      unregisterAnimation(cleanupRef.current);
      cleanupRef.current();
    }

    // Create new timeline
    const timeline = createTimeline(config);
    timelineRef.current = timeline;

    // Create cleanup function
    const cleanup = () => {
      if (timeline) {
        timeline.kill();
      }
      timelineRef.current = null;
    };

    cleanupRef.current = cleanup;
    registerAnimation(cleanup);

    return () => {
      if (cleanupRef.current) {
        unregisterAnimation(cleanupRef.current);
        cleanupRef.current();
      }
    };
  }, [
    isLoaded,
    createTimeline,
    registerAnimation,
    unregisterAnimation,
    config,
    ...dependencies,
  ]);

  return timelineRef.current;
}

// Hook for responsive animations
export function useResponsiveGSAP(
  animations: {
    mobile?: (context: {
      timeline: any;
      gsap: typeof gsap;
    }) => void | AnimationCleanup;
    tablet?: (context: {
      timeline: any;
      gsap: typeof gsap;
    }) => void | AnimationCleanup;
    desktop?: (context: {
      timeline: any;
      gsap: typeof gsap;
    }) => void | AnimationCleanup;
  },
  dependencies: unknown[] = []
) {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<
    "mobile" | "tablet" | "desktop"
  >("desktop");

  // Detect current breakpoint
  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setCurrentBreakpoint("mobile");
      } else if (width < 1024) {
        setCurrentBreakpoint("tablet");
      } else {
        setCurrentBreakpoint("desktop");
      }
    };

    updateBreakpoint();
    window.addEventListener("resize", updateBreakpoint);

    return () => {
      window.removeEventListener("resize", updateBreakpoint);
    };
  }, []);

  // Use the appropriate animation for current breakpoint
  const currentAnimation = animations[currentBreakpoint];

  return useGSAP(currentAnimation, { autoPlay: true }, [
    currentBreakpoint,
    ...dependencies,
  ]);
}
