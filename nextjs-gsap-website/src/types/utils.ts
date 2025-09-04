// Utility function types and interfaces

// Generic utility types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Maybe<T> = T | null | undefined;

// Function types
export type VoidFunction = () => void;
export type AsyncVoidFunction = () => Promise<void>;
export type EventHandler<T = Event> = (event: T) => void;
export type AsyncEventHandler<T = Event> = (event: T) => Promise<void>;

// Debounce and throttle function types
export interface DebounceOptions {
  leading?: boolean;
  trailing?: boolean;
  maxWait?: number;
}

export interface ThrottleOptions {
  leading?: boolean;
  trailing?: boolean;
}

export type DebouncedFunction<T extends (...args: unknown[]) => unknown> = {
  (...args: Parameters<T>): void;
  cancel: () => void;
  flush: () => ReturnType<T> | undefined;
  pending: () => boolean;
};

export type ThrottledFunction<T extends (...args: unknown[]) => unknown> = {
  (...args: Parameters<T>): ReturnType<T> | undefined;
  cancel: () => void;
  flush: () => ReturnType<T> | undefined;
};

// Performance monitoring types
export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  interactionTime: number;
  memoryUsage: {
    used: number;
    total: number;
    limit: number;
  };
  networkInfo: {
    effectiveType: string;
    downlink: number;
    rtt: number;
    saveData: boolean;
  };
  vitals: {
    FCP: number; // First Contentful Paint
    LCP: number; // Largest Contentful Paint
    FID: number; // First Input Delay
    CLS: number; // Cumulative Layout Shift
    TTFB: number; // Time to First Byte
  };
}

export interface PerformanceObserverConfig {
  enableFCP: boolean;
  enableLCP: boolean;
  enableFID: boolean;
  enableCLS: boolean;
  enableTTFB: boolean;
  enableCustomMetrics: boolean;
  sampleRate: number;
}

// Error handling types
export interface ErrorInfo {
  componentStack: string;
  errorBoundary?: string;
  errorBoundaryStack?: string;
}

export interface ErrorReport {
  error: Error;
  errorInfo?: ErrorInfo;
  timestamp: number;
  url: string;
  userAgent: string;
  userId?: string;
  sessionId?: string;
  context?: Record<string, unknown>;
}

export interface ErrorHandlerConfig {
  enableReporting: boolean;
  enableConsoleLogging: boolean;
  enableUserNotification: boolean;
  maxRetries: number;
  retryDelay: number;
  reportingEndpoint?: string;
}

// Validation types
export interface ValidationRule<T = unknown> {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: T) => boolean | string;
  message?: string;
}

export interface ValidationSchema {
  [key: string]: ValidationRule;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  warnings?: Record<string, string>;
}

// Storage utility types
export interface StorageOptions {
  prefix?: string;
  serialize?: (value: unknown) => string;
  deserialize?: (value: string) => unknown;
  expiry?: number; // in milliseconds
}

export interface StorageItem<T = unknown> {
  value: T;
  timestamp: number;
  expiry?: number;
}

// URL and routing types
export interface URLParams {
  [key: string]: string | string[] | undefined;
}

export interface RouteConfig {
  path: string;
  component: React.ComponentType;
  exact?: boolean;
  guards?: Array<() => boolean | Promise<boolean>>;
  meta?: Record<string, unknown>;
}

// API utility types
export interface APIResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  config: RequestConfig;
}

export interface APIError {
  message: string;
  status: number;
  statusText: string;
  data?: unknown;
  config: RequestConfig;
}

export interface RequestConfig {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  params?: Record<string, unknown>;
  data?: unknown;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

// Date and time utility types
export interface DateRange {
  start: Date;
  end: Date;
}

export interface TimeZoneInfo {
  name: string;
  offset: number;
  abbreviation: string;
}

export interface DateFormatOptions {
  locale?: string;
  timeZone?: string;
  format?: "short" | "medium" | "long" | "full" | "custom";
  customFormat?: string;
}

// Color utility types
export interface RGBColor {
  r: number;
  g: number;
  b: number;
  a?: number;
}

export interface HSLColor {
  h: number;
  s: number;
  l: number;
  a?: number;
}

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
}

// Animation utility types
export interface AnimationKeyframe {
  offset: number;
  properties: Record<string, unknown>;
  easing?: string;
}

export interface AnimationSequence {
  keyframes: AnimationKeyframe[];
  duration: number;
  delay?: number;
  iterations?: number;
  direction?: "normal" | "reverse" | "alternate" | "alternate-reverse";
  fillMode?: "none" | "forwards" | "backwards" | "both";
}

// Geometry utility types
export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Rectangle extends Point, Size {}

export interface Circle extends Point {
  radius: number;
}

// Device detection types
export interface DeviceInfo {
  type: "mobile" | "tablet" | "desktop";
  os: "ios" | "android" | "windows" | "macos" | "linux" | "unknown";
  browser: "chrome" | "firefox" | "safari" | "edge" | "opera" | "unknown";
  version: string;
  isTouchDevice: boolean;
  isRetina: boolean;
  viewport: Size;
  screen: Size;
  orientation: "portrait" | "landscape";
}

// Accessibility types
export interface AccessibilityConfig {
  enableHighContrast: boolean;
  enableReducedMotion: boolean;
  enableScreenReader: boolean;
  fontSize: "small" | "medium" | "large" | "extra-large";
  focusIndicator: "default" | "enhanced";
}

export interface ARIAAttributes {
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  "aria-expanded"?: boolean;
  "aria-hidden"?: boolean;
  "aria-live"?: "off" | "polite" | "assertive";
  "aria-atomic"?: boolean;
  "aria-busy"?: boolean;
  "aria-controls"?: string;
  "aria-current"?: boolean | "page" | "step" | "location" | "date" | "time";
  "aria-disabled"?: boolean;
  "aria-invalid"?: boolean | "grammar" | "spelling";
  "aria-pressed"?: boolean;
  "aria-selected"?: boolean;
  role?: string;
  tabIndex?: number;
}

// Internationalization types
export interface LocaleConfig {
  code: string;
  name: string;
  direction: "ltr" | "rtl";
  dateFormat: string;
  timeFormat: string;
  numberFormat: {
    decimal: string;
    thousands: string;
    currency: string;
  };
}

export interface TranslationKey {
  key: string;
  defaultValue: string;
  interpolation?: Record<string, unknown>;
  pluralization?: {
    count: number;
    forms: Record<string, string>;
  };
}

// Testing utility types
export interface TestConfig {
  testId: string;
  mockData?: unknown;
  skipTests?: string[];
  timeout?: number;
}

export interface MockFunction<T extends (...args: unknown[]) => unknown> {
  (...args: Parameters<T>): ReturnType<T>;
  mockReturnValue: (value: ReturnType<T>) => void;
  mockResolvedValue: (value: ReturnType<T>) => void;
  mockRejectedValue: (error: Error) => void;
  mockImplementation: (fn: T) => void;
  mockClear: () => void;
  mockReset: () => void;
  mockRestore: () => void;
}

// Configuration types
export interface ConfigProvider<T = unknown> {
  get: (key: string, defaultValue?: T) => T;
  set: (key: string, value: T) => void;
  has: (key: string) => boolean;
  remove: (key: string) => void;
  clear: () => void;
  getAll: () => Record<string, T>;
}
