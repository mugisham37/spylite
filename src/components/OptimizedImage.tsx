import Image from "next/image";
import { useState, forwardRef, useEffect, useRef } from "react";
import { usePerformanceContext } from "@/providers/PerformanceProvider";

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
  lazy?: boolean;
  threshold?: number;
  rootMargin?: string;
  loading?: "lazy" | "eager";
  imageType?: "hero" | "card" | "thumbnail" | "full";
  isAboveFold?: boolean;
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
      lazy = true,
      threshold = 0.1,
      rootMargin = "50px",
      loading = "lazy",
      imageType = "card",
      isAboveFold = false,
      ...props
    },
    ref
  ) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [shouldLoad, setShouldLoad] = useState(priority || !lazy);
    const containerRef = useRef<HTMLDivElement>(null);

    // Use performance context for optimal configuration
    const performanceContext = usePerformanceContext();
    const optimalConfig = performanceContext.getOptimalImageConfig(
      isAboveFold,
      imageType
    );

    // Intersection Observer for enhanced lazy loading
    useEffect(() => {
      if (!lazy || shouldLoad || priority) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
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

      const currentContainer = containerRef.current;
      if (currentContainer) {
        observer.observe(currentContainer);
      }

      return () => {
        if (currentContainer) {
          observer.unobserve(currentContainer);
        }
      };
    }, [lazy, threshold, rootMargin, shouldLoad, priority]);

    const handleLoad = () => {
      setIsLoading(false);
      onLoad?.();
    };

    const handleError = () => {
      setIsLoading(false);
      setHasError(true);
      onError?.();
    };

    // Enhanced responsive sizes based on performance context
    const getOptimalSizes = () => {
      if (sizes) return sizes;
      return (
        optimalConfig.sizes ||
        "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      );
    };

    // Use performance-optimized settings
    const finalQuality = quality || optimalConfig.quality || 90;
    const finalPriority = priority || optimalConfig.priority || isAboveFold;
    const finalLoading =
      loading || optimalConfig.loading || (isAboveFold ? "eager" : "lazy");

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
        ref={containerRef}
        className={`relative ${
          isLoading && shouldLoad ? "animate-pulse bg-gray-200" : ""
        }`}
      >
        {shouldLoad ? (
          <Image
            ref={ref}
            src={src}
            alt={alt}
            {...(fill ? { fill: true } : { width: width!, height: height! })}
            priority={finalPriority}
            quality={finalQuality}
            sizes={getOptimalSizes()}
            className={className}
            style={imageStyle}
            placeholder={placeholder}
            loading={finalLoading}
            {...(blurDataURL && { blurDataURL })}
            onLoad={handleLoad}
            onError={handleError}
            {...props}
          />
        ) : (
          // Placeholder while waiting for intersection
          <div
            className={`bg-gray-100 ${className}`}
            style={{
              width: fill ? "100%" : width,
              height: fill ? "100%" : height,
              ...style,
            }}
          />
        )}
      </div>
    );
  }
);

OptimizedImage.displayName = "OptimizedImage";

export default OptimizedImage;
