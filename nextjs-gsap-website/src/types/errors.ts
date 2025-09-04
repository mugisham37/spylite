// Error handling and boundary types

// Base error types
export interface BaseError extends Error {
  code?: string;
  statusCode?: number;
  context?: Record<string, any>;
  timestamp?: number;
  userId?: string;
  sessionId?: string;
}

// GSAP-specific errors
export interface GSAPError extends BaseError {
  type:
    | "timeline"
    | "scrolltrigger"
    | "splittext"
    | "scrollsmoother"
    | "tween"
    | "plugin";
  element?: string | Element;
  config?: object;
  animationId?: string;
}

// Media loading errors
export interface MediaError extends BaseError {
  type: "image" | "video" | "audio";
  src: string;
  format?: string;
  size?: number;
  loadTime?: number;
  networkStatus?: string;
}

// API errors
export interface APIError extends BaseError {
  endpoint: string;
  method: string;
  status: number;
  statusText: string;
  response?: any;
  requestId?: string;
}

// Validation errors
export interface ValidationError extends BaseError {
  field: string;
  value: any;
  rule: string;
  expected?: any;
}

// Performance errors
export interface PerformanceError extends BaseError {
  metric: string;
  value: number;
  threshold: number;
  impact: "low" | "medium" | "high" | "critical";
}

// Network errors
export interface NetworkError extends BaseError {
  type: "timeout" | "offline" | "slow" | "failed";
  url?: string;
  duration?: number;
  retryCount?: number;
}

// Component errors
export interface ComponentError extends BaseError {
  componentName: string;
  componentStack: string;
  props?: Record<string, any>;
  state?: Record<string, any>;
}

// Error severity levels
export type ErrorSeverity = "low" | "medium" | "high" | "critical";

// Error categories
export type ErrorCategory =
  | "animation"
  | "media"
  | "api"
  | "validation"
  | "performance"
  | "network"
  | "component"
  | "user"
  | "system"
  | "security";

// Error context information
export interface ErrorContext {
  url: string;
  userAgent: string;
  timestamp: number;
  userId?: string;
  sessionId?: string;
  buildVersion?: string;
  environment: "development" | "staging" | "production";
  feature?: string;
  action?: string;
  metadata?: Record<string, any>;
}

// Error report structure
export interface ErrorReport {
  id: string;
  error: BaseError;
  severity: ErrorSeverity;
  category: ErrorCategory;
  context: ErrorContext;
  stackTrace?: string;
  breadcrumbs?: ErrorBreadcrumb[];
  tags?: string[];
  fingerprint?: string;
  resolved?: boolean;
  resolvedAt?: number;
  resolvedBy?: string;
}

// Error breadcrumb for tracking user actions
export interface ErrorBreadcrumb {
  timestamp: number;
  type: "navigation" | "user" | "http" | "error" | "info";
  category?: string;
  message: string;
  data?: Record<string, any>;
  level: "debug" | "info" | "warning" | "error";
}

// Error boundary state
export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  errorId?: string;
  retryCount: number;
  lastErrorTime?: number;
}

// Error boundary props
export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  resetOnPropsChange?: boolean;
  resetKeys?: Array<string | number>;
  isolate?: boolean;
  level?: "page" | "section" | "component";
}

// Error fallback component props
export interface ErrorFallbackProps {
  error: Error;
  errorInfo?: React.ErrorInfo;
  resetError: () => void;
  retry: () => void;
  canRetry: boolean;
  retryCount: number;
  context?: ErrorContext;
}

// Error handler configuration
export interface ErrorHandlerConfig {
  enableReporting: boolean;
  enableConsoleLogging: boolean;
  enableUserNotification: boolean;
  enableBreadcrumbs: boolean;
  maxBreadcrumbs: number;
  maxRetries: number;
  retryDelay: number;
  reportingEndpoint?: string;
  apiKey?: string;
  environment: string;
  release?: string;
  sampleRate: number;
  beforeSend?: (report: ErrorReport) => ErrorReport | null;
  beforeBreadcrumb?: (breadcrumb: ErrorBreadcrumb) => ErrorBreadcrumb | null;
}

// Error recovery strategies
export interface ErrorRecoveryStrategy {
  type: "retry" | "fallback" | "ignore" | "redirect" | "reload";
  maxAttempts?: number;
  delay?: number;
  fallbackComponent?: React.ComponentType;
  fallbackUrl?: string;
  condition?: (error: Error) => boolean;
}

// Error notification configuration
export interface ErrorNotificationConfig {
  enabled: boolean;
  position:
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "center";
  duration: number;
  showRetry: boolean;
  showDetails: boolean;
  autoHide: boolean;
  maxNotifications: number;
  groupSimilar: boolean;
}

// Error analytics
export interface ErrorAnalytics {
  totalErrors: number;
  errorRate: number;
  errorsByCategory: Record<ErrorCategory, number>;
  errorsBySeverity: Record<ErrorSeverity, number>;
  topErrors: Array<{
    error: string;
    count: number;
    lastSeen: number;
  }>;
  affectedUsers: number;
  resolvedErrors: number;
  averageResolutionTime: number;
}

// Error monitoring hooks
export interface UseErrorMonitoringOptions {
  enableReporting?: boolean;
  enableAnalytics?: boolean;
  sampleRate?: number;
  onError?: (error: Error) => void;
}

export interface UseErrorMonitoringReturn {
  reportError: (error: Error, context?: Partial<ErrorContext>) => void;
  addBreadcrumb: (breadcrumb: Omit<ErrorBreadcrumb, "timestamp">) => void;
  setContext: (context: Partial<ErrorContext>) => void;
  setTag: (key: string, value: string) => void;
  setUser: (user: { id: string; email?: string; username?: string }) => void;
  clearContext: () => void;
  getAnalytics: () => ErrorAnalytics;
}

// Error retry configuration
export interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
  backoffFactor: number;
  jitter: boolean;
  retryCondition: (error: Error, attempt: number) => boolean;
  onRetry?: (error: Error, attempt: number) => void;
}

// Error recovery result
export interface RecoveryResult {
  success: boolean;
  error?: Error;
  attempts: number;
  duration: number;
  strategy: ErrorRecoveryStrategy["type"];
}

// Global error handler
export interface GlobalErrorHandler {
  handleError: (error: Error, context?: Partial<ErrorContext>) => void;
  handleUnhandledRejection: (event: PromiseRejectionEvent) => void;
  handleResourceError: (event: Event) => void;
  setErrorBoundary: (boundary: React.ComponentType<ErrorBoundaryProps>) => void;
  configure: (config: Partial<ErrorHandlerConfig>) => void;
  getConfig: () => ErrorHandlerConfig;
  getReports: () => ErrorReport[];
  clearReports: () => void;
}

// Error testing utilities
export interface ErrorTestUtils {
  throwError: (error: Error) => void;
  throwAsyncError: (error: Error, delay?: number) => Promise<void>;
  simulateNetworkError: () => void;
  simulateMemoryError: () => void;
  simulateRenderError: () => void;
  createMockError: (type: ErrorCategory, message?: string) => BaseError;
}

// Error metrics
export interface ErrorMetrics {
  count: number;
  rate: number;
  frequency: Record<string, number>;
  trends: Array<{
    timestamp: number;
    count: number;
    rate: number;
  }>;
  impact: {
    usersAffected: number;
    sessionsAffected: number;
    pagesAffected: string[];
  };
}
