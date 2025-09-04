"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetOnPropsChange?: boolean;
  resetKeys?: Array<string | number | boolean | null | undefined>;
}

interface State {
  hasError: boolean;
  error?: Error | undefined;
  errorInfo?: ErrorInfo | undefined;
}

class ErrorBoundary extends Component<Props, State> {
  private resetTimeoutId: number | null = null;

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Update state with error info
    this.setState({
      error,
      errorInfo,
    });

    // Log error details
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Report to error monitoring service in production
    if (process.env.NODE_ENV === "production") {
      // Example: Sentry.captureException(error, { contexts: { react: errorInfo } });
    }
  }

  override componentDidUpdate(prevProps: Props) {
    const { resetOnPropsChange, resetKeys } = this.props;
    const { hasError } = this.state;

    // Reset error boundary when resetKeys change
    if (
      hasError &&
      resetOnPropsChange &&
      resetKeys &&
      prevProps.resetKeys &&
      resetKeys.some((key, idx) => key !== prevProps.resetKeys![idx])
    ) {
      this.resetErrorBoundary();
    }
  }

  resetErrorBoundary = () => {
    // Clear any existing timeout
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }

    // Reset state after a brief delay to prevent immediate re-errors
    this.resetTimeoutId = window.setTimeout(() => {
      this.setState({
        hasError: false,
        error: undefined as Error | undefined,
        errorInfo: undefined as ErrorInfo | undefined,
      });
    }, 100);
  };

  override componentWillUnmount() {
    // Clear timeout on unmount
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
  }

  override render() {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      // Custom fallback UI
      if (fallback) {
        return fallback;
      }

      // Default fallback UI
      return (
        <div className="p-8 bg-red/5 border border-red/20 rounded-lg text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-red/10 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-red"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
          </div>

          <h3 className="text-lg font-antonio font-semibold text-dark-brown mb-2">
            Section Error
          </h3>
          <p className="text-dark-brown/70 font-paragraph text-sm mb-4">
            This section encountered an error and couldn't load properly.
          </p>

          {process.env.NODE_ENV === "development" && error && (
            <details className="text-left bg-dark-brown/5 rounded p-3 mb-4 text-xs">
              <summary className="cursor-pointer font-semibold mb-2">
                Error Details
              </summary>
              <pre className="whitespace-pre-wrap overflow-x-auto">
                {error.message}
                {error.stack && `\n\n${error.stack}`}
              </pre>
            </details>
          )}

          <button
            onClick={this.resetErrorBoundary}
            className="px-4 py-2 bg-mid-brown hover:bg-light-brown text-white font-antonio font-semibold text-sm rounded-full transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;

// Hook version for functional components
export function useErrorBoundary() {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const captureError = React.useCallback((error: Error) => {
    setError(error);
  }, []);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return {
    captureError,
    resetError,
  };
}

// Higher-order component wrapper
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, "children">
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${
    Component.displayName || Component.name || "Component"
  })`;

  return WrappedComponent;
}
