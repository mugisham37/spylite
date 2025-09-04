# ScrollSmoother Integration Documentation

## Overview

This document describes the ScrollSmoother integration implemented for the Next.js GSAP website migration. ScrollSmoother provides smooth scrolling behavior identical to the original Vite project.

## Implementation Details

### Core Components

#### 1. ScrollSmootherWrapper Component

- **Location**: `src/components/scroll/ScrollSmootherWrapper.tsx`
- **Purpose**: Manages ScrollSmoother initialization and cleanup
- **Features**:
  - Proper ref-based element targeting
  - Error handling for initialization failures
  - Automatic cleanup on unmount
  - ScrollTrigger refresh after initialization

#### 2. Custom Hooks

- **Location**: `src/hooks/useScrollSmoother.ts`
- **Hooks**:
  - `useScrollSmoother()`: Access to ScrollSmoother instance
  - `useScrollTo()`: Programmatic scrolling with fallbacks

#### 3. Performance Monitoring

- **Location**: `src/utils/scrollPerformance.ts`
- **Features**:
  - FPS monitoring during scroll
  - Device detection
  - Performance testing utilities
  - Cross-browser compatibility checks

### Configuration

#### ScrollSmoother Settings

```typescript
ScrollSmoother.create({
  wrapper: wrapperRef.current,
  content: contentRef.current,
  smooth: 3, // Matches original project
  effects: true, // Enable data-speed and data-lag
  smoothTouch: 0.1, // Touch device optimization
  normalizeScroll: true, // Cross-browser consistency
  ignoreMobileResize: true, // Mobile stability
});
```

#### CSS Requirements

```css
#smooth-wrapper {
  overflow: hidden;
  position: fixed;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
}

#smooth-content {
  overflow: visible;
  width: 100%;
  will-change: transform;
}
```

### Usage Examples

#### Basic Implementation

```tsx
import ScrollSmootherWrapper from "@/components/scroll/ScrollSmootherWrapper";

export default function Page() {
  return (
    <main>
      <ScrollSmootherWrapper>
        <Section1 />
        <Section2 />
        <Section3 />
      </ScrollSmootherWrapper>
    </main>
  );
}
```

#### Programmatic Scrolling

```tsx
import { useScrollTo } from "@/hooks/useScrollSmoother";

function NavigationComponent() {
  const scrollTo = useScrollTo();

  const handleScrollToSection = () => {
    scrollTo(".target-section", true);
  };

  return <button onClick={handleScrollToSection}>Go to Section</button>;
}
```

#### Performance Testing

```tsx
import { testScrollPerformance } from "@/utils/scrollPerformance";

// Run a 10-second performance test
const results = await testScrollPerformance(10000);
console.log("Performance results:", results);
```

### Browser Compatibility

#### Supported Browsers

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

#### Mobile Support

- iOS Safari 12+
- Chrome Mobile 60+
- Samsung Internet 8+

### Performance Optimizations

#### CSS Optimizations

- `will-change: transform` on scroll content
- Hardware acceleration for smooth animations
- Proper overflow handling

#### JavaScript Optimizations

- Ref-based element targeting (no DOM queries)
- Proper cleanup to prevent memory leaks
- Error boundaries for graceful degradation

### Troubleshooting

#### Common Issues

1. **ScrollSmoother not initializing**

   - Ensure wrapper and content elements exist
   - Check for conflicting CSS overflow properties
   - Verify GSAP plugins are registered

2. **Performance issues on mobile**

   - Reduce `smooth` value for mobile devices
   - Disable effects on low-end devices
   - Use `smoothTouch: 0` to disable on touch devices

3. **Scroll position jumping**
   - Ensure proper CSS reset
   - Check for conflicting scroll behaviors
   - Verify ScrollTrigger refresh timing

#### Debug Mode

```typescript
// Enable debug logging
ScrollSmoother.create({
  // ... other options
  onUpdate: (self) => {
    console.log("Scroll position:", self.scrollTop());
  },
});
```

### Testing

#### Manual Testing Checklist

- [ ] Smooth scrolling behavior matches original
- [ ] Programmatic scrolling works correctly
- [ ] Performance is acceptable on target devices
- [ ] No scroll position jumping or glitches
- [ ] Proper cleanup on page navigation

#### Automated Testing

```typescript
// Performance test
const performanceTest = async () => {
  const results = await testScrollPerformance(5000);
  expect(results.performanceMetrics.averageFps).toBeGreaterThan(30);
};
```

### Migration Notes

#### Differences from Original Vite Implementation

1. **Wrapper Structure**: Uses React refs instead of DOM selectors
2. **Error Handling**: Added graceful fallbacks for initialization failures
3. **Performance Monitoring**: Added comprehensive performance tracking
4. **TypeScript**: Full type safety for all ScrollSmoother interactions

#### Requirements Satisfied

- ✅ **1.2**: Identical scroll animation timing and behavior
- ✅ **4.1**: Proper client-side GSAP execution
- ✅ **4.3**: ScrollTrigger cleanup and re-initialization

### Future Enhancements

#### Planned Improvements

1. Adaptive performance based on device capabilities
2. Intersection Observer integration for better performance
3. Custom easing functions for different scroll sections
4. Advanced mobile optimizations

#### Configuration Options

```typescript
interface ScrollSmootherConfig {
  smooth?: number;
  effects?: boolean;
  smoothTouch?: number;
  mobileOptimizations?: boolean;
  performanceMode?: "high" | "balanced" | "battery";
}
```
