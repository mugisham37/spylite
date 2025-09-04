"use client";

import { useRef, useState, useEffect, forwardRef } from "react";

interface OptimizedVideoProps {
  src: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  controls?: boolean;
  preload?: "none" | "metadata" | "auto";
  lazy?: boolean;
  onLoad?: () => void;
  onError?: (error: React.SyntheticEvent<HTMLVideoElement, Event>) => void;
  onPlay?: () => void;
  onPause?: () => void;
  width?: number;
  height?: number;
}

const OptimizedVideo = forwardRef<HTMLVideoElement, OptimizedVideoProps>(
  (
    {
      src,
      poster,
      className = "",
      autoPlay = false,
      muted = true,
      loop = false,
      playsInline = true,
      controls = false,
      preload = "metadata",
      lazy = true,
      onLoad,
      onError,
      onPlay,
      onPause,
      width,
      height,
    },
    ref
  ) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [isIntersecting, setIsIntersecting] = useState(!lazy);

    // Combine refs
    const combinedRef = (node: HTMLVideoElement) => {
      videoRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    // Intersection Observer for lazy loading
    useEffect(() => {
      if (!lazy || isIntersecting) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) {
            setIsIntersecting(true);
            observer.disconnect();
          }
        },
        {
          rootMargin: "50px",
          threshold: 0.1,
        }
      );

      if (videoRef.current) {
        observer.observe(videoRef.current);
      }

      return () => observer.disconnect();
    }, [lazy, isIntersecting]);

    const handleLoadedMetadata = () => {
      setIsLoading(false);
      onLoad?.();
    };

    const handleError = (
      error: React.SyntheticEvent<HTMLVideoElement, Event>
    ) => {
      setIsLoading(false);
      setHasError(true);
      onError?.(error);
    };

    const handlePlay = () => {
      onPlay?.();
    };

    const handlePause = () => {
      onPause?.();
    };

    if (hasError) {
      return (
        <div
          className={`bg-gray-200 flex items-center justify-center ${className}`}
          style={{ width, height }}
        >
          <span className="text-gray-500 text-sm">Video failed to load</span>
          {poster && (
            <img
              src={poster}
              alt="Video poster"
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
        </div>
      );
    }

    return (
      <div
        className={`relative ${isLoading ? "animate-pulse bg-gray-200" : ""}`}
      >
        {isIntersecting && (
          <video
            ref={combinedRef}
            src={src}
            poster={poster}
            className={className}
            autoPlay={autoPlay}
            muted={muted}
            loop={loop}
            playsInline={playsInline}
            controls={controls}
            preload={preload}
            width={width}
            height={height}
            onLoadedMetadata={handleLoadedMetadata}
            onError={handleError}
            onPlay={handlePlay}
            onPause={handlePause}
            style={{
              objectFit: "cover",
            }}
          />
        )}

        {/* Loading placeholder */}
        {isLoading && poster && (
          <img
            src={poster}
            alt="Video poster"
            className={`absolute inset-0 w-full h-full object-cover ${className}`}
          />
        )}
      </div>
    );
  }
);

OptimizedVideo.displayName = "OptimizedVideo";

export default OptimizedVideo;
