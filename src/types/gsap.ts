// GSAP type definitions for testing
export interface GSAPConfig {
  [key: string]: unknown;
}

export interface GSAPAppConfig {
  scrollSmoother: {
    smooth: number;
    effects: boolean;
    smoothTouch: boolean;
    normalizeScroll: boolean;
    ignoreMobileResize: boolean;
  };
  scrollTrigger: {
    defaults: {
      toggleActions: string;
      markers: boolean;
      anticipatePin: number;
      fastScrollEnd: boolean;
      preventOverlaps: boolean;
      refreshPriority: number;
      invalidateOnRefresh: boolean;
      snap?: unknown;
    };
  };
  performance: {
    force3D: boolean;
    nullTargetWarn: boolean;
    autoSleep: number;
  };
  debug: {
    markers: boolean;
    verbose: boolean;
  };
}

export interface GSAPPerformanceMetrics {
  animationCount: number;
  scrollTriggerCount: number;
  averageFPS: number;
  memoryUsage: number;
  renderTime: number;
}

export interface AnimationConfig {
  duration?: number;
  delay?: number;
  ease?: string;
  repeat?: number;
  yoyo?: boolean;
  paused?: boolean;
  reversed?: boolean;
  onStart?: () => void;
  onComplete?: () => void;
  onUpdate?: () => void;
  [key: string]: unknown;
}

export interface GSAPContextReturn {
  add: (func: () => void) => void;
  revert: () => void;
  kill: () => void;
  refresh: () => void;
}

export interface ScrollTriggerConfig {
  trigger?: string | Element;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  pin?: boolean | string | Element;
  snap?: unknown;
  markers?: boolean;
  toggleActions?: string;
  onEnter?: () => void;
  onLeave?: () => void;
  onEnterBack?: () => void;
  onLeaveBack?: () => void;
  onUpdate?: (self: ScrollTrigger) => void;
  [key: string]: unknown;
}

export interface ScrollSmootherConfig {
  smooth?: number;
  effects?: boolean;
  smoothTouch?: boolean;
  normalizeScroll?: boolean;
  ignoreMobileResize?: boolean;
  [key: string]: unknown;
}

export interface AnimationState {
  isPlaying: boolean;
  isPaused: boolean;
  isReversed: boolean;
  progress: number;
  duration: number;
  currentTime: number;
}

export interface AnimationControls {
  play: () => void;
  pause: () => void;
  reverse: () => void;
  restart: () => void;
  seek: (time: number) => void;
  setProgress: (progress: number) => void;
}

export interface GSAPTimelineConfig {
  delay?: number;
  repeat?: number;
  repeatDelay?: number;
  yoyo?: boolean;
  paused?: boolean;
  reversed?: boolean;
  onStart?: () => void;
  onComplete?: () => void;
  onUpdate?: () => void;
  onRepeat?: () => void;
  onReverseComplete?: () => void;
  [key: string]: unknown;
}

export interface SplitTextConfig {
  type?: "chars" | "words" | "lines";
  charsClass?: string;
  wordsClass?: string;
  linesClass?: string;
  position?: "absolute" | "relative";
  wordDelimiter?: string;
  [key: string]: unknown;
}

export interface GSAPTweenVars {
  duration?: number;
  delay?: number;
  ease?: string;
  repeat?: number;
  yoyo?: boolean;
  paused?: boolean;
  reversed?: boolean;
  onStart?: () => void;
  onComplete?: () => void;
  onUpdate?: () => void;
  [key: string]: unknown;
}

export interface GSAPPlugins {
  ScrollTrigger?: unknown;
  ScrollSmoother?: unknown;
  SplitText?: unknown;
  [key: string]: unknown;
}

export type GSAPTarget = Element | string | object | null;

export interface GSAPInstance {
  version?: string;
  ScrollTrigger?: {
    version?: string;
    create?: (config: GSAPConfig) => GSAPScrollTrigger;
    refresh?: () => void;
  };
  ScrollSmoother?: {
    version?: string;
    create?: (config: GSAPConfig) => GSAPScrollSmoother;
    get?: () => GSAPScrollSmoother | null;
  };
  SplitText?: {
    version?: string;
  };
  timeline?: (config?: GSAPConfig) => GSAPTimeline;
  to?: (target: GSAPTarget, config: GSAPConfig) => GSAPTween;
  [key: string]: unknown;
}

export interface GSAPTimeline {
  to: (target: GSAPTarget, config: GSAPConfig) => GSAPTimeline;
  onStart?: (callback: () => void) => GSAPTimeline;
  onComplete?: (callback: () => void) => GSAPTimeline;
  onUpdate?: (callback: () => void) => GSAPTimeline;
}

export interface GSAPTween {
  duration?: number;
  progress?: number;
}

export interface GSAPScrollTrigger {
  refresh?: () => void;
}

export interface GSAPScrollSmoother {
  progress?: number;
}

declare global {
  interface Window {
    gsap?: GSAPInstance;
  }

  interface Performance {
    memory?: {
      usedJSHeapSize: number;
      totalJSHeapSize: number;
      jsHeapSizeLimit: number;
    };
  }
}
