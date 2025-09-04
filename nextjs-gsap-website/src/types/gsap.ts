// GSAP-related type definitions
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { SplitText } from "gsap/SplitText";

// GSAP Timeline configuration
export interface GSAPTimelineConfig {
  delay?: number;
  duration?: number;
  ease?: string;
  repeat?: number;
  repeatDelay?: number;
  yoyo?: boolean;
  paused?: boolean;
  reversed?: boolean;
  onComplete?: () => void;
  onStart?: () => void;
  onUpdate?: () => void;
  onRepeat?: () => void;
}

// ScrollTrigger configuration
export interface ScrollTriggerConfig {
  trigger?: string | Element;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  pin?: boolean | string | Element;
  pinSpacing?: boolean;
  snap?: boolean | number | object;
  markers?: boolean;
  toggleActions?: string;
  toggleClass?: string;
  onEnter?: () => void;
  onLeave?: () => void;
  onEnterBack?: () => void;
  onLeaveBack?: () => void;
  onUpdate?: (self: ScrollTrigger) => void;
  onToggle?: (self: ScrollTrigger) => void;
  onRefresh?: (self: ScrollTrigger) => void;
  refreshPriority?: number;
  invalidateOnRefresh?: boolean;
  anticipatePin?: number;
  fastScrollEnd?: boolean;
  preventOverlaps?: boolean | string;
}

// ScrollSmoother configuration
export interface ScrollSmootherConfig {
  smooth?: number;
  effects?: boolean;
  smoothTouch?: boolean | number;
  normalizeScroll?: boolean;
  ignoreMobileResize?: boolean;
  onUpdate?: (self: ScrollSmoother) => void;
  onRefresh?: (self: ScrollSmoother) => void;
}

// SplitText configuration
export interface SplitTextConfig {
  type?: "lines" | "words" | "chars" | string;
  linesClass?: string;
  wordsClass?: string;
  charsClass?: string;
  tag?: string;
  wordDelimiter?: string;
  reduceWhiteSpace?: boolean;
}

// GSAP Animation configuration
export interface AnimationConfig {
  timeline?: GSAPTimelineConfig;
  scrollTrigger?: ScrollTriggerConfig;
  splitText?: SplitTextConfig;
  scrollSmoother?: ScrollSmootherConfig;
}

// GSAP Tween properties
export interface GSAPTweenVars {
  x?: number | string;
  y?: number | string;
  z?: number | string;
  xPercent?: number;
  yPercent?: number;
  rotation?: number;
  rotationX?: number;
  rotationY?: number;
  rotationZ?: number;
  scale?: number;
  scaleX?: number;
  scaleY?: number;
  skewX?: number;
  skewY?: number;
  opacity?: number;
  autoAlpha?: number;
  width?: number | string;
  height?: number | string;
  left?: number | string;
  top?: number | string;
  right?: number | string;
  bottom?: number | string;
  backgroundColor?: string;
  color?: string;
  borderRadius?: number | string;
  clipPath?: string;
  filter?: string;
  transformOrigin?: string;
  duration?: number;
  delay?: number;
  ease?: string;
  stagger?: number | object;
  repeat?: number;
  repeatDelay?: number;
  yoyo?: boolean;
  onComplete?: () => void;
  onStart?: () => void;
  onUpdate?: () => void;
  scrollTrigger?: ScrollTriggerConfig;
}

// GSAP Context return type
export interface GSAPContextReturn {
  revert: () => void;
  kill: () => void;
  refresh: () => void;
}

// GSAP Plugin registration
export interface GSAPPlugins {
  ScrollTrigger: typeof ScrollTrigger;
  ScrollSmoother: typeof ScrollSmoother;
  SplitText: typeof SplitText;
}

// Animation state
export interface AnimationState {
  isPlaying: boolean;
  isPaused: boolean;
  isReversed: boolean;
  progress: number;
  duration: number;
  timeScale: number;
}

// Animation control methods
export interface AnimationControls {
  play: () => void;
  pause: () => void;
  resume: () => void;
  reverse: () => void;
  restart: () => void;
  seek: (time: number) => void;
  kill: () => void;
  invalidate: () => void;
}

// GSAP Error types
export interface GSAPError {
  type: "timeline" | "scrolltrigger" | "splittext" | "scrollsmoother" | "tween";
  message: string;
  element?: string | Element;
  config?: object;
  stack?: string;
}

// GSAP Performance metrics
export interface GSAPPerformanceMetrics {
  animationCount: number;
  scrollTriggerCount: number;
  averageFPS: number;
  memoryUsage: number;
  renderTime: number;
}

// GSAP Configuration for the application
export interface GSAPAppConfig {
  scrollSmoother: ScrollSmootherConfig;
  scrollTrigger: {
    defaults: ScrollTriggerConfig;
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

// Hook return types
export interface UseGSAPReturn {
  contextSafe: (func: () => void) => () => void;
  context: GSAPContextReturn;
  isReady: boolean;
}

export interface UseScrollTriggerReturn {
  scrollTrigger: ScrollTrigger | null;
  refresh: () => void;
  kill: () => void;
  isActive: boolean;
}

export interface UseScrollSmootherReturn {
  scrollSmoother: ScrollSmoother | null;
  scrollTo: (target: string | number | Element, smooth?: boolean) => void;
  refresh: () => void;
  kill: () => void;
  isActive: boolean;
}
