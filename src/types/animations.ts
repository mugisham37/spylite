import { ScrollTriggerConfig, TimelineConfig, AnimationCleanup } from "./gsap";

// GSAP type aliases to avoid import issues
type GSAPTweenVars = any;
type GSAPTimeline = any;

// Animation timing and easing presets
export const ANIMATION_DURATIONS = {
  fast: 0.3,
  normal: 0.6,
  slow: 1.2,
  verySlow: 2.4,
} as const;

export const ANIMATION_EASINGS = {
  easeOut: "power2.out",
  easeIn: "power2.in",
  easeInOut: "power2.inOut",
  bounce: "bounce.out",
  elastic: "elastic.out(1, 0.3)",
  back: "back.out(1.7)",
  expo: "expo.out",
  circ: "circ.out",
  sine: "sine.out",
} as const;

export type AnimationDuration = keyof typeof ANIMATION_DURATIONS;
export type AnimationEasing = keyof typeof ANIMATION_EASINGS;

// Stagger configuration
export interface StaggerConfig {
  amount?: number;
  from?: "start" | "center" | "end" | "edges" | "random" | number;
  grid?: [number, number];
  axis?: "x" | "y";
  ease?: string;
}

// Entrance animations
export interface EntranceAnimationConfig {
  type:
    | "fadeIn"
    | "slideUp"
    | "slideDown"
    | "slideLeft"
    | "slideRight"
    | "scaleIn"
    | "rotateIn";
  duration?: AnimationDuration | number;
  ease?: AnimationEasing | string;
  delay?: number;
  stagger?: StaggerConfig;
  scrollTrigger?: ScrollTriggerConfig;
}

// Exit animations
export interface ExitAnimationConfig {
  type:
    | "fadeOut"
    | "slideUp"
    | "slideDown"
    | "slideLeft"
    | "slideRight"
    | "scaleOut"
    | "rotateOut";
  duration?: AnimationDuration | number;
  ease?: AnimationEasing | string;
  delay?: number;
  stagger?: StaggerConfig;
}

// Text reveal animations
export interface TextRevealConfig {
  type: "chars" | "words" | "lines";
  direction: "up" | "down" | "left" | "right";
  duration?: AnimationDuration | number;
  ease?: AnimationEasing | string;
  stagger?: StaggerConfig;
  scrollTrigger?: ScrollTriggerConfig;
}

// Scroll-based animations
export interface ScrollAnimationConfig {
  trigger: string;
  start: string;
  end: string;
  scrub?: boolean | number;
  pin?: boolean;
  pinSpacing?: boolean;
  snap?: boolean | number;
  anticipatePin?: number;
  refreshPriority?: number;
  markers?: boolean;
  id?: string;
}

// Parallax animation configuration
export interface ParallaxConfig {
  trigger: string;
  start?: string;
  end?: string;
  speed: number;
  direction?: "vertical" | "horizontal";
  ease?: string;
}

// Morphing animation configuration
export interface MorphConfig {
  from: string;
  to: string;
  duration?: AnimationDuration | number;
  ease?: AnimationEasing | string;
  scrollTrigger?: ScrollTriggerConfig;
}

// Video sync animation configuration
export interface VideoSyncConfig {
  videoElement: HTMLVideoElement;
  trigger: string;
  start: string;
  end: string;
  scrub: boolean;
  onUpdate?: (progress: number) => void;
}

// Magnetic effect configuration
export interface MagneticConfig {
  strength: number;
  speed: number;
  ease?: string;
  trigger?: "hover" | "proximity";
  distance?: number;
}

// Liquid animation configuration
export interface LiquidConfig {
  amplitude: number;
  frequency: number;
  speed: number;
  trigger: string;
  scrollTrigger?: ScrollTriggerConfig;
}

// Page transition configuration
export interface PageTransitionConfig {
  enter: EntranceAnimationConfig;
  exit: ExitAnimationConfig;
  duration?: number;
  ease?: string;
}

