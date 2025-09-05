// Global type declarations for the application

// Environment variables
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test";
    NEXT_PUBLIC_APP_URL: string;
    NEXT_PUBLIC_ANALYTICS_ID?: string;
    NEXT_PUBLIC_GTM_ID?: string;
    NEXT_PUBLIC_SENTRY_DSN?: string;
    NEXT_PUBLIC_API_BASE_URL?: string;
    GSAP_LICENSE_KEY?: string;
  }
}

// Next.js Image component augmentation
declare module "next/image" {
  interface ImageProps {
    priority?: boolean;
    quality?: number;
    placeholder?: "blur" | "empty";
    blurDataURL?: string;
  }
}

// CSS Modules
declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module "*.module.scss" {
  const classes: { [key: string]: string };
  export default classes;
}

// Static assets
declare module "*.svg" {
  const content: string;
  export default content;
}

declare module "*.png" {
  const content: string;
  export default content;
}

declare module "*.jpg" {
  const content: string;
  export default content;
}

declare module "*.jpeg" {
  const content: string;
  export default content;
}

declare module "*.webp" {
  const content: string;
  export default content;
}

declare module "*.avif" {
  const content: string;
  export default content;
}

declare module "*.gif" {
  const content: string;
  export default content;
}

declare module "*.ico" {
  const content: string;
  export default content;
}

declare module "*.mp4" {
  const content: string;
  export default content;
}

declare module "*.webm" {
  const content: string;
  export default content;
}

declare module "*.ogg" {
  const content: string;
  export default content;
}

declare module "*.mp3" {
  const content: string;
  export default content;
}

declare module "*.wav" {
  const content: string;
  export default content;
}

declare module "*.flac" {
  const content: string;
  export default content;
}

declare module "*.aac" {
  const content: string;
  export default content;
}

// Font files
declare module "*.woff" {
  const content: string;
  export default content;
}

declare module "*.woff2" {
  const content: string;
  export default content;
}

declare module "*.eot" {
  const content: string;
  export default content;
}

declare module "*.ttf" {
  const content: string;
  export default content;
}

declare module "*.otf" {
  const content: string;
  export default content;
}

// JSON files
declare module "*.json" {
  const content: any;
  export default content;
}

// Markdown files
declare module "*.md" {
  const content: string;
  export default content;
}

declare module "*.mdx" {
  const content: string;
  export default content;
}

// Web Workers
declare module "*.worker.ts" {
  class WebpackWorker extends Worker {
    constructor();
  }
  export default WebpackWorker;
}

// Service Workers
declare module "*.sw.ts" {
  const content: string;
  export default content;
}

// Tailwind CSS IntelliSense
declare module "tailwindcss/lib/util/flattenColorPalette" {
  const flattenColorPalette: (colors: any) => any;
  export default flattenColorPalette;
}

// React 18 types augmentation
declare module "react" {
  interface CSSProperties {
    [key: `--${string}`]: string | number | undefined;
  }
}

// Intersection Observer API
interface IntersectionObserverInit {
  root?: Element | Document | null;
  rootMargin?: string;
  threshold?: number | number[];
}

interface IntersectionObserverEntry {
  readonly boundingClientRect: DOMRectReadOnly;
  readonly intersectionRatio: number;
  readonly intersectionRect: DOMRectReadOnly;
  readonly isIntersecting: boolean;
  readonly rootBounds: DOMRectReadOnly | null;
  readonly target: Element;
  readonly time: number;
}

interface IntersectionObserver {
  readonly root: Element | Document | null;
  readonly rootMargin: string;
  readonly thresholds: ReadonlyArray<number>;
  disconnect(): void;
  observe(target: Element): void;
  takeRecords(): IntersectionObserverEntry[];
  unobserve(target: Element): void;
}

declare var IntersectionObserver: {
  prototype: IntersectionObserver;
  new (
    callback: (
      entries: IntersectionObserverEntry[],
      observer: IntersectionObserver
    ) => void,
    options?: IntersectionObserverInit
  ): IntersectionObserver;
};

// Resize Observer API
interface ResizeObserverSize {
  readonly inlineSize: number;
  readonly blockSize: number;
}

