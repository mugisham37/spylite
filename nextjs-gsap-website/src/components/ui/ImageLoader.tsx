"use client";

import { useState } from "react";
import Image from "next/image";
import LoadingSpinner from "./LoadingSpinner";

interface ImageLoaderProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  sizes?: string;
  onLoadStart?: () => void;
  onLoadComplete?: () => void;
  onError?: () => void;
}

export default function ImageLoader({
  src,
  alt,
  width,
  height,
  fill = false,
  className = "",
  priority = false,
  sizes,
  onLoadStart,
  onLoadComplete,
  onError,
}: ImageLoaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoadStart = () => {
    setIsLoading(true);
    onLoadStart?.();
  };

  const handleLoadComplete = () => {
    setIsLoading(false);
    onLoadComplete?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  if (hasError) {
    return (
      <div className={`flex-center bg-dark-brown/5 ${className}`}>
        <div className="col-center gap-2 text-center p-4">
          <div className="w-8 h-8 bg-dark-brown/10 rounded-full flex-center">
            <svg
              className="w-4 h-4 text-dark-brown/50"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <p className="font-paragraph text-dark-brown/70 text-xs">
            Image unavailable
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex-center bg-dark-brown/5 z-10">
          <LoadingSpinner size="sm" />
        </div>
      )}

      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        sizes={sizes}
        className={`transition-opacity duration-300 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        onLoadStart={handleLoadStart}
        onLoad={handleLoadComplete}
        onError={handleError}
      />
    </div>
  );
}
