import { ReactNode } from "react";

// Common utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Media query types
export interface MediaQueryState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLargeDesktop: boolean;
}

// Responsive breakpoints
export type Breakpoint = "mobile" | "tablet" | "desktop" | "large";

// Color palette type
export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: {
    primary: string;
    secondary: string;
    accent: string;
  };
  gradient: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

// Font configuration
export interface FontConfig {
  family: string;
  weight: number | string;
  size: string;
  lineHeight: string;
  letterSpacing?: string;
}

// Component base props
export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
  id?: string;
  "data-testid"?: string;
}

// Error boundary types
export interface ErrorInfo {
  componentStack: string;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

// Loading states
export type LoadingState = "idle" | "loading" | "success" | "error";

// Animation states
export interface AnimationState {
  isInitialized: boolean;
  isPlaying: boolean;
  isPaused: boolean;
  progress: number;
  duration: number;
}

// Section visibility state
export interface SectionState {
  isVisible: boolean;
  hasAnimated: boolean;
  animationProgress: number;
  isIntersecting: boolean;
}

// Performance metrics
export interface PerformanceMetrics {
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  fcp: number; // First Contentful Paint
  ttfb: number; // Time to First Byte
}

// Environment types
export type Environment = "development" | "production" | "test";

// API response wrapper
export interface ApiResponse<T = unknown> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

// Generic event handler types
export type EventHandler<T = Event> = (event: T) => void;
export type AsyncEventHandler<T = Event> = (event: T) => Promise<void>;

// Utility types for form handling
export interface FormField<T = string> {
  value: T;
  error?: string;
  touched: boolean;
  required?: boolean;
}

export interface FormState<T extends Record<string, unknown>> {
  fields: { [K in keyof T]: FormField<T[K]> };
  isValid: boolean;
  isSubmitting: boolean;
  submitCount: number;
}