interface ResizeObserverEntry {
  readonly target: Element;
  readonly contentRect: DOMRectReadOnly;
  readonly borderBoxSize: ReadonlyArray<ResizeObserverSize>;
  readonly contentBoxSize: ReadonlyArray<ResizeObserverSize>;
  readonly devicePixelContentBoxSize: ReadonlyArray<ResizeObserverSize>;
}

interface ResizeObserver {
  disconnect(): void;
  observe(target: Element, options?: ResizeObserverOptions): void;
  unobserve(target: Element): void;
}

interface ResizeObserverOptions {
  box?: "content-box" | "border-box" | "device-pixel-content-box";
}

declare var ResizeObserver: {
  prototype: ResizeObserver;
  new (
    callback: (entries: ResizeObserverEntry[], observer: ResizeObserver) => void
  ): ResizeObserver;
};

// Performance Observer API
interface PerformanceEntry {
  readonly duration: number;
  readonly entryType: string;
  readonly name: string;
  readonly startTime: number;
  toJSON(): any;
}

interface PerformanceObserver {
  disconnect(): void;
  observe(options: PerformanceObserverInit): void;
  takeRecords(): PerformanceEntryList;
}

interface PerformanceObserverInit {
  entryTypes?: string[];
  type?: string;
  buffered?: boolean;
}

type PerformanceEntryList = PerformanceEntry[];

declare var PerformanceObserver: {
  prototype: PerformanceObserver;
  new (
    callback: (
      list: PerformanceObserverEntryList,
      observer: PerformanceObserver
    ) => void
  ): PerformanceObserver;
  readonly supportedEntryTypes: ReadonlyArray<string>;
};

interface PerformanceObserverEntryList {
  getEntries(): PerformanceEntryList;
  getEntriesByName(name: string, type?: string): PerformanceEntryList;
  getEntriesByType(type: string): PerformanceEntryList;
}

// Web Animations API
interface AnimationEffect {
  getComputedTiming(): ComputedEffectTiming;
  getTiming(): EffectTiming;
  updateTiming(timing?: OptionalEffectTiming): void;
}

interface KeyframeEffect extends AnimationEffect {
  readonly target: Element | null;
  pseudoElement: string | null;
  composite: CompositeOperation;
  iterationComposite: IterationCompositeOperation;
  getKeyframes(): ComputedKeyframe[];
  setKeyframes(keyframes: Keyframe[] | PropertyIndexedKeyframes | null): void;
}

interface Animation extends EventTarget {
  readonly currentTime: number | null;
  effect: AnimationEffect | null;
  readonly finished: Promise<Animation>;
  id: string;
  readonly pending: boolean;
  readonly playState: AnimationPlayState;
  playbackRate: number;
  readonly ready: Promise<Animation>;
  readonly replaceState: AnimationReplaceState;
  startTime: number | null;
  timeline: AnimationTimeline | null;
  cancel(): void;
  commitStyles(): void;
  finish(): void;
  pause(): void;
  persist(): void;
  play(): void;
  reverse(): void;
  updatePlaybackRate(playbackRate: number): void;
}

// Custom events
interface CustomEventMap {
  "gsap:animation:start": CustomEvent<{ target: Element; animation: string }>;
  "gsap:animation:complete": CustomEvent<{
    target: Element;
    animation: string;
  }>;
  "gsap:scroll:update": CustomEvent<{ progress: number; direction: number }>;
  "intersection:enter": CustomEvent<{ target: Element; ratio: number }>;
  "intersection:leave": CustomEvent<{ target: Element; ratio: number }>;
  "resize:update": CustomEvent<{ width: number; height: number }>;
  "performance:metric": CustomEvent<{ name: string; value: number }>;
}

declare global {
  interface WindowEventMap extends CustomEventMap {}
  interface DocumentEventMap extends CustomEventMap {}
  interface ElementEventMap extends CustomEventMap {}

  interface Window {
    scrollSmootherResizeTimer?: number;
    gtag?: (...args: any[]) => void;
  }
}

// Utility types for better development experience
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

export type IsEqual<T, U> = (<G>() => G extends T ? 1 : 2) extends <
  G
>() => G extends U ? 1 : 2
  ? true
  : false;

export type If<C extends boolean, T, F> = C extends true ? T : F;

export {};
