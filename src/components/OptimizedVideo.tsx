"use client";

import { useEffect, useRef, useState, forwardRef } from "react";

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
      ...props
    },
    ref
  ) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isInView, setIsInView] = useState(!lazy);
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [shouldLoad, setShouldLoad] = useState(!lazy);

    // Intersection Observer for lazy loading
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
          autoPlay={autoPlay && isInView}
          muted={muted}
          loop={loop}
          playsInline={playsInline}
          controls={controls}
          preload={shouldLoad ? preload : "none"}
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