// Animation sequence configuration
export interface AnimationSequenceConfig {
  steps: AnimationSequenceStep[];
  repeat?: number;
  yoyo?: boolean;
  onComplete?: () => void;
  onRepeat?: () => void;
}

export interface AnimationSequenceStep {
  target: string;
  animation: GSAPTweenVars;
  position?: string | number;
}

// Hover animation configuration
export interface HoverAnimationConfig {
  enter: GSAPTweenVars;
  leave: GSAPTweenVars;
  duration?: AnimationDuration | number;
  ease?: AnimationEasing | string;
}

// Loading animation configuration
export interface LoadingAnimationConfig {
  type: "spinner" | "dots" | "pulse" | "wave" | "skeleton";
  duration?: AnimationDuration | number;
  ease?: AnimationEasing | string;
  repeat?: number;
}

// Intersection observer animation configuration
export interface IntersectionAnimationConfig {
  threshold?: number | number[];
  rootMargin?: string;
  triggerOnce?: boolean;
  animation: EntranceAnimationConfig;
}

// Custom animation hook configuration
export interface UseAnimationConfig {
  autoPlay?: boolean;
  paused?: boolean;
  reversed?: boolean;
  onComplete?: () => void;
  onStart?: () => void;
  onUpdate?: (progress: number) => void;
  dependencies?: unknown[];
}

// Animation performance configuration
export interface AnimationPerformanceConfig {
  force3D?: boolean;
  willChange?: boolean;
  optimizeMemory?: boolean;
  throttleScrollEvents?: boolean;
  useRAF?: boolean;
}

// Responsive animation configuration
export interface ResponsiveAnimationConfig {
  mobile?: Partial<EntranceAnimationConfig>;
  tablet?: Partial<EntranceAnimationConfig>;
  desktop?: Partial<EntranceAnimationConfig>;
  large?: Partial<EntranceAnimationConfig>;
}

// Animation state management
export interface AnimationStateManager {
  register: (id: string, cleanup: AnimationCleanup) => void;
  unregister: (id: string) => void;
  cleanup: (id?: string) => void;
  pause: (id?: string) => void;
  resume: (id?: string) => void;
  kill: (id?: string) => void;
}

// Timeline builder configuration
export interface TimelineBuilderConfig {
  autoPlay?: boolean;
  repeat?: number;
  yoyo?: boolean;
  ease?: string;
  onComplete?: () => void;
  onRepeat?: () => void;
  onReverseComplete?: () => void;
}

// Animation preset types
export type AnimationPreset =
  | "fadeInUp"
  | "fadeInDown"
  | "fadeInLeft"
  | "fadeInRight"
  | "slideInUp"
  | "slideInDown"
  | "slideInLeft"
  | "slideInRight"
  | "scaleIn"
  | "scaleOut"
  | "rotateIn"
  | "rotateOut"
  | "bounceIn"
  | "bounceOut"
  | "elasticIn"
  | "elasticOut"
  | "backIn"
  | "backOut";

// Animation registry for managing multiple animations
export interface AnimationRegistry {
  [key: string]: {
    timeline: GSAPTimeline;
    cleanup: AnimationCleanup;
    config: TimelineConfig;
    isActive: boolean;
  };
}

// Scroll-triggered animation phases
export type ScrollAnimationPhase =
  | "enter"
  | "active"
  | "leave"
  | "enterBack"
  | "leaveBack";

// Animation callback types
export type AnimationCallback = () => void;
export type AnimationProgressCallback = (progress: number) => void;
export type ScrollAnimationCallback = (
  phase: ScrollAnimationPhase,
  progress: number
) => void;

// Complex animation configuration for sections
export interface SectionAnimationDefinition {
  id: string;
  trigger: string;
  timeline: AnimationSequenceConfig;
  scrollTrigger?: ScrollAnimationConfig;
  responsive?: ResponsiveAnimationConfig;
  performance?: AnimationPerformanceConfig;
  cleanup?: AnimationCleanup;
}
