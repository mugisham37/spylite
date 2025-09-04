"use client";

import { gsap } from "gsap";
import {
  TimelineConfig,
  ScrollTriggerConfig,
  AnimationStep,
  SectionAnimationConfig,
  TextAnimationConfig,
  ParallaxConfig,
  HorizontalScrollConfig,
  AnimationCleanup,
} from "@/types/gsap";
import {
  ANIMATION_DURATIONS,
  ANIMATION_EASINGS,
  AnimationPreset,
  StaggerConfig,
} from "@/types/animations";

// Animation presets for common animations
export const ANIMATION_PRESETS: Record<AnimationPreset, any> = {
  fadeInUp: { opacity: 0, y: 50 },
  fadeInDown: { opacity: 0, y: -50 },
  fadeInLeft: { opacity: 0, x: -50 },
  fadeInRight: { opacity: 0, x: 50 },
  slideInUp: { y: "100%" },
  slideInDown: { y: "-100%" },
  slideInLeft: { x: "-100%" },
  slideInRight: { x: "100%" },
  scaleIn: { opacity: 0, scale: 0.8 },
  scaleOut: { opacity: 1, scale: 1.2 },
  rotateIn: { opacity: 0, rotation: -180, scale: 0.8 },
  rotateOut: { opacity: 1, rotation: 180, scale: 1.2 },
  bounceIn: { opacity: 0, scale: 0.3, ease: "bounce.out" },
  bounceOut: { opacity: 1, scale: 1.3, ease: "bounce.out" },
  elasticIn: { opacity: 0, scale: 0.3, ease: "elastic.out(1, 0.3)" },
  elasticOut: { opacity: 1, scale: 1.3, ease: "elastic.out(1, 0.3)" },
  backIn: { opacity: 0, scale: 0.7, ease: "back.out(1.7)" },
  backOut: { opacity: 1, scale: 1.3, ease: "back.out(1.7)" },
};

// Create a timeline with configuration
export function createTimeline(config: TimelineConfig = {}): any {
  if (typeof window === "undefined" || !window.gsap) {
    console.warn("GSAP not available on server side");
    return null;
  }

  const timelineConfig: any = {
    delay: config.delay || 0,
    ease: config.ease || ANIMATION_EASINGS.easeOut,
    repeat: config.repeat || 0,
    repeatDelay: config.repeatDelay || 0,
    yoyo: config.yoyo || false,
    paused: config.paused || false,
    reversed: config.reversed || false,
  };

  if (config.duration !== undefined) timelineConfig.duration = config.duration;
  if (config.onComplete) timelineConfig.onComplete = config.onComplete;
  if (config.onStart) timelineConfig.onStart = config.onStart;
  if (config.onUpdate) timelineConfig.onUpdate = config.onUpdate;
  if (config.onRepeat) timelineConfig.onRepeat = config.onRepeat;
  if (config.onReverseComplete)
    timelineConfig.onReverseComplete = config.onReverseComplete;

  return gsap.timeline(timelineConfig);
}

// Create a timeline from animation steps
export function createTimelineFromSteps(
  steps: AnimationStep[],
  config: TimelineConfig = {}
): any {
  const timeline = createTimeline(config);
  if (!timeline) return null;

  steps.forEach((step) => {
    timeline.to(
      step.target,
      {
        ...step.properties,
        duration: step.duration || ANIMATION_DURATIONS.normal,
        ease: step.ease || ANIMATION_EASINGS.easeOut,
      },
      step.position
    );
  });

  return timeline;
}

