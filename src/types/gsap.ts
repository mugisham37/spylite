// GSAP type definitions - using any for GSAP types to avoid import issues during build
type GSAPTweenVars = any;
type GSAPTimeline = any;
type GSAPEaseFunction = any;
type ScrollTriggerInstance = any;

// GSAP Timeline configuration
export interface TimelineConfig {
  delay?: number;
  duration?: number;
  ease?: string | GSAPEaseFunction;
  repeat?: number;
  repeatDelay?: number;
  yoyo?: boolean;
  paused?: boolean;
  reversed?: boolean;
  onComplete?: () => void;
  onStart?: () => void;
  onUpdate?: () => void;
  onRepeat?: () => void;
  onReverseComplete?: () => void;
}

// Animation step definition
export interface AnimationStep {
  target: string | Element | Element[];
  properties: GSAPTweenVars;
  position?: string | number;
  duration?: number;
  ease?: string | GSAPEaseFunction;
}

// Timeline definition with steps
export interface TimelineDefinition {
  config: TimelineConfig;
  steps: AnimationStep[];
  scrollTrigger?: ScrollTriggerConfig;
}

// ScrollTrigger configuration
export interface ScrollTriggerConfig {
  trigger: string | Element;
  start?: string | number | (() => number);
  end?: string | number | (() => number);
  scrub?: boolean | number;
  pin?: boolean | string | Element;
  pinSpacing?: boolean;
  snap?:
    | boolean
    | number
    | number[]
    | {
        snapTo: number | number[] | "labels" | (() => number);
        duration?: number;
        delay?: number;
        ease?: string;
      };
  markers?: boolean;
  id?: string;
  refreshPriority?: number;
  onEnter?: (self: ScrollTriggerInstance) => void;
  onLeave?: (self: ScrollTriggerInstance) => void;
  onEnterBack?: (self: ScrollTriggerInstance) => void;
  onLeaveBack?: (self: ScrollTriggerInstance) => void;
  onUpdate?: (self: ScrollTriggerInstance) => void;
  onToggle?: (self: ScrollTriggerInstance) => void;
  onRefresh?: (self: ScrollTriggerInstance) => void;
  onScrubComplete?: (self: ScrollTriggerInstance) => void;
  anticipatePin?: number;
  fastScrollEnd?: boolean | number;
  preventOverlaps?: boolean | string;
  invalidateOnRefresh?: boolean;
}

// SplitText configuration
export interface SplitTextConfig {
  type?: "lines" | "words" | "chars" | string;
  linesClass?: string;
  wordsClass?: string;
  charsClass?: string;
  tag?: string;
  position?: "absolute" | "relative";
  wordDelimiter?: string;
  reduceWhiteSpace?: boolean;
}

// Animation presets for common animations
export interface AnimationPresets {
  fadeIn: GSAPTweenVars;
  fadeOut: GSAPTweenVars;
  slideUp: GSAPTweenVars;
  slideDown: GSAPTweenVars;
  slideLeft: GSAPTweenVars;
  slideRight: GSAPTweenVars;
  scaleIn: GSAPTweenVars;
  scaleOut: GSAPTweenVars;
  rotateIn: GSAPTweenVars;
  rotateOut: GSAPTweenVars;
}

// GSAP Context types
export interface GSAPContextValue {
  isLoaded: boolean;
  isInitialized: boolean;
  registerAnimation: (cleanup: () => void) => void;
  unregisterAnimation: (cleanup: () => void) => void;
  createTimeline: (config?: TimelineConfig) => GSAPTimeline;
  killAllAnimations: () => void;
  refreshScrollTrigger: () => void;
}

// Animation hook return type
export interface UseGSAPReturn {
  timeline: GSAPTimeline | null;
  isPlaying: boolean;
  progress: number;
  play: () => void;
  pause: () => void;
  reverse: () => void;
  restart: () => void;
  seek: (time: number) => void;
  kill: () => void;
}

// ScrollTrigger hook return type
export interface UseScrollTriggerReturn {
  scrollTrigger: ScrollTriggerInstance | null;
  progress: number;
  direction: 1 | -1;
  velocity: number;
  isActive: boolean;
  refresh: () => void;
  kill: () => void;
}

// Animation configuration for sections
export interface SectionAnimationConfig {
  trigger: string;
  start: string;
  end: string;
  scrub?: boolean | number;
  pin?: boolean;
  pinSpacing?: boolean;
  snap?: boolean | number;
  markers?: boolean;
  onEnter?: () => void;
  onLeave?: () => void;
  onEnterBack?: () => void;
  onLeaveBack?: () => void;
  onComplete?: () => void;
  onCleanup?: () => void;
}

// Text animation configuration
export interface TextAnimationConfig {
  splitType: "lines" | "words" | "chars";
  stagger?: number;
  duration?: number;
  ease?: string;
  delay?: number;
  from?: GSAPTweenVars;
  to?: GSAPTweenVars;
  scrollTrigger?: ScrollTriggerConfig;
}

// Video animation configuration
export interface VideoAnimationConfig {
  trigger: string;
  start: string;
  end: string;
  pin?: boolean;
  scrub?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
}

// Horizontal scroll configuration
export interface HorizontalScrollConfig {
  trigger: string;
  start: string;
  end: string;
  pin: boolean;
  scrub: boolean | number;
  snap?: boolean | number;
  anticipatePin?: number;
  invalidateOnRefresh?: boolean;
}

// GSAP error handling
export interface GSAPErrorHandler {
  onPluginLoadError: (plugin: string, error: Error) => void;
  onAnimationError: (animation: string, error: Error) => void;
  onScrollTriggerError: (trigger: string, error: Error) => void;
  onCleanupError: (component: string, error: Error) => void;
  onTimelineError: (timeline: string, error: Error) => void;
}

// Performance monitoring for animations
export interface AnimationPerformanceMetrics {
  fps: number;
  frameDrops: number;
  averageFrameTime: number;
  maxFrameTime: number;
  animationCount: number;
  memoryUsage: number;
}

// Animation cleanup function type
export type AnimationCleanup = () => void;

// GSAP plugin types
export type GSAPPlugin =
  | "ScrollTrigger"
  | "ScrollSmoother"
  | "SplitText"
  | "TextPlugin"
  | "MorphSVGPlugin"
  | "DrawSVGPlugin"
  | "MotionPathPlugin";

// GSAP configuration
export interface GSAPConfig {
  force3D?: boolean;
  nullTargetWarn?: boolean;
  trialWarn?: boolean;
  units?: { [key: string]: string };
  autoSleep?: number;
}

// ScrollSmoother configuration
export interface ScrollSmootherConfig {
  wrapper?: string | Element;
  content?: string | Element;
  smooth?: number;
  effects?: boolean;
  smoothTouch?: boolean | number;
  normalizeScroll?: boolean;
  ignoreMobileResize?: boolean;
  onUpdate?: (self: any) => void;
  onRefresh?: (self: any) => void;
}
