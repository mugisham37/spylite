# Error Handling and Loading States Documentation

This document outlines the comprehensive error handling and loading state system implemented for the Next.js GSAP website.

## Overview

The error handling system provides:

- **Error Boundaries** for different component types
- **Loading States** for heavy media content
- **Fallback Content** for failed media loads
- **Graceful Degradation** when JavaScript is disabled
- **User-Friendly Error Messages** and recovery options

## Components

### Error Boundaries

#### GSAPErrorBoundary

Handles errors specifically related to GSAP animations.

```tsx
<GSAPErrorBoundary fallback={<CustomFallback />}>
  <AnimatedComponent />
</GSAPErrorBoundary>
```

#### MediaErrorBoundary

Handles errors related to image and video loading.

```tsx
<MediaErrorBoundary mediaType="video">
  <VideoComponent />
</MediaErrorBoundary>
```

#### SectionErrorBoundary

Handles errors at the section level with contextual error messages.

```tsx
<SectionErrorBoundary sectionName="Hero">
  <HeroSection />
</SectionErrorBoundary>
```

### Loading Components

#### LoadingSpinner

A customizable loading spinner component.

```tsx
<LoadingSpinner size="lg" color="dark" />
```

#### MediaLoader

Provides loading states for heavy content with minimum load times.

```tsx
<MediaLoader loadingText="Loading content..." minLoadTime={500}>
  <HeavyComponent />
</MediaLoader>
```

#### VideoLoader

Specialized loader for video content with error handling.

```tsx
<VideoLoader
  src="/video.mp4"
  poster="/poster.jpg"
  onLoadStart={() => console.log("Loading started")}
  onLoadEnd={() => console.log("Loading complete")}
  onError={(error) => console.error("Video error:", error)}
/>
```

#### ImageLoader

Optimized image loader with Next.js Image integration.

```tsx
<ImageLoader
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
  priority
/>
```

### Utility Components

#### SafeSection

A wrapper that combines error boundaries and loading states.

```tsx
<SafeSection sectionName="Hero" showLoader>
  <HeroSection />
</SafeSection>
```

#### NoScriptFallback

Provides fallback content when JavaScript is disabled.

```tsx
<NoScriptFallback fallbackContent={<StaticContent />}>
  <InteractiveContent />
</NoScriptFallback>
```

#### ErrorNotification

Global error notification system.

```tsx
// Automatically included in layout
<ErrorNotification />
```

## Providers

### ErrorProvider

Global error state management.

```tsx
<ErrorProvider>
  <App />
</ErrorProvider>
```

## Hooks

### useErrorHandling

Hook for programmatic error handling.

```tsx
const { handleMediaError, handleAnimationError, clearError } =
  useErrorHandling();

// Handle media errors
handleMediaError("video", "/path/to/video.mp4");

// Handle animation errors
try {
  // GSAP animation code
} catch (error) {
  handleAnimationError("HeroSection", error);
}
```

## Usage Examples

### Basic Section with Error Handling

```tsx
import { SectionErrorBoundary } from "@/components";

function MySection() {
  return (
    <SectionErrorBoundary sectionName="MySection">
      <div>{/* Section content */}</div>
    </SectionErrorBoundary>
  );
}
```

### Media Component with Loading and Error States

```tsx
import { MediaErrorBoundary, VideoLoader } from "@/components";

function VideoSection() {
  return (
    <MediaErrorBoundary mediaType="video">
      <VideoLoader
        src="/hero-video.mp4"
        poster="/hero-poster.jpg"
        className="w-full h-screen object-cover"
      />
    </MediaErrorBoundary>
  );
}
```

### GSAP Animation with Error Handling

```tsx
import { useGSAP } from "@gsap/react";
import { useErrorHandling } from "@/hooks/useErrorHandling";
import { GSAPErrorBoundary } from "@/components";

function AnimatedComponent() {
  const { handleAnimationError } = useErrorHandling();

  useGSAP(() => {
    try {
      // GSAP animation code
      gsap.to(".element", { x: 100, duration: 1 });
    } catch (error) {
      handleAnimationError("AnimatedComponent", error);
    }
  });

  return (
    <GSAPErrorBoundary>
      <div className="element">Animated content</div>
    </GSAPErrorBoundary>
  );
}
```

### Complete Section Implementation

```tsx
import { SafeSection, MediaErrorBoundary, VideoLoader } from "@/components";

function CompleteSection() {
  return (
    <SafeSection
      sectionName="Complete"
      showLoader
      loadingText="Loading amazing content..."
    >
      <section className="min-h-screen">
        <MediaErrorBoundary mediaType="video">
          <VideoLoader
            src="/section-video.mp4"
            poster="/section-poster.jpg"
            className="w-full h-64 object-cover"
          />
        </MediaErrorBoundary>

        <div className="p-8">
          <h2>Section Content</h2>
          <p>
            This section is fully protected with error boundaries and loading
            states.
          </p>
        </div>
      </section>
    </SafeSection>
  );
}
```

## Error Handling Utilities

### Error Logging

```tsx
import {
  logError,
  handleGSAPError,
  handleMediaError,
} from "@/lib/utils/errorHandling";

// Log general errors
try {
  // risky operation
} catch (error) {
  logError(error, { componentStack: "MyComponent" });
}

// Handle GSAP errors
handleGSAPError(error, "HeroSection animation");

// Handle media errors
handleMediaError("image", "/path/to/image.jpg", error);
```

### Safe Operations

```tsx
import { safeAsync, safeSync } from "@/lib/utils/errorHandling";

// Safe async operation
const data = await safeAsync(
  () => fetch("/api/data").then((res) => res.json()),
  { fallback: "data" },
  "API fetch"
);

// Safe sync operation
const result = safeSync(() => JSON.parse(jsonString), {}, "JSON parsing");
```

## Best Practices

1. **Always wrap sections** with `SectionErrorBoundary` or `SafeSection`
2. **Use MediaErrorBoundary** for any media content (images, videos)
3. **Wrap GSAP animations** with `GSAPErrorBoundary`
4. **Provide meaningful error messages** and recovery options
5. **Test error scenarios** during development
6. **Use loading states** for heavy content to improve perceived performance
7. **Implement graceful degradation** for users without JavaScript

## Testing Error Scenarios

To test error handling during development:

1. **Simulate network failures** by blocking requests in DevTools
2. **Use invalid media URLs** to test media error boundaries
3. **Throw errors in GSAP animations** to test animation error boundaries
4. **Disable JavaScript** to test NoScript fallbacks
5. **Use React DevTools** to trigger error boundaries manually

## Performance Considerations

- Error boundaries have minimal performance impact
- Loading states improve perceived performance
- Debounced error reporting prevents spam
- Graceful degradation ensures accessibility
- Proper cleanup prevents memory leaks

## Browser Support

- Error boundaries work in all modern browsers
- Loading states use CSS animations for broad compatibility
- NoScript fallbacks work in all browsers
- Error notifications use modern CSS but degrade gracefully