// Create ScrollTrigger animation
export function createScrollTrigger(
  config: ScrollTriggerConfig,
  animationFn?: (progress: number) => void
): AnimationCleanup {
  if (typeof window === "undefined" || !window.ScrollTrigger) {
    console.warn("ScrollTrigger not available");
    return () => {};
  }

  const scrollTriggerConfig: any = {
    trigger: config.trigger,
    start: config.start || "top 80%",
    end: config.end || "bottom 20%",
    scrub: config.scrub || false,
    pin: config.pin || false,
    pinSpacing: config.pinSpacing !== false,
    markers: config.markers || false,
    refreshPriority: config.refreshPriority || 0,
    anticipatePin: config.anticipatePin || 0,
    onUpdate: (self: any) => {
      config.onUpdate?.(self);
      animationFn?.(self.progress);
    },
  };

  if (config.snap !== undefined) scrollTriggerConfig.snap = config.snap;
  if (config.id) scrollTriggerConfig.id = config.id;
  if (config.fastScrollEnd !== undefined)
    scrollTriggerConfig.fastScrollEnd = config.fastScrollEnd;
  if (config.preventOverlaps !== undefined)
    scrollTriggerConfig.preventOverlaps = config.preventOverlaps;
  if (config.invalidateOnRefresh !== undefined)
    scrollTriggerConfig.invalidateOnRefresh = config.invalidateOnRefresh;
  if (config.onEnter) scrollTriggerConfig.onEnter = config.onEnter;
  if (config.onLeave) scrollTriggerConfig.onLeave = config.onLeave;
  if (config.onEnterBack) scrollTriggerConfig.onEnterBack = config.onEnterBack;
  if (config.onLeaveBack) scrollTriggerConfig.onLeaveBack = config.onLeaveBack;
  if (config.onToggle) scrollTriggerConfig.onToggle = config.onToggle;
  if (config.onRefresh) scrollTriggerConfig.onRefresh = config.onRefresh;
  if (config.onScrubComplete)
    scrollTriggerConfig.onScrubComplete = config.onScrubComplete;

  const scrollTrigger = window.ScrollTrigger.create(scrollTriggerConfig);

  return () => {
    scrollTrigger.kill();
  };
}

// Create section animation with ScrollTrigger
export function createSectionAnimation(
  config: SectionAnimationConfig
): AnimationCleanup {
  if (typeof window === "undefined" || !window.ScrollTrigger || !window.gsap) {
    return () => {};
  }

  const scrollTriggerConfig: any = {
    trigger: config.trigger,
    start: config.start,
    end: config.end,
    scrub: config.scrub || false,
    pin: config.pin || false,
    pinSpacing: config.pinSpacing !== false,
    markers: config.markers || false,
  };

  if (config.snap !== undefined) scrollTriggerConfig.snap = config.snap;
  if (config.onEnter) scrollTriggerConfig.onEnter = config.onEnter;
  if (config.onLeave) scrollTriggerConfig.onLeave = config.onLeave;
  if (config.onEnterBack) scrollTriggerConfig.onEnterBack = config.onEnterBack;
  if (config.onLeaveBack) scrollTriggerConfig.onLeaveBack = config.onLeaveBack;
  if (config.onComplete) scrollTriggerConfig.onComplete = config.onComplete;

  const timeline = gsap.timeline({
    scrollTrigger: scrollTriggerConfig,
  });

  return () => {
    timeline.kill();
    config.onCleanup?.();
  };
}

// Create text reveal animation
export function createTextReveal(
  target: string | Element,
  config: TextAnimationConfig
): AnimationCleanup {
  if (typeof window === "undefined" || !window.gsap) {
    return () => {};
  }

  let splitText: any = null;
  let timeline: any = null;

  // Check if SplitText is available
  if (window.SplitText) {
    splitText = new window.SplitText(target, {
      type: config.splitType,
      linesClass: "split-line",
      wordsClass: "split-word",
      charsClass: "split-char",
    });

    const elements = splitText[config.splitType] || [];

    const timelineConfig: any = {};
    if (config.scrollTrigger) {
      timelineConfig.scrollTrigger = config.scrollTrigger;
    }
    timeline = gsap.timeline(timelineConfig);

    // Set initial state
    gsap.set(elements, config.from || ANIMATION_PRESETS.fadeInUp);

    // Animate to final state
    timeline.to(elements, {
      ...config.to,
      duration: config.duration || ANIMATION_DURATIONS.normal,
      ease: config.ease || ANIMATION_EASINGS.easeOut,
      stagger: config.stagger || 0.02,
      delay: config.delay || 0,
    });
  } else {
    console.warn("SplitText not available. Using fallback animation.");

    // Fallback animation without SplitText
    const fallbackTimelineConfig: any = {};
    if (config.scrollTrigger) {
      fallbackTimelineConfig.scrollTrigger = config.scrollTrigger;
    }
    timeline = gsap.timeline(fallbackTimelineConfig);

    gsap.set(target, config.from || { opacity: 0, y: 20 });
    timeline.to(target, {
      ...config.to,
      duration: config.duration || ANIMATION_DURATIONS.normal,
      ease: config.ease || ANIMATION_EASINGS.easeOut,
      delay: config.delay || 0,
    });
  }

  return () => {
    if (timeline) timeline.kill();
    if (splitText) splitText.revert();
  };
}

