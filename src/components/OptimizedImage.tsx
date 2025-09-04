import Image from "next/image";
import { useState, forwardRef } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  className?: string;
  fill?: boolean;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
  objectPosition?: string;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
  style?: React.CSSProperties;
}

const OptimizedImage = forwardRef<HTMLImageElement, OptimizedImageProps>(
  (
    {
      src,
      alt,
      width,
      height,
      priority = false,
      quality = 90,
      sizes,
      className = "",
      fill = false,
      objectFit = "cover",
      objectPosition = "center",
      placeholder = "empty",
      blurDataURL,
      onLoad,
      onError,
      style,
      ...props
    },
    ref
  ) => {
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

    // Default sizes for responsive images if not provided
    const defaultSizes =
      sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw";

    // Combine styles for exact visual preservation
    const imageStyle: React.CSSProperties = {
      objectFit,
      objectPosition,
      ...style,
    };

    if (hasError) {
      return (
        <div
          className={`bg-gray-200 flex items-center justify-center ${className}`}
          style={{
            width: fill ? "100%" : width,
            height: fill ? "100%" : height,
            ...style,
          }}
        >
          <span className="text-gray-500 text-sm">Image failed to load</span>
        </div>
      );
    }

    return (
      <div
        className={`relative ${isLoading ? "animate-pulse bg-gray-200" : ""}`}
      >
        <Image
          ref={ref}
          src={src}
          alt={alt}
          {...(fill ? { fill: true } : { width: width!, height: height! })}
          priority={priority}
          quality={quality}
          sizes={defaultSizes}
          className={className}
          style={imageStyle}
          placeholder={placeholder}
          {...(blurDataURL && { blurDataURL })}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
      </div>
    );
  }
);

OptimizedImage.displayName = "OptimizedImage";

export default OptimizedImage;
