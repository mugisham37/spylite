"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-antonio font-bold">
          Something went wrong!
        </h2>
        <p className="text-gray-300">
          We apologize for the inconvenience. Please try again.
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-primary-600 hover:bg-primary-700 rounded-lg font-semibold transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