// Create parallax effect
export function createParallax(
  target: string | Element,
  config: ParallaxConfig
): AnimationCleanup {
  if (typeof window === "undefined" || !window.gsap || !window.ScrollTrigger) {
    return () => {};
  }

  const direction = config.direction || "vertical";
  const property = direction === "vertical" ? "yPercent" : "xPercent";
  const value = config.speed * 100;

  const scrollTrigger = window.ScrollTrigger.create({
    trigger: config.trigger,
    start: config.start || "top bottom",
    end: config.end || "bottom top",
    scrub: true,
    onUpdate: (self: any) => {
      gsap.set(target, {
        [property]: value * self.progress,
        ease: config.ease || "none",
      });
    },
  });

  return () => {
    scrollTrigger.kill();
  };
}

// Create horizontal scroll animation
export function createHorizontalScroll(
  container: string | Element,
  config: HorizontalScrollConfig
): AnimationCleanup {
  if (typeof window === "undefined" || !window.gsap || !window.ScrollTrigger) {
    return () => {};
  }

  const containerElement =
    typeof container === "string"
      ? document.querySelector(container)
      : container;

  if (!containerElement) {
    console.warn("Horizontal scroll container not found");
    return () => {};
  }

  const scrollWidth = (containerElement as HTMLElement).scrollWidth;
  const containerWidth = (containerElement as HTMLElement).offsetWidth;
  const scrollDistance = scrollWidth - containerWidth;

  const scrollTriggerConfig: any = {
    trigger: config.trigger,
    start: config.start,
    end: config.end,
    pin: config.pin,
    scrub: config.scrub,
    anticipatePin: config.anticipatePin || 1,
    invalidateOnRefresh: config.invalidateOnRefresh !== false,
  };

  if (config.snap !== undefined) {
    scrollTriggerConfig.snap = config.snap;
  }

  const timeline = gsap.timeline({
    scrollTrigger: scrollTriggerConfig,
  });

  timeline.to(containerElement, {
    x: -scrollDistance,
    ease: "none",
  });

  return () => {
    timeline.kill();
  };
}

// Create stagger animation
export function createStaggerAnimation(
  targets: string | Element[],
  animation: any,
  staggerConfig: StaggerConfig = {}
): any {
  if (typeof window === "undefined" || !window.gsap) {
    return null;
  }

  const staggerOptions: any = {
    amount: staggerConfig.amount || 0.5,
    from: staggerConfig.from || "start",
    ease: staggerConfig.ease || "power2.out",
  };

  if (staggerConfig.grid) staggerOptions.grid = staggerConfig.grid;
  if (staggerConfig.axis) staggerOptions.axis = staggerConfig.axis;

  return gsap.to(targets, {
    ...animation,
    stagger: staggerOptions,
  });
}

// Create entrance animation using preset
export function createEntranceAnimation(
  target: string | Element,
  preset: AnimationPreset,
  config: {
    duration?: number;
    delay?: number;
    ease?: string;
    stagger?: StaggerConfig;
    scrollTrigger?: ScrollTriggerConfig;
  } = {}
): AnimationCleanup {
  if (typeof window === "undefined" || !window.gsap) {
    return () => {};
  }

  const fromState = ANIMATION_PRESETS[preset];
  if (!fromState) {
    console.warn(`Animation preset "${preset}" not found`);
    return () => {};
  }

  // Set initial state
  gsap.set(target, fromState);

  // Create animation
  const animationConfig: any = {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    rotation: 0,
    duration: config.duration || ANIMATION_DURATIONS.normal,
    delay: config.delay || 0,
    ease: config.ease || fromState.ease || ANIMATION_EASINGS.easeOut,
  };

  if (config.stagger) {
    const staggerOptions: any = {
      amount: config.stagger.amount || 0.1,
      from: config.stagger.from || "start",
      ease: config.stagger.ease,
    };
    if (config.stagger.grid) staggerOptions.grid = config.stagger.grid;
    if (config.stagger.axis) staggerOptions.axis = config.stagger.axis;
    animationConfig.stagger = staggerOptions;
  }

  if (config.scrollTrigger) {
    animationConfig.scrollTrigger = config.scrollTrigger;
  }

  const animation = gsap.to(target, animationConfig);

  return () => {
    animation.kill();
  };
}

