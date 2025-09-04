"use client";

import { useState, useEffect } from "react";
import LoadingSpinner from "./LoadingSpinner";

interface MediaLoaderProps {
  children: React.ReactNode;
  loadingText?: string;
  minLoadTime?: number;
  className?: string;
}

export default function MediaLoader({
  children,
  loadingText = "Loading content...",
  minLoadTime = 500,
  className = "",
}: MediaLoaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Small delay to ensure smooth transition
      setTimeout(() => setShowContent(true), 100);
    }, minLoadTime);

    // Also set a fallback in case something goes wrong
    const fallbackTimer = setTimeout(() => {
      setIsLoading(false);
      setShowContent(true);
    }, minLoadTime + 2000);

    return () => {
      clearTimeout(timer);
      clearTimeout(fallbackTimer);
    };
  }, [minLoadTime]);

  if (isLoading) {
    return (
      <div className={`flex-center min-h-[200px] ${className}`}>
        <div className="col-center gap-4">
          <LoadingSpinner size="lg" />
          <p className="font-paragraph text-dark-brown/70 text-sm animate-pulse">
            {loadingText}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`transition-opacity duration-300 ${
        showContent ? "opacity-100" : "opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}
