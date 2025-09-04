// Asset optimization types
export interface ImageAsset {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  quality?: number;
  priority?: boolean;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
}

export interface VideoAsset {
  src: string;
  poster?: string;
  width?: number;
  height?: number;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  preload?: "none" | "metadata" | "auto";
}

export interface FontAsset {
  family: string;
  src: string;
  weight?: number | string;
  style?: "normal" | "italic";
  display?: "auto" | "block" | "swap" | "fallback" | "optional";
  preload?: boolean;
}

// Asset loading states
export type AssetLoadingState = "idle" | "loading" | "loaded" | "error";

export interface AssetLoadingStatus {
  state: AssetLoadingState;
  progress?: number;
  error?: string;
}

// Image optimization configuration
export interface ImageOptimizationConfig {
  formats: ("webp" | "avif" | "jpeg" | "png")[];
  quality: number;
  sizes: string;
  deviceSizes: number[];
  imageSizes: number[];
  domains?: string[];
  loader?: "default" | "imgix" | "cloudinary" | "akamai" | "custom";
}

// Video optimization configuration
export interface VideoOptimizationConfig {
  formats: ("mp4" | "webm" | "ogg")[];
  quality: "low" | "medium" | "high" | "auto";
  compression: number;
  bitrate?: number;
  fps?: number;
  resolution?: {
    width: number;
    height: number;
  };
}

// Font loading configuration
export interface FontLoadingConfig {
  preload: string[];
  fallback: { [key: string]: string[] };
  display: "auto" | "block" | "swap" | "fallback" | "optional";
  timeout?: number;
}

// Asset preloading configuration
export interface PreloadConfig {
  images: string[];
  videos: string[];
  fonts: string[];
  priority: "high" | "low" | "auto";
}

// Lazy loading configuration
export interface LazyLoadingConfig {
  threshold: number;
  rootMargin: string;
  triggerOnce: boolean;
  placeholder?: string;
  fadeInDuration?: number;
}

// Asset caching configuration
export interface CacheConfig {
  maxAge: number;
  staleWhileRevalidate?: number;
  immutable?: boolean;
  public?: boolean;
}

// CDN configuration
export interface CDNConfig {
  baseUrl: string;
  imageTransforms?: {
    quality?: number;
    format?: "auto" | "webp" | "avif";
    resize?: {
      width?: number;
      height?: number;
      fit?: "cover" | "contain" | "fill" | "inside" | "outside";
    };
  };
}

// Asset manifest for build optimization
export interface AssetManifest {
  images: { [key: string]: ImageAsset };
  videos: { [key: string]: VideoAsset };
  fonts: { [key: string]: FontAsset };
  icons: { [key: string]: string };
  buildHash: string;
  version: string;
}

// Performance metrics for assets
export interface AssetPerformanceMetrics {
  totalSize: number;
  compressedSize: number;
  loadTime: number;
  cacheHitRate: number;
  errorRate: number;
  formats: { [format: string]: number };
}

// Responsive image configuration
export interface ResponsiveImageConfig {
  breakpoints: {
    mobile: number;
    tablet: number;
    desktop: number;
    large: number;
  };
  sizes: {
    mobile: string;
    tablet: string;
    desktop: string;
    large: string;
  };
  quality: {
    mobile: number;
    tablet: number;
    desktop: number;
    large: number;
  };
}

// Icon configuration
export interface IconConfig {
  name: string;
  size?: number | string;
  color?: string;
  strokeWidth?: number;
  fill?: boolean;
  className?: string;
}

// Sprite configuration for SVG icons
export interface SpriteConfig {
  id: string;
  viewBox: string;
  content: string;
  title?: string;
  description?: string;
}

// Asset validation types
export interface AssetValidation {
  required: boolean;
  formats: string[];
  maxSize: number;
  minDimensions?: {
    width: number;
    height: number;
  };
  maxDimensions?: {
    width: number;
    height: number;
  };
  aspectRatio?: number;
}

// Asset processing pipeline
export interface AssetProcessingPipeline {
  input: string;
  output: string;
  transforms: AssetTransform[];
  optimization: AssetOptimization;
}

export interface AssetTransform {
  type: "resize" | "crop" | "rotate" | "flip" | "filter";
  params: { [key: string]: unknown };
}

export interface AssetOptimization {
  compress: boolean;
  quality: number;
  format?: string;
  progressive?: boolean;
  stripMetadata?: boolean;
}

// Asset delivery configuration
export interface AssetDeliveryConfig {
  strategy: "eager" | "lazy" | "priority";
  intersection?: {
    threshold: number;
    rootMargin: string;
  };
  preload?: boolean;
  prefetch?: boolean;
}

// Asset error handling
export interface AssetErrorConfig {
  fallback: string;
  retry: {
    attempts: number;
    delay: number;
    backoff: "linear" | "exponential";
  };
  onError?: (error: Error, asset: string) => void;
}

// Asset monitoring
export interface AssetMonitoringConfig {
  trackLoading: boolean;
  trackErrors: boolean;
  trackPerformance: boolean;
  reportInterval: number;
  onReport?: (metrics: AssetPerformanceMetrics) => void;
}
