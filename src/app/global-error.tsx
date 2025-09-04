"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the global error
    console.error("Global application error:", error);

    // Report to error monitoring service
    if (process.env.NODE_ENV === "production") {
      // In production, you would report this to your monitoring service
      // Example: Sentry.captureException(error);
    }
  }, [error]);

  return (
    <html lang="en">
      <body className="font-antonio antialiased bg-milk text-dark-brown">
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center space-y-8">
            {/* Critical Error Icon */}
            <div className="flex justify-center">
              <div className="w-24 h-24 bg-red/10 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-red"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Error Content */}
            <div className="space-y-4">
              <h1 className="text-5xl font-antonio font-bold text-dark-brown uppercase">
                Critical Error
              </h1>
              <h2 className="text-xl font-antonio font-semibold text-dark-brown">
                Application Failed to Load
              </h2>
              <p className="text-dark-brown/70 font-paragraph leading-relaxed">
                SPYLT encountered a critical error that prevented the
                application from loading properly. This is likely a temporary
                issue.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4">
              <button
                onClick={reset}
                className="px-8 py-4 bg-mid-brown hover:bg-light-brown text-white font-antonio font-bold text-lg rounded-full transition-all duration-200 uppercase"
              >
                Restart Application
              </button>

              <button
                onClick={() => (window.location.href = "/")}
                className="px-8 py-4 border-2 border-mid-brown text-mid-brown hover:bg-mid-brown hover:text-white font-antonio font-semibold rounded-full transition-all duration-200"
              >
                Go to Homepage
              </button>
            </div>

            {/* Error ID for Support */}
            {error.digest && (
              <div className="text-center pt-4 border-t border-dark-brown/10">
                <p className="text-xs text-dark-brown/50 font-paragraph">
                  Error ID: {error.digest}
                </p>
              </div>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}
