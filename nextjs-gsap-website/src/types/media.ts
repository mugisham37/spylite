// Media optimization and loading types
import { ImageProps } from "next/image";

// Image optimization configuration
export interface ImageOptimizationConfig {
  quality: number;
  format: "webp" | "avif" | "jpeg" | "png" | "auto";
  priority: boolean;
  loading: "lazy" | "eager";
  placeholder: "blur" | "empty";
  blurDataURL?: string;
  sizes?: string;
}

// Video optimization configuration
export interface VideoOptimizationConfig {
  preload: "none" | "metadata" | "auto";
  autoPlay: boolean;
  muted: boolean;
  loop: boolean;
  playsInline: boolean;
  controls: boolean;
  poster?: string;
  lazy: boolean;
  quality: "low" | "medium" | "high" | "auto";
}

// Media loading strategy
export interface MediaLoadingStrategy {
  imageQuality: number;
  videoPreload: "none" | "metadata" | "auto";
  enableLazyLoading: boolean;
  maxConcurrentLoads: number;
  enableImageOptimization: boolean;
  adaptiveLoading: boolean;
  memoryAware: boolean;
}

// Device capabilities
export interface DeviceCapabilities {
  connection: {
    effectiveType: "2g" | "3g" | "4g" | "slow-2g";
    downlink: number;
    rtt: number;
    saveData: boolean;
  };
  memory: {
    deviceMemory: number;
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
  viewport: {
    width: number;
    height: number;
    devicePixelRatio: number;
  };
  support: {
    webp: boolean;
    avif: boolean;
    lazyLoading: boolean;
    intersectionObserver: boolean;
  };
}

// Image dimensions configuration
export interface ImageDimensions {
  width: number;
  height: number;
  aspectRatio: number;
  sizes: string;
  breakpoints: {
    mobile: string;
    tablet: string;
    desktop: string;
  };
}

// Video configuration
export interface VideoConfig {
  src: string;
  poster?: string;
  preload: VideoOptimizationConfig["preload"];
  autoPlay: boolean;
  muted: boolean;
  loop: boolean;
  playsInline: boolean;
  controls: boolean;
  lazy: boolean;
  quality: VideoOptimizationConfig["quality"];
  formats: {
    mp4?: string;
    webm?: string;
    ogg?: string;
  };
}

// Media loader state
export interface MediaLoaderState {
  isLoading: boolean;
  isLoaded: boolean;
  hasError: boolean;
  error?: Error;
  progress: number;
}

// Media cache entry
export interface MediaCacheEntry {
  url: string;
  type: "image" | "video";
  size: number;
  timestamp: number;
  priority: number;
  metadata: {
    width?: number;
    height?: number;
    duration?: number;
    format?: string;
  };
}

// Media cache configuration
export interface MediaCacheConfig {
  maxSize: number; // in bytes
  maxAge: number; // in milliseconds
  maxEntries: number;
  strategy: "lru" | "lfu" | "fifo";
  persistToDisk: boolean;
}

// Responsive image breakpoints
export interface ResponsiveBreakpoints {
  mobile: {
    maxWidth: number;
    quality: number;
    format: string;
  };
  tablet: {
    maxWidth: number;
    quality: number;
    format: string;
  };
  desktop: {
    maxWidth: number;
    quality: number;
    format: string;
  };
  retina: {
    multiplier: number;
    quality: number;
  };
}

// Media optimization result
export interface MediaOptimizationResult {
  optimizedSrc: string;
  originalSrc: string;
  format: string;
  quality: number;
  size: {
    original: number;
    optimized: number;
    savings: number;
  };
  dimensions: {
    width: number;
    height: number;
  };
}

// Extended Next.js Image props with our optimizations
export interface OptimizedImageProps
  extends Omit<ImageProps, "src" | "alt" | "onError"> {
  src: string;
  alt: string;
  optimization?: Partial<ImageOptimizationConfig>;
  lazy?: boolean;
  critical?: boolean;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  fallback?: string;
}

// Video component props
export interface OptimizedVideoProps {
  src: string;
  poster?: string;
  className?: string;
  optimization?: Partial<VideoOptimizationConfig>;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  onProgress?: (progress: number) => void;
  fallback?: React.ReactNode;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  controls?: boolean;
  preload?: VideoOptimizationConfig["preload"];
  lazy?: boolean;
}

// Media loader props
export interface MediaLoaderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  timeout?: number;
  retryCount?: number;
  retryDelay?: number;
}

// Performance metrics for media loading
export interface MediaPerformanceMetrics {
  loadTime: number;
  renderTime: number;
  totalSize: number;
  cacheHitRate: number;
  errorRate: number;
  averageQuality: number;
  bandwidthUsage: number;
}

// Media loading event
export interface MediaLoadingEvent {
  type: "start" | "progress" | "complete" | "error";
  url: string;
  mediaType: "image" | "video";
  progress?: number;
  error?: Error;
  timestamp: number;
  metadata?: {
    size?: number;
    duration?: number;
    format?: string;
  };
}
