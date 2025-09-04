"use client";

import { useEffect, useState } from "react";

// Remove unused interface - using React's ErrorInfo type

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [errorDetails, setErrorDetails] = useState<{
    message: string;
    stack?: string | undefined;
    digest?: string | undefined;
  }>({
    message: "An unexpected error occurred",
  });

  const [isReporting, setIsReporting] = useState(false);

  useEffect(() => {
    // Extract error details
    setErrorDetails({
      message: error.message || "An unexpected error occurred",
      stack: error.stack,
      digest: error.digest,
    });

    // Log the error to console in development
    if (process.env.NODE_ENV === "development") {
      console.group("🚨 Application Error");
      console.error("Error:", error);
      console.error("Message:", error.message);
      console.error("Stack:", error.stack);
      if (error.digest) {
        console.error("Digest:", error.digest);
      }
      console.groupEnd();
    }

    // Report error to monitoring service (placeholder)
    const reportError = async () => {
      try {
        // In a real app, you would send this to your error monitoring service
        // Example: Sentry, LogRocket, Bugsnag, etc.
        if (process.env.NODE_ENV === "production") {
          // await errorReportingService.captureException(error);
        }
      } catch (reportingError) {
        console.error("Failed to report error:", reportingError);
      }
    };

    reportError();
  }, [error]);

  const handleReset = async () => {
    setIsReporting(true);

    // Add a small delay to show loading state
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      reset();
    } catch (resetError) {
      console.error("Error during reset:", resetError);
    } finally {
      setIsReporting(false);
    }
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-milk px-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Error Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-red/10 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-red"
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

        {/* Error Content */}
        <div className="space-y-4">
          <h1 className="text-4xl font-antonio font-bold text-dark-brown uppercase">
            Oops!
          </h1>
          <h2 className="text-xl font-antonio font-semibold text-dark-brown">
            Something went wrong
          </h2>
          <p className="text-dark-brown/70 font-paragraph leading-relaxed">
            We encountered an unexpected error while loading SPYLT. Don't worry,
            our team has been notified and we're working on a fix.
          </p>

          {/* Error Details (Development Only) */}
          {process.env.NODE_ENV === "development" && (
            <details className="text-left bg-dark-brown/5 rounded-lg p-4 mt-4">
              <summary className="cursor-pointer font-paragraph font-semibold text-dark-brown mb-2">
                Error Details (Development)
              </summary>
              <div className="space-y-2 text-sm font-mono">
                <div>
                  <strong>Message:</strong> {errorDetails.message}
                </div>
                {errorDetails.digest && (
                  <div>
                    <strong>Digest:</strong> {errorDetails.digest}
                  </div>
                )}
                {errorDetails.stack && (
                  <div>
                    <strong>Stack:</strong>
                    <pre className="mt-1 text-xs overflow-x-auto whitespace-pre-wrap">
                      {errorDetails.stack}
                    </pre>
                  </div>
                )}
              </div>
            </details>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleReset}
            disabled={isReporting}
            className="px-6 py-3 bg-mid-brown hover:bg-light-brown text-white font-antonio font-semibold rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isReporting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Retrying...
              </>
            ) : (
              "Try Again"
            )}
          </button>

          <button
            onClick={handleReload}
            className="px-6 py-3 border-2 border-mid-brown text-mid-brown hover:bg-mid-brown hover:text-white font-antonio font-semibold rounded-full transition-all duration-200"
          >
            Reload Page
          </button>
        </div>

        {/* Support Information */}
        <div className="text-center pt-4 border-t border-dark-brown/10">
          <p className="text-sm text-dark-brown/60 font-paragraph">
            Need help? Contact our support team at{" "}
            <a
              href="mailto:support@spylt.com"
              className="text-mid-brown hover:text-light-brown underline"
            >
              support@spylt.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
