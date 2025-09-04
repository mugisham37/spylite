"use client";

import Image from "next/image";
import { useState } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  quality?: number;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
  fill = false,
  sizes,
  quality = 85,
  placeholder = "empty",
  blurDataURL,
  onLoad,
  onError,
}: OptimizedImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  // Generate responsive sizes if not provided
  const responsiveSizes =
    sizes ||
    (fill
      ? "100vw"
      : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw");

  if (hasError) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <span className="text-gray-500 text-sm">Image failed to load</span>
      </div>
    );
  }

  return (
    <div className={`relative ${isLoading ? "animate-pulse bg-gray-200" : ""}`}>
      <Image
        src={src}
        alt={alt}
        {...(fill ? {} : { width, height })}
        fill={fill}
        className={className}
        priority={priority}
        sizes={responsiveSizes}
        quality={quality}
        placeholder={placeholder}
        {...(blurDataURL ? { blurDataURL } : {})}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          objectFit: fill ? "cover" : undefined,
        }}
      />
    </div>
  );
};

export default OptimizedImage;
