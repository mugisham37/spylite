"use client";

import { useEffect, useState } from "react";
import { useErrorHandler } from "../providers/ErrorProvider";

export default function ErrorNotification() {
  const { errors, removeError, hasErrors } = useErrorHandler();
  const [visibleErrors, setVisibleErrors] = useState<string[]>([]);

  useEffect(() => {
    if (hasErrors) {
      const errorKeys = Object.keys(errors);
      setVisibleErrors(errorKeys);

      // Auto-dismiss errors after 5 seconds
      const timer = setTimeout(() => {
        errorKeys.forEach((key) => removeError(key));
        setVisibleErrors([]);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [errors, hasErrors, removeError]);

  if (!hasErrors || visibleErrors.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {visibleErrors.map((key) => (
        <div
          key={key}
          className="bg-red text-milk p-4 rounded-lg shadow-lg max-w-sm animate-slide-in-right"
        >
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-milk mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex-1">
              <p className="font-paragraph text-sm">{errors[key]}</p>
            </div>
            <button
              onClick={() => {
                removeError(key);
                setVisibleErrors((prev) => prev.filter((k) => k !== key));
              }}
              className="text-milk hover:text-milk/80 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
