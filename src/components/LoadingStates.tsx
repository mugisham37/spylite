"use client";

import React from "react";

// Section skeleton loader
export function SectionSkeleton({
  className = "",
  showTitle = true,
  showContent = true,
  animate = true,
}: {
  className?: string;
  showTitle?: boolean;
  showContent?: boolean;
  animate?: boolean;
}) {
  const pulseClass = animate ? "animate-pulse" : "";

  return (
    <div className={`min-h-screen bg-milk p-8 ${className}`}>
      <div className="max-w-7xl mx-auto">
        {showTitle && (
          <div
            className={`h-16 bg-dark-brown/10 rounded-lg mb-8 ${pulseClass}`}
          />
        )}
        {showContent && (
          <div className="space-y-6">
            <div
              className={`h-4 bg-dark-brown/10 rounded w-3/4 ${pulseClass}`}
            />
            <div
              className={`h-4 bg-dark-brown/10 rounded w-1/2 ${pulseClass}`}
            />
            <div className={`h-32 bg-dark-brown/10 rounded-lg ${pulseClass}`} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-24 bg-dark-brown/10 rounded-lg ${pulseClass}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Image loading placeholder
export function ImageSkeleton({
  className = "",
  aspectRatio = "aspect-video",
  animate = true,
}: {
  className?: string;
  aspectRatio?: string;
  animate?: boolean;
}) {
  const pulseClass = animate ? "animate-pulse" : "";

  return (
    <div
      className={`bg-dark-brown/10 rounded-lg ${aspectRatio} ${pulseClass} ${className}`}
    >
      <div className="flex items-center justify-center h-full">
        <svg
          className="w-8 h-8 text-dark-brown/30"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    </div>
  );
}

// Video loading placeholder
export function VideoSkeleton({
  className = "",
  showPlayButton = true,
  animate = true,
}: {
  className?: string;
  showPlayButton?: boolean;
  animate?: boolean;
}) {
  const pulseClass = animate ? "animate-pulse" : "";

  return (
    <div
      className={`bg-dark-brown/10 rounded-lg aspect-video relative ${pulseClass} ${className}`}
    >
      <div className="flex items-center justify-center h-full">
        <svg
          className="w-12 h-12 text-dark-brown/30"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      </div>
      {showPlayButton && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white ml-1"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}

// Text loading placeholder
export function TextSkeleton({
  lines = 3,
  className = "",
  animate = true,
}: {
  lines?: number;
  className?: string;
  animate?: boolean;
}) {
  const pulseClass = animate ? "animate-pulse" : "";

  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`h-4 bg-dark-brown/10 rounded ${pulseClass}`}
          style={{
            width: `${Math.random() * 40 + 60}%`,
          }}
        />
      ))}
    </div>
  );
}

// Card loading placeholder
export function CardSkeleton({
  className = "",
  showImage = true,
  showTitle = true,
  showContent = true,
  animate = true,
}: {
  className?: string;
  showImage?: boolean;
  showTitle?: boolean;
  showContent?: boolean;
  animate?: boolean;
}) {
  const pulseClass = animate ? "animate-pulse" : "";

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-dark-brown/10 overflow-hidden ${className}`}
    >
      {showImage && <div className={`h-48 bg-dark-brown/10 ${pulseClass}`} />}
      <div className="p-6">
        {showTitle && (
          <div className={`h-6 bg-dark-brown/10 rounded mb-4 ${pulseClass}`} />
        )}
        {showContent && (
          <div className="space-y-3">
            <div
              className={`h-4 bg-dark-brown/10 rounded w-full ${pulseClass}`}
            />
            <div
              className={`h-4 bg-dark-brown/10 rounded w-3/4 ${pulseClass}`}
            />
            <div
              className={`h-4 bg-dark-brown/10 rounded w-1/2 ${pulseClass}`}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// Spinner component
export function Spinner({
  size = "md",
  color = "mid-brown",
  className = "",
}: {
  size?: "sm" | "md" | "lg" | "xl";
  color?: string;
  className?: string;
}) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <div
        className={`w-full h-full border-2 border-${color}/20 rounded-full animate-spin`}
      >
        <div
          className={`absolute inset-0 border-2 border-transparent border-t-${color} rounded-full`}
        />
      </div>
    </div>
  );
}

// Progress bar
export function ProgressBar({
  progress,
  className = "",
  showPercentage = false,
  color = "mid-brown",
  backgroundColor = "dark-brown/10",
}: {
  progress: number;
  className?: string;
  showPercentage?: boolean;
  color?: string;
  backgroundColor?: string;
}) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={`w-full ${className}`}>
      <div
        className={`w-full h-2 bg-${backgroundColor} rounded-full overflow-hidden`}
      >
        <div
          className={`h-full bg-${color} transition-all duration-300 ease-out rounded-full`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
      {showPercentage && (
        <div className="text-center mt-2">
          <span className="text-sm font-paragraph text-dark-brown/70">
            {Math.round(clampedProgress)}%
          </span>
        </div>
      )}
    </div>
  );
}

// Dots loading indicator
export function DotsLoader({
  className = "",
  color = "mid-brown",
  size = "md",
}: {
  className?: string;
  color?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    sm: "w-1 h-1",
    md: "w-2 h-2",
    lg: "w-3 h-3",
  };

  return (
    <div className={`flex space-x-1 ${className}`}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`${sizeClasses[size]} bg-${color} rounded-full animate-bounce`}
          style={{
            animationDelay: `${i * 0.1}s`,
            animationDuration: "0.6s",
          }}
        />
      ))}
    </div>
  );
}

// Full page loading overlay
export function LoadingOverlay({
  isVisible,
  message = "Loading...",
  progress,
  className = "",
}: {
  isVisible: boolean;
  message?: string;
  progress?: number;
  className?: string;
}) {
  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 bg-milk/90 backdrop-blur-sm flex items-center justify-center ${className}`}
    >
      <div className="text-center space-y-6 max-w-sm mx-auto px-6">
        <div className="flex justify-center">
          <Spinner size="xl" />
        </div>

        <div>
          <h3 className="text-xl font-antonio font-semibold text-dark-brown mb-2">
            {message}
          </h3>
          {progress !== undefined && (
            <ProgressBar progress={progress} showPercentage className="mt-4" />
          )}
        </div>
      </div>
    </div>
  );
}

// Lazy loading wrapper
export function LazyWrapper({
  children,
  fallback,
  className = "",
  threshold = 0.1,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
  threshold?: number;
}) {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  React.useEffect(() => {
    if (isVisible) {
      // Simulate loading delay
      const timer = setTimeout(() => setIsLoaded(true), 100);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isVisible]);

  return (
    <div ref={ref} className={className}>
      {isLoaded ? children : fallback || <SectionSkeleton />}
    </div>
  );
}
