# Asset Optimization Infrastructure

This directory contains optimized components for handling images, videos, and fonts in the SPYLT Next.js application. These components are designed to provide maximum performance while maintaining exact visual fidelity with the original Vite.js implementation.

## Components

### OptimizedImage

A wrapper around Next.js Image component that provides:

- Automatic format optimization (WebP/AVIF)
- Responsive image sizing
- Lazy loading with intersection observer
- Loading states and error handling
- Exact visual preservation

**Usage:**

```tsx
import OptimizedImage from "@/components/OptimizedImage";

<OptimizedImage
  src="/images/hero-background.jpg"
  alt="Hero Background"
  width={1920}
  height={1080}
  priority={true}
  quality={90}
  sizes="100vw"
  className="w-full h-screen object-cover"
/>;
```

### OptimizedVideo

A performance-optimized video component that provides:

- Intersection observer for lazy loading
- Automatic play/pause based on visibility
- Loading states and error handling
- Multiple video format support
- Memory-efficient playback

**Usage:**

```tsx
import OptimizedVideo from "@/components/OptimizedVideo";

<OptimizedVideo
  src="/videos/hero-video.mp4"
  poster="/images/hero-poster.jpg"
  autoPlay={true}
  muted={true}
  loop={true}
  className="w-full h-screen object-cover"
  lazy={false} // For hero videos
/>;
```

## Utilities

### Font Utilities (`/utils/fonts.ts`)

Provides consistent font class management:

- `getFontClass()` - Get font class by type
- `getFontClassWithWeight()` - Combine font and weight
- `combineFontClass()` - Add additional classes

### Asset Utilities (`/utils/assets.ts`)

Provides asset optimization helpers:

- `generateImageSizes()` - Create responsive sizes strings
- `imageSizes` - Predefined size configurations
- `videoSettings` - Optimized video configurations
- `buildAssetUrl()` - Consistent asset URL building

## Font Configuration

The application uses two optimized fonts:

1. **Antonio** (Google Font) - For headings and navigation
2. **ProximaNova** (Local Font) - For body text and paragraphs

Both fonts are configured with:

- `display: swap` for optimal loading
- Preloading for critical fonts
- CSS variables for consistent usage

## Performance Features

### Image Optimization

- Automatic WebP/AVIF format selection
- Responsive image sizing
- Priority loading for above-the-fold images
- Lazy loading for below-the-fold content
- Blur placeholders during loading

### Video Optimization

- Intersection observer lazy loading
- Automatic play/pause based on visibility
- Poster images for faster perceived loading
- Memory-efficient cleanup

### Font Optimization

- Preloading of critical fonts
- Font display swap for better UX
- CSS variable system for consistency
- Optimal font subsetting

## Best Practices

1. **Use priority loading** for hero images and above-the-fold content
2. **Implement lazy loading** for below-the-fold assets
3. **Provide appropriate sizes** for responsive images
4. **Use poster images** for videos to improve perceived performance
5. **Follow font hierarchy** using the provided utility functions

## Migration Notes

When migrating from the original Vite.js implementation:

1. Replace `<img>` tags with `<OptimizedImage>`
2. Replace `<video>` tags with `<OptimizedVideo>`
3. Use font utility functions for consistent typography
4. Leverage asset utility functions for URL building

This infrastructure ensures the Next.js migration maintains 100% visual fidelity while gaining significant performance improvements.
