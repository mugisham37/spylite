"use client";

import { useEffect, useRef, useState, forwardRef } from "react";
import { usePerformanceContext } from "@/providers/PerformanceProvider";

interface OptimizedVideoProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  controls?: boolean;
  preload?: "none" | "metadata" | "auto";
  className?: string;
  style?: React.CSSProperties;
  width?: number;
  height?: number;
  onLoad?: () => void;
  onError?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  lazy?: boolean;
  threshold?: number;
  rootMargin?: string;
  quality?: "low" | "medium" | "high";
  enablePreload?: boolean;
  isAboveFold?: boolean;
}

const OptimizedVideo = forwardRef<HTMLVideoElement, OptimizedVideoProps>(
  (
    {
      src,
      poster,
      autoPlay = false,
      muted = true,
      loop = false,
      playsInline = true,
      controls = false,
      preload = "metadata",
      className = "",
      style,
      width,
      height,
      onLoad,
      onError,
      onPlay,
      onPause,
      onEnded,
      lazy = true,
      threshold = 0.1,
      rootMargin = "50px",
      quality = "medium",
      enablePreload = true,
      isAboveFold = false,
      ...props
    },
    ref
  ) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isInView, setIsInView] = useState(!lazy);
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [shouldLoad, setShouldLoad] = useState(!lazy);
    const [isLowBandwidth, setIsLowBandwidth] = useState(false);

    // Use performance context for optimal configuration
    const performanceContext = usePerformanceContext();
    const optimalConfig = performanceContext.getOptimalVideoConfig(isAboveFold);

    // Detect connection quality for adaptive loading
    useEffect(() => {
      if (typeof navigator !== "undefined" && "connection" in navigator) {
        const connection = (navigator as any).connection;
        if (connection) {
          const effectiveType = connection.effectiveType;
          setIsLowBandwidth(["slow-2g", "2g", "3g"].includes(effectiveType));
        }
      }
    }, []);

    // Intersection Observer for enhanced lazy loading
    useEffect(() => {
      if (!lazy || shouldLoad) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsInView(true);
              setShouldLoad(true);
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold,
          rootMargin,
        }
      );

      const currentVideoRef = videoRef.current;
      if (currentVideoRef) {
        observer.observe(currentVideoRef);
      }

      return () => {
        if (currentVideoRef) {
          observer.unobserve(currentVideoRef);
        }
      };
    }, [lazy, threshold, rootMargin, shouldLoad]);

    // Handle video events
    const handleLoadedData = () => {
      setIsLoaded(true);
      onLoad?.();
    };

    const handleError = () => {
      setHasError(true);
      onError?.();
    };

    const handlePlay = () => {
      onPlay?.();
    };

    const handlePause = () => {
      onPause?.();
    };

    const handleEnded = () => {
      onEnded?.();
    };

    // Combine refs
    useEffect(() => {
      if (ref && videoRef.current) {
        if (typeof ref === "function") {
          ref(videoRef.current);
        } else {
          ref.current = videoRef.current;
        }
      }
    }, [ref]);

    if (hasError) {
      return (
        <div
          className={`bg-gray-200 flex items-center justify-center ${className}`}
          style={{
            width: width || "100%",
            height: height || "auto",
            ...style,
          }}
        >
          <span className="text-gray-500 text-sm">Video failed to load</span>
        </div>
      );
    }

    return (
      <div className="relative">
        {!isLoaded && shouldLoad && (
          <div
            className={`absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center ${className}`}
            style={style}
          >
            <span className="text-gray-500 text-sm">Loading video...</span>
          </div>
        )}

        <video
          ref={videoRef}
          className={className}
          style={style}
          width={width}
          height={height}
          autoPlay={
            (autoPlay || optimalConfig.autoPlay) && isInView && !isLowBandwidth
          }
          muted={muted}
          loop={loop}
          playsInline={playsInline}
          controls={controls}
          preload={
            shouldLoad
              ? isLowBandwidth
                ? "none"
                : optimalConfig.preload || preload
              : "none"
          }
          poster={poster}
          onLoadedData={handleLoadedData}
          onError={handleError}
          onPlay={handlePlay}
          onPause={handlePause}
          onEnded={handleEnded}
          {...props}
        >
          {shouldLoad && (
            <>
              <source src={src} type="video/mp4" />
              Your browser does not support the video tag.
            </>
          )}
        </video>
      </div>
    );
  }
);

OptimizedVideo.displayName = "OptimizedVideo";

export default OptimizedVideo;
