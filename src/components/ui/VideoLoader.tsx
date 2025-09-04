"use client";

import { useState, useRef, useEffect } from "react";
import LoadingSpinner from "./LoadingSpinner";

interface VideoLoaderProps {
  src: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  onLoadStart?: () => void;
  onLoadEnd?: () => void;
  onError?: (error: Event) => void;
}

export default function VideoLoader({
  src,
  poster,
  className = "",
  autoPlay = true,
  muted = true,
  loop = true,
  playsInline = true,
  onLoadStart,
  onLoadEnd,
  onError,
}: VideoLoaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [canPlay, setCanPlay] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadStart = () => {
      setIsLoading(true);
      onLoadStart?.();
    };

    const handleCanPlay = () => {
      setCanPlay(true);
      setIsLoading(false);
      onLoadEnd?.();
    };

    const handleError = (e: Event) => {
      setHasError(true);
      setIsLoading(false);
      onError?.(e);
    };

    video.addEventListener("loadstart", handleLoadStart);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("error", handleError);

    return () => {
      video.removeEventListener("loadstart", handleLoadStart);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("error", handleError);
    };
  }, [onLoadStart, onLoadEnd, onError]);

  if (hasError) {
    return (
      <div className={`flex-center bg-dark-brown/5 ${className}`}>
        <div className="col-center gap-3 text-center p-6">
          <div className="w-12 h-12 bg-dark-brown/10 rounded-full flex-center">
            <svg
              className="w-6 h-6 text-dark-brown/50"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM5 8a1 1 0 011-1h1a1 1 0 010 2H6a1 1 0 01-1-1zm6 1a1 1 0 100 2h3a1 1 0 100-2H11z" />
            </svg>
          </div>
          <p className="font-paragraph text-dark-brown/70 text-xs">
            Video could not be loaded
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex-center bg-dark-brown/5 z-10">
          <div className="col-center gap-2">
            <LoadingSpinner size="md" />
            <p className="font-paragraph text-dark-brown/70 text-xs">
              Loading video...
            </p>
          </div>
        </div>
      )}

      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoPlay && canPlay}
        muted={muted}
        loop={loop}
        playsInline={playsInline}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          canPlay ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
