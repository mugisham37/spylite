/**
 * Error monitoring and reporting utilities
 */

import React, { Component } from "react";
import { trackError } from "./analytics";

// Error types for categorization
export enum ErrorType {
  JAVASCRIPT = "javascript",
  NETWORK = "network",
  GSAP = "gsap",
  RENDER = "render",
  PERFORMANCE = "performance",
}

// Error severity levels
export enum ErrorSeverity {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

// Error context interface
export interface ErrorContext {
  type: ErrorType;
  severity: ErrorSeverity;
  component?: string;
  action?: string;
  userId?: string;
  sessionId?: string;
  url: string;
  userAgent: string;
  timestamp: number;
  additionalData?: Record<string, any>;
}

// Error monitoring configuration
const isErrorMonitoringEnabled = () => {
  return (
    process.env.NODE_ENV === "production" &&
    process.env.NEXT_PUBLIC_ENABLE_ERROR_REPORTING === "true"
  );
};

// Initialize error monitoring
export const initializeErrorMonitoring = () => {
  if (!isErrorMonitoringEnabled() || typeof window === "undefined") return;

  // Global error handler
  window.addEventListener("error", (event) => {
    reportError(event.error, {
      type: ErrorType.JAVASCRIPT,
      severity: ErrorSeverity.HIGH,
      additionalData: {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        message: event.message,
      },
    });
  });

  // Unhandled promise rejection handler
  window.addEventListener("unhandledrejection", (event) => {
    reportError(new Error(event.reason), {
      type: ErrorType.JAVASCRIPT,
      severity: ErrorSeverity.HIGH,
      additionalData: {
        reason: event.reason,
        promise: event.promise,
      },
    });
  });

  // Network error monitoring
  const originalFetch = window.fetch;
  window.fetch = async (...args) => {
    try {
      const response = await originalFetch(...args);
      if (!response.ok) {
        reportError(
          new Error(`Network error: ${response.status} ${response.statusText}`),
          {
            type: ErrorType.NETWORK,
            severity:
              response.status >= 500
                ? ErrorSeverity.HIGH
                : ErrorSeverity.MEDIUM,
            additionalData: {
              url: args[0],
              status: response.status,
              statusText: response.statusText,
            },
          }
        );
      }
      return response;
    } catch (error) {
      reportError(error as Error, {
        type: ErrorType.NETWORK,
        severity: ErrorSeverity.HIGH,
        additionalData: {
          url: args[0],
        },
      });
      throw error;
    }
  };

  console.log("Error monitoring initialized");
};

// Report error function
export const reportError = (
  error: Error,
  context: Partial<ErrorContext> = {}
) => {
  if (!isErrorMonitoringEnabled()) {
    // In development, just log to console
    console.error("Error reported:", error, context);
    return;
  }

  const errorContext: ErrorContext = {
    type: ErrorType.JAVASCRIPT,
    severity: ErrorSeverity.MEDIUM,
    url: typeof window !== "undefined" ? window.location.href : "",
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
    timestamp: Date.now(),
    ...context,
  };

  // Track error in analytics
  trackError(error, errorContext);

  // Send to external error monitoring service (Sentry, LogRocket, etc.)
  if (typeof window !== "undefined" && window.Sentry) {
    window.Sentry.captureException(error, {
      tags: {
        type: errorContext.type,
        severity: errorContext.severity,
        component: errorContext.component,
      },
      extra: errorContext.additionalData,
      level: getSentryLevel(errorContext.severity),
    });
  }

  // Log to console in development
  if (process.env.NODE_ENV === "development") {
    console.error("Error reported:", error, errorContext);
  }
};

// GSAP-specific error reporting
export const reportGSAPError = (
  error: Error,
  animationName?: string,
  target?: string
) => {
  reportError(error, {
    type: ErrorType.GSAP,
    severity: ErrorSeverity.MEDIUM,
    component: "GSAP",
    additionalData: {
      animationName,
      target,
    },
  });
};

// Performance error reporting
export const reportPerformanceError = (
  metric: string,
  value: number,
  threshold: number
) => {
  reportError(new Error(`Performance threshold exceeded: ${metric}`), {
    type: ErrorType.PERFORMANCE,
    severity: ErrorSeverity.MEDIUM,
    additionalData: {
      metric,
      value,
      threshold,
      exceedBy: value - threshold,
    },
  });
};

// React error boundary helper
export const reportReactError = (
  error: Error,
  errorInfo: any,
  componentStack?: string
) => {
  reportError(error, {
    type: ErrorType.RENDER,
    severity: ErrorSeverity.HIGH,
    component: "React",
    additionalData: {
      componentStack,
      errorBoundary: true,
      ...errorInfo,
    },
  });
};

// Network timeout error
export const reportNetworkTimeout = (url: string, timeout: number) => {
  reportError(new Error(`Network request timeout: ${url}`), {
    type: ErrorType.NETWORK,
    severity: ErrorSeverity.MEDIUM,
    additionalData: {
      url,
      timeout,
    },
  });
};

// Convert error severity to Sentry level
const getSentryLevel = (severity: ErrorSeverity): string => {
  switch (severity) {
    case ErrorSeverity.LOW:
      return "info";
    case ErrorSeverity.MEDIUM:
      return "warning";
    case ErrorSeverity.HIGH:
      return "error";
    case ErrorSeverity.CRITICAL:
      return "fatal";
    default:
      return "error";
  }
};

// Error boundary component helper
export const withErrorBoundary = (
  WrappedComponent: React.ComponentType<any>
) => {
  return class ErrorBoundaryWrapper extends Component<
    any,
    { hasError: boolean }
  > {
    constructor(props: any) {
      super(props);
      this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
      return { hasError: true };
    }

    override componentDidCatch(error: Error, errorInfo: any) {
      reportReactError(error, errorInfo);
    }

    override render() {
      if (this.state.hasError) {
        return React.createElement(
          "div",
          { className: "error-fallback p-4 text-center" },
          React.createElement(
            "h2",
            { className: "text-xl font-bold mb-2" },
            "Something went wrong"
          ),
          React.createElement(
            "p",
            { className: "text-gray-600" },
            "Please refresh the page or try again later."
          )
        );
      }

      return React.createElement(WrappedComponent, this.props);
    }
  };
};

// Performance monitoring
export const monitorPerformance = () => {
  if (!isErrorMonitoringEnabled() || typeof window === "undefined") return;

  // Monitor Core Web Vitals
  if ("web-vitals" in window) {
    // This would be imported from web-vitals library if installed
    // For now, we'll use basic performance monitoring
  }

  // Monitor long tasks
  if ("PerformanceObserver" in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            // Long task threshold
            reportPerformanceError("long_task", entry.duration, 50);
          }
        }
      });
      observer.observe({ entryTypes: ["longtask"] });
    } catch (error) {
      console.warn("Performance monitoring not supported:", error);
    }
  }
};

// Session tracking
let sessionId: string | null = null;

export const getSessionId = (): string => {
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 11)}`;
  }
  return sessionId;
};

// User ID tracking (for authenticated users)
let userId: string | null = null;

export const setUserId = (id: string) => {
  userId = id;
};

export const getUserId = (): string | null => {
  return userId;
};
