/**
 * Error handling utilities for the GSAP website
 */

export interface ErrorInfo {
  componentStack: string;
  errorBoundary?: string;
}

export interface ErrorReport {
  message: string;
  stack?: string | undefined;
  componentStack?: string | undefined;
  timestamp: number;
  userAgent: string;
  url: string;
}

/**
 * Logs errors to console with structured format
 */
export function logError(error: Error, errorInfo?: ErrorInfo): void {
  const report: ErrorReport = {
    message: error.message,
    stack: error.stack,
    componentStack: errorInfo?.componentStack,
    timestamp: Date.now(),
    userAgent:
      typeof window !== "undefined" ? window.navigator.userAgent : "SSR",
    url: typeof window !== "undefined" ? window.location.href : "SSR",
  };

  console.group("🚨 Error Report");
  console.error("Message:", report.message);
  console.error("Stack:", report.stack);
  if (report.componentStack) {
    console.error("Component Stack:", report.componentStack);
  }
  console.error("Timestamp:", new Date(report.timestamp).toISOString());
  console.error("URL:", report.url);
  console.error("User Agent:", report.userAgent);
  console.groupEnd();
}

/**
 * Handles GSAP-specific errors with context
 */
export function handleGSAPError(error: Error, context: string): void {
  const enhancedError = new Error(`GSAP Error in ${context}: ${error.message}`);
  if (error.stack) {
    enhancedError.stack = error.stack;
  }

  logError(enhancedError);

  // In development, throw the error to help with debugging
  if (process.env.NODE_ENV === "development") {
    throw enhancedError;
  }
}

/**
 * Handles media loading errors
 */
export function handleMediaError(
  type: "image" | "video",
  src: string,
  error: Event | Error
): void {
  const errorMessage =
    error instanceof Error ? error.message : `Failed to load ${type}`;

  const mediaError = new Error(`Media Error: ${errorMessage} (${src})`);

  logError(mediaError);
}

/**
 * Creates a safe wrapper for async operations
 */
export function safeAsync<T>(
  operation: () => Promise<T>,
  fallback: T,
  context?: string
): Promise<T> {
  return operation().catch((error) => {
    logError(error, {
      componentStack: context || "Unknown async operation",
    });
    return fallback;
  });
}

/**
 * Creates a safe wrapper for synchronous operations
 */
export function safeSync<T>(
  operation: () => T,
  fallback: T,
  context?: string
): T {
  try {
    return operation();
  } catch (error) {
    logError(error as Error, {
      componentStack: context || "Unknown sync operation",
    });
    return fallback;
  }
}

/**
 * Debounced error reporter to prevent spam
 */
class DebouncedErrorReporter {
  private errors = new Map<string, number>();
  private readonly debounceTime = 1000; // 1 second

  report(error: Error, context?: string): void {
    const key = `${error.message}-${context}`;
    const now = Date.now();
    const lastReported = this.errors.get(key) || 0;

    if (now - lastReported > this.debounceTime) {
      logError(error, { componentStack: context || "Unknown" });
      this.errors.set(key, now);
    }
  }
}

export const debouncedErrorReporter = new DebouncedErrorReporter();
