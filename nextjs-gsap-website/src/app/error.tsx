"use client";

import { useEffect } from "react";
import { logError } from "@/lib/utils/errorHandling";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log the error
    logError(error, { componentStack: "Global Error Page" });
  }, [error]);

  return (
    <div className="min-h-screen flex-center bg-main-bg p-8">
      <div className="col-center gap-8 text-center max-w-2xl">
        <div className="col-center gap-4">
          <div className="w-24 h-24 bg-red/10 rounded-full flex-center">
            <svg
              className="w-12 h-12 text-red"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          <h1 className="text-dark-brown font-bold text-4xl">
            Something went wrong
          </h1>

          <p className="font-paragraph text-dark-brown/80 text-lg leading-relaxed">
            We encountered an unexpected error while loading the page. This
            might be a temporary issue with animations or media content.
          </p>
        </div>

        <div className="col-center gap-4">
          <div className="flex gap-4">
            <button
              onClick={reset}
              className="bg-light-brown text-dark-brown px-6 py-3 rounded-full font-bold hover:bg-mid-brown hover:text-milk transition-colors"
            >
              Try Again
            </button>

            <button
              onClick={() => (window.location.href = "/")}
              className="border border-dark-brown text-dark-brown px-6 py-3 rounded-full font-bold hover:bg-dark-brown hover:text-milk transition-colors"
            >
              Go Home
            </button>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="text-dark-brown/70 hover:text-dark-brown text-sm underline transition-colors"
          >
            Refresh the page
          </button>
        </div>

        {process.env.NODE_ENV === "development" && (
          <details className="mt-8 text-left bg-milk p-4 rounded-lg">
            <summary className="font-bold text-dark-brown cursor-pointer mb-2">
              Error Details (Development Only)
            </summary>
            <pre className="text-xs text-dark-brown/80 overflow-auto">
              {error.message}
              {error.stack && (
                <>
                  {"\n\n"}
                  {error.stack}
                </>
              )}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
