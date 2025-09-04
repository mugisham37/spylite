// Hook-related type definitions
import { RefObject } from "react";
import {
  GSAPContextReturn,
  ScrollTriggerConfig,
  ScrollSmootherConfig,
  AnimationState,
  AnimationControls,
} from "./gsap";
import {
  MediaLoadingStrategy,
  DeviceCapabilities,
  MediaPerformanceMetrics,
} from "./media";
import { PerformanceMetrics, ValidationResult, DeviceInfo } from "./utils";

// Base hook return type
export interface BaseHookReturn {
  isLoading: boolean;
  error: Error | null;
  retry: () => void;
}

// GSAP hooks
export interface UseGSAPOptions {
  scope?: RefObject<Element> | string;
  dependencies?: unknown[];
  revertOnUpdate?: boolean;
}

export interface UseGSAPReturn extends BaseHookReturn {
  contextSafe: <T extends (...args: unknown[]) => unknown>(func: T) => T;
  context: GSAPContextReturn;
  isReady: boolean;
}

export interface UseScrollTriggerOptions extends ScrollTriggerConfig {
  dependencies?: unknown[];
  enabled?: boolean;
}

export interface UseScrollTriggerReturn extends BaseHookReturn {
  scrollTrigger: ScrollTrigger | null;
  refresh: () => void;
  kill: () => void;
  isActive: boolean;
  progress: number;
}

export interface UseScrollSmootherOptions extends ScrollSmootherConfig {
  enabled?: boolean;
  wrapper?: string | Element;
  content?: string | Element;
}

export interface UseScrollSmootherReturn extends BaseHookReturn {
  scrollSmoother: ScrollSmoother | null;
  scrollTo: (target: string | number | Element, smooth?: boolean) => void;
  refresh: () => void;
  kill: () => void;
  isActive: boolean;
  progress: number;
}

export interface UseAnimationOptions {
  autoPlay?: boolean;
  loop?: boolean;
  delay?: number;
  onComplete?: () => void;
  onStart?: () => void;
  onUpdate?: (progress: number) => void;
}

export interface UseAnimationReturn extends BaseHookReturn {
  state: AnimationState;
  controls: AnimationControls;
  timeline: gsap.core.Timeline | null;
}

// Media hooks
export interface UseMediaOptimizationReturn extends BaseHookReturn {
  config: MediaLoadingStrategy;
  isInitialized: boolean;
  capabilities: DeviceCapabilities;
  metrics: MediaPerformanceMetrics;
  getOptimizedImageProps: (priority?: boolean) => object;
  getOptimizedVideoProps: (priority?: boolean) => object;
  supportsModernFormats: () => boolean;
  getResponsiveSizes: (breakpoints: object) => string;
}

export interface UseImageLoaderOptions {
  src: string;
  priority?: boolean;
  lazy?: boolean;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

export interface UseImageLoaderReturn extends BaseHookReturn {
  isLoaded: boolean;
  hasError: boolean;
  progress: number;
  optimizedSrc: string;
  load: () => void;
  cancel: () => void;
}

export interface UseVideoLoaderOptions {
  src: string;
  preload?: "none" | "metadata" | "auto";
  onLoad?: () => void;
  onError?: (error: Error) => void;
  onProgress?: (progress: number) => void;
}

export interface UseVideoLoaderReturn extends BaseHookReturn {
  isLoaded: boolean;
  hasError: boolean;
  progress: number;
  duration: number;
  currentTime: number;
  play: () => Promise<void>;
  pause: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
}

// Responsive hooks
export interface UseMediaQueryOptions {
  defaultMatches?: boolean;
  noSsr?: boolean;
  ssrMatchMedia?: (query: string) => { matches: boolean };
}

export interface UseMediaQueryReturn {
  matches: boolean;
  media: string;
}

export interface UseResponsiveReturn {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isMd: boolean;
  is2xl: boolean;
  breakpoint: "mobile" | "tablet" | "desktop";
  orientation: "portrait" | "landscape";
  viewport: {
    width: number;
    height: number;
  };
}

export interface UseViewportOptions {
  debounceMs?: number;
  initialWidth?: number;
  initialHeight?: number;
}

export interface UseViewportReturn {
  width: number;
  height: number;
  aspectRatio: number;
  isLandscape: boolean;
  isPortrait: boolean;
}

// Performance hooks
export interface UsePerformanceMonitoringOptions {
  enableVitals?: boolean;
  enableCustomMetrics?: boolean;
  sampleRate?: number;
  reportingEndpoint?: string;
}

export interface UsePerformanceMonitoringReturn extends BaseHookReturn {
  metrics: PerformanceMetrics;
  startMeasure: (name: string) => void;
  endMeasure: (name: string) => number;
  recordCustomMetric: (name: string, value: number) => void;
  getReport: () => PerformanceMetrics;
}

export interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
  triggerOnce?: boolean;
  skip?: boolean;
}

export interface UseIntersectionObserverReturn {
  ref: RefObject<Element>;
  inView: boolean;
  entry: IntersectionObserverEntry | null;
}

// Error handling hooks
export interface UseErrorHandlingOptions {
  enableReporting?: boolean;
  enableUserNotification?: boolean;
  maxRetries?: number;
  retryDelay?: number;
  onError?: (error: Error) => void;
}

