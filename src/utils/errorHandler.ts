// Error handling utilities for SPYLT application

export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  sessionId?: string;
  url?: string | undefined;
  userAgent?: string | undefined;
  timestamp?: string;
  additionalData?: Record<string, any>;
}

export interface ErrorReport {
  error: Error;
  context: ErrorContext;
  severity: "low" | "medium" | "high" | "critical";
  category: "ui" | "api" | "animation" | "performance" | "security" | "unknown";
}

class ErrorHandler {
  private static instance: ErrorHandler;
  private errorQueue: ErrorReport[] = [];
  private isReporting = false;

  private constructor() {
    // Set up global error handlers
    this.setupGlobalHandlers();
  }

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  private setupGlobalHandlers() {
    if (typeof window === "undefined") return;

    // Handle unhandled promise rejections
    window.addEventListener("unhandledrejection", (event) => {
      this.captureError(
        new Error(`Unhandled Promise Rejection: ${event.reason}`),
        {
          component: "global",
          action: "unhandledrejection",
          additionalData: { reason: event.reason },
        },
        "high",
        "unknown"
      );
    });

    // Handle global JavaScript errors
    window.addEventListener("error", (event) => {
      this.captureError(
        event.error || new Error(event.message),
        {
          component: "global",
          action: "javascript_error",
          additionalData: {
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
          },
        },
        "high",
        "ui"
      );
    });

    // Handle resource loading errors
    window.addEventListener(
      "error",
      (event) => {
        const target = event.target as HTMLElement;
        if (target && target !== (window as any)) {
          this.captureError(
            new Error(`Resource failed to load: ${target.tagName}`),
            {
              component: "global",
              action: "resource_error",
              additionalData: {
                tagName: target.tagName,
                src: (target as any).src || (target as any).href,
              },
            },
            "medium",
            "performance"
          );
        }
      },
      true
    );
  }

  captureError(
    error: Error,
    context: ErrorContext = {},
    severity: ErrorReport["severity"] = "medium",
    category: ErrorReport["category"] = "unknown"
  ): void {
    const enrichedContext: ErrorContext = {
      ...context,
      url: typeof window !== "undefined" ? window.location.href : undefined,
      userAgent:
        typeof navigator !== "undefined" ? navigator.userAgent : undefined,
      timestamp: new Date().toISOString(),
    };

    const errorReport: ErrorReport = {
      error,
      context: enrichedContext,
      severity,
      category,
    };

    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.group(`🚨 Error [${severity.toUpperCase()}] - ${category}`);
      console.error("Error:", error);
      console.error("Context:", enrichedContext);
      console.groupEnd();
    }

    // Add to queue for reporting
    this.errorQueue.push(errorReport);

    // Process queue
    this.processErrorQueue();
  }

  private async processErrorQueue(): Promise<void> {
    if (this.isReporting || this.errorQueue.length === 0) {
      return;
    }

    this.isReporting = true;

    try {
      const errorsToReport = [...this.errorQueue];
      this.errorQueue = [];

      // In production, send to error monitoring service
      if (process.env.NODE_ENV === "production") {
        await this.reportErrors(errorsToReport);
      }
    } catch (reportingError) {
      console.error("Failed to report errors:", reportingError);
      // Re-add errors to queue for retry
      this.errorQueue.unshift(...this.errorQueue);
    } finally {
      this.isReporting = false;
    }
  }

  private async reportErrors(errors: ErrorReport[]): Promise<void> {
    // This is where you would integrate with your error monitoring service
    // Examples: Sentry, LogRocket, Bugsnag, DataDog, etc.

    try {
      // Example implementation for a generic error reporting service
      const payload = {
        errors: errors.map((report) => ({
          message: report.error.message,
          stack: report.error.stack,
          context: report.context,
          severity: report.severity,
          category: report.category,
        })),
        metadata: {
          userAgent: navigator.userAgent,
          url: window.location.href,
          timestamp: new Date().toISOString(),
        },
      };

      // Replace with your actual error reporting endpoint
      // await fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(payload),
      // });

      console.log("Would report errors:", payload);
    } catch (error) {
      console.error("Error reporting failed:", error);
      throw error;
    }
  }

  // GSAP-specific error handling
  captureGSAPError(
    error: Error,
    animationType: "timeline" | "tween" | "scrolltrigger" | "plugin",
    target?: string,
    additionalContext?: Record<string, any>
  ): void {
    this.captureError(
      error,
      {
        component: "gsap",
        action: `${animationType}_error`,
        additionalData: {
          target,
          animationType,
          ...additionalContext,
        },
      },
      "high",
      "animation"
    );
  }

  // API error handling
  captureAPIError(
    error: Error,
    endpoint: string,
    method: string,
    statusCode?: number,
    responseData?: any
  ): void {
    this.captureError(
      error,
      {
        component: "api",
        action: "request_failed",
        additionalData: {
          endpoint,
          method,
          statusCode,
          responseData,
        },
      },
      statusCode && statusCode >= 500 ? "high" : "medium",
      "api"
    );
  }

  // Performance error handling
  capturePerformanceError(
    metric: string,
    value: number,
    threshold: number,
    additionalContext?: Record<string, any>
  ): void {
    this.captureError(
      new Error(
        `Performance threshold exceeded: ${metric} (${value} > ${threshold})`
      ),
      {
        component: "performance",
        action: "threshold_exceeded",
        additionalData: {
          metric,
          value,
          threshold,
          ...additionalContext,
        },
      },
      "medium",
      "performance"
    );
  }

  // Clear error queue (useful for testing)
  clearQueue(): void {
    this.errorQueue = [];
  }

  // Get current queue size
  getQueueSize(): number {
    return this.errorQueue.length;
  }
}

// Export singleton instance
export const errorHandler = ErrorHandler.getInstance();

// Convenience functions
export const captureError = (
  error: Error,
  context?: ErrorContext,
  severity?: ErrorReport["severity"],
  category?: ErrorReport["category"]
) => errorHandler.captureError(error, context, severity, category);

export const captureGSAPError = (
  error: Error,
  animationType: "timeline" | "tween" | "scrolltrigger" | "plugin",
  target?: string,
  additionalContext?: Record<string, any>
) =>
  errorHandler.captureGSAPError(
    error,
    animationType,
    target,
    additionalContext
  );

export const captureAPIError = (
  error: Error,
  endpoint: string,
  method: string,
  statusCode?: number,
  responseData?: any
) =>
  errorHandler.captureAPIError(
    error,
    endpoint,
    method,
    statusCode,
    responseData
  );

export const capturePerformanceError = (
  metric: string,
  value: number,
  threshold: number,
  additionalContext?: Record<string, any>
) =>
  errorHandler.capturePerformanceError(
    metric,
    value,
    threshold,
    additionalContext
  );

// Error boundary helper - returns error message for component
export const createErrorBoundaryFallback = (componentName: string) => {
  return `${componentName} Error: This component encountered an error and couldn't load properly.`;
};

export default ErrorHandler;