// Create hover animation
export function createHoverAnimation(
  target: string | Element,
  enterAnimation: any,
  leaveAnimation: any
): AnimationCleanup {
  if (typeof window === "undefined" || !window.gsap) {
    return () => {};
  }

  const element =
    typeof target === "string" ? document.querySelector(target) : target;
  if (!element) {
    console.warn("Hover target not found");
    return () => {};
  }

  const handleMouseEnter = () => {
    gsap.to(element, {
      ...enterAnimation,
      duration: enterAnimation.duration || ANIMATION_DURATIONS.fast,
      ease: enterAnimation.ease || ANIMATION_EASINGS.easeOut,
    });
  };

  const handleMouseLeave = () => {
    gsap.to(element, {
      ...leaveAnimation,
      duration: leaveAnimation.duration || ANIMATION_DURATIONS.fast,
      ease: leaveAnimation.ease || ANIMATION_EASINGS.easeOut,
    });
  };

  element.addEventListener("mouseenter", handleMouseEnter);
  element.addEventListener("mouseleave", handleMouseLeave);

  return () => {
    element.removeEventListener("mouseenter", handleMouseEnter);
    element.removeEventListener("mouseleave", handleMouseLeave);
  };
}

// Utility to kill all ScrollTriggers
export function killAllScrollTriggers(): void {
  if (typeof window !== "undefined" && window.ScrollTrigger) {
    window.ScrollTrigger.getAll().forEach((trigger: any) => trigger.kill());
  }
}

// Utility to refresh all ScrollTriggers
export function refreshAllScrollTriggers(): void {
  if (typeof window !== "undefined" && window.ScrollTrigger) {
    window.ScrollTrigger.refresh();
  }
}

// Utility to batch ScrollTrigger operations for performance
export function batchScrollTrigger(callback: () => void): void {
  if (typeof window !== "undefined" && window.ScrollTrigger) {
    window.ScrollTrigger.batch(callback);
  } else {
    callback();
  }
}

// Create responsive animation that adapts to screen size
export function createResponsiveAnimation(
  target: string | Element,
  animations: {
    mobile?: any;
    tablet?: any;
    desktop?: any;
  }
): AnimationCleanup {
  if (typeof window === "undefined" || !window.gsap) {
    return () => {};
  }

  let currentAnimation: any = null;

  const updateAnimation = () => {
    if (currentAnimation) {
      currentAnimation.kill();
    }

    const width = window.innerWidth;
    let config: any;

    if (width < 768 && animations.mobile) {
      config = animations.mobile;
    } else if (width < 1024 && animations.tablet) {
      config = animations.tablet;
    } else if (animations.desktop) {
      config = animations.desktop;
    }

    if (config) {
      currentAnimation = gsap.to(target, config);
    }
  };

  updateAnimation();
  window.addEventListener("resize", updateAnimation);

  return () => {
    if (currentAnimation) {
      currentAnimation.kill();
    }
    window.removeEventListener("resize", updateAnimation);
  };
}

// Performance optimization utilities
export const gsapUtils = {
  // Force hardware acceleration
  force3D: (target: string | Element) => {
    gsap.set(target, { force3D: true });
  },

  // Optimize for will-change
  willChange: (target: string | Element, properties: string) => {
    const element =
      typeof target === "string" ? document.querySelector(target) : target;
    if (element && "style" in element) {
      (element as HTMLElement).style.willChange = properties;
    }
  },

  // Remove will-change optimization
  removeWillChange: (target: string | Element) => {
    const element =
      typeof target === "string" ? document.querySelector(target) : target;
    if (element && "style" in element) {
      (element as HTMLElement).style.willChange = "auto";
    }
  },

  // Get element bounds for calculations
  getBounds: (target: string | Element) => {
    const element =
      typeof target === "string" ? document.querySelector(target) : target;
    return element ? element.getBoundingClientRect() : null;
  },

  // Check if element is in viewport
  isInViewport: (target: string | Element, threshold = 0) => {
    const bounds = gsapUtils.getBounds(target);
    if (!bounds) return false;

    return (
      bounds.top >= -threshold &&
      bounds.left >= -threshold &&
      bounds.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) +
          threshold &&
      bounds.right <=
        (window.innerWidth || document.documentElement.clientWidth) + threshold
    );
  },
};