export interface UseErrorHandlingReturn {
  error: Error | null;
  hasError: boolean;
  errorCount: number;
  reportError: (error: Error, context?: Record<string, unknown>) => void;
  clearError: () => void;
  retry: () => void;
  canRetry: boolean;
}

export interface UseErrorBoundaryReturn {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  resetError: () => void;
  captureError: (error: Error, errorInfo?: React.ErrorInfo) => void;
}

// State management hooks
export interface UseLocalStorageOptions<T> {
  defaultValue?: T;
  serialize?: (value: T) => string;
  deserialize?: (value: string) => T;
}

export interface UseLocalStorageReturn<T> {
  value: T;
  setValue: (value: T | ((prev: T) => T)) => void;
  removeValue: () => void;
  hasValue: boolean;
}

export type UseSessionStorageReturn<T> = UseLocalStorageReturn<T>;

export interface UseDebounceOptions {
  delay: number;
  leading?: boolean;
  trailing?: boolean;
  maxWait?: number;
}

export interface UseDebounceReturn<T> {
  debouncedValue: T;
  cancel: () => void;
  flush: () => void;
  isPending: () => boolean;
}

export interface UseThrottleOptions {
  delay: number;
  leading?: boolean;
  trailing?: boolean;
}

export interface UseThrottleReturn<T> {
  throttledValue: T;
  cancel: () => void;
  flush: () => void;
}

// Form hooks
export interface UseFormOptions<T> {
  initialValues: T;
  validationSchema?: Record<string, unknown>;
  onSubmit: (values: T) => void | Promise<void>;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

export interface UseFormReturn<T> {
  values: T;
  errors: Record<keyof T, string>;
  touched: Record<keyof T, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
  handleChange: (field: keyof T) => (value: unknown) => void;
  handleBlur: (field: keyof T) => () => void;
  handleSubmit: (e?: React.FormEvent) => void;
  setFieldValue: (field: keyof T, value: unknown) => void;
  setFieldError: (field: keyof T, error: string) => void;
  resetForm: () => void;
  validateField: (field: keyof T) => Promise<void>;
  validateForm: () => Promise<ValidationResult>;
}

// API hooks
export interface UseAPIOptions<T> {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  params?: Record<string, unknown>;
  data?: unknown;
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
  refetchInterval?: number;
  retry?: number;
  retryDelay?: number;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export interface UseAPIReturn<T> extends BaseHookReturn {
  data: T | null;
  isLoading: boolean;
  isFetching: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  mutate: (newData: T) => void;
}

// Device hooks
export interface UseDeviceDetectionReturn {
  device: DeviceInfo;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouchDevice: boolean;
  isRetina: boolean;
  supportsHover: boolean;
  prefersReducedMotion: boolean;
  prefersColorScheme: "light" | "dark" | "no-preference";
}

export interface UseNetworkStatusReturn {
  isOnline: boolean;
  isOffline: boolean;
  connectionType: string;
  effectiveType: "2g" | "3g" | "4g" | "slow-2g";
  downlink: number;
  rtt: number;
  saveData: boolean;
}

export interface UseBatteryStatusReturn {
  isSupported: boolean;
  isCharging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
}

// Animation hooks
export interface UseScrollAnimationOptions {
  threshold?: number;
  triggerOnce?: boolean;
  delay?: number;
  duration?: number;
  easing?: string;
}

export interface UseScrollAnimationReturn {
  ref: RefObject<Element>;
  isVisible: boolean;
  hasAnimated: boolean;
  progress: number;
  trigger: () => void;
  reset: () => void;
}

export interface UseParallaxOptions {
  speed?: number;
  direction?: "up" | "down" | "left" | "right";
  disabled?: boolean;
}

export interface UseParallaxReturn {
  ref: RefObject<Element>;
  transform: string;
  progress: number;
}

// Accessibility hooks
export interface UseAccessibilityReturn {
  announceToScreenReader: (
    message: string,
    priority?: "polite" | "assertive"
  ) => void;
  focusElement: (element: Element | string) => void;
  trapFocus: (container: Element) => () => void;
  skipToContent: () => void;
  isReducedMotion: boolean;
  isHighContrast: boolean;
  fontSize: number;
}

export interface UseFocusManagementOptions {
  autoFocus?: boolean;
  restoreFocus?: boolean;
  trapFocus?: boolean;
}

export interface UseFocusManagementReturn {
  ref: RefObject<Element>;
  focusedElement: Element | null;
  hasFocus: boolean;
  focus: () => void;
  blur: () => void;
  moveFocus: (direction: "next" | "previous" | "first" | "last") => void;
}

// Utility hooks
export interface UseClipboardReturn {
  copy: (text: string) => Promise<boolean>;
  paste: () => Promise<string>;
  isSupported: boolean;
  hasCopied: boolean;
}

export interface UseToggleReturn {
  value: boolean;
  toggle: () => void;
  setTrue: () => void;
  setFalse: () => void;
  setValue: (value: boolean) => void;
}

export interface UseCounterOptions {
  min?: number;
  max?: number;
  step?: number;
}

export interface UseCounterReturn {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  set: (value: number) => void;
  canIncrement: boolean;
  canDecrement: boolean;
}
