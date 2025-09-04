# Performance Optimization Guide

This document outlines the comprehensive performance optimizations implemented in the Next.js GSAP website migration.

## Overview

The performance optimization implementation includes:

1. **Bundle Size Optimization** - Code splitting and dynamic imports
2. **Core Web Vitals Optimization** - LCP, FID, CLS improvements
3. **Animation Performance Testing** - GSAP animation monitoring
4. **Visual Regression Testing** - Pixel-perfect comparison tools
5. **Device-Specific Optimizations** - Adaptive performance based on device capabilities

## Bundle Size Optimization

### Code Splitting Configuration

The webpack configuration in `next.config.ts` implements advanced code splitting:

```typescript
splitChunks: {
  cacheGroups: {
    gsap: {
      name: "gsap",
      test: /[\\/]node_modules[\\/](gsap|@gsap)[\\/]/,
      chunks: "all",
      priority: 30,
    },
    animations: {
      name: "animations",
      test: /[\\/]src[\\/]components[\\/]animations[\\/]/,
      chunks: "all",
      priority: 20,
    },
    vendor: {
      name: "vendor",
      test: /[\\/]node_modules[\\/]/,
      chunks: "all",
      priority: 10,
    },
  },
}
```

### Dynamic Imports

Components are dynamically imported to reduce initial bundle size:

```typescript
// Lazy load section components
export const LazyHeroSection = lazy(
  () => import("@/components/sections/HeroSection")
);

// GSAP plugins dynamic loading
export const loadGSAPPlugins = async () => {
  const [{ ScrollTrigger }, { ScrollSmoother }, { SplitText }] =
    await Promise.all([
      import("gsap/ScrollTrigger"),
      import("gsap/ScrollSmoother"),
      import("gsap/SplitText"),
    ]);
  return { ScrollTrigger, ScrollSmoother, SplitText };
};
```

### Bundle Analysis

Run bundle analysis with:

```bash
npm run build:analyze
```

This generates a visual representation of bundle sizes and identifies optimization opportunities.

## Core Web Vitals Optimization

### Largest Contentful Paint (LCP)

**Target: < 2.5 seconds**

Optimizations implemented:

- Preload critical resources (hero images, fonts)
- Next.js Image component with priority loading
- Font optimization with `display: swap`
- Resource hints (preconnect, preload)

```typescript
// Preload hero image
const heroImage = document.querySelector('img[data-priority="true"]');
if (heroImage && !heroImage.complete) {
  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "image";
  link.href = heroImage.src;
  document.head.appendChild(link);
}
```

### First Input Delay (FID)

**Target: < 100ms**

Optimizations implemented:

- Defer non-critical JavaScript
- Use `requestIdleCallback` for heavy operations
- Optimize GSAP animations for main thread
- Implement animation culling for off-screen elements

### Cumulative Layout Shift (CLS)

**Target: < 0.1**

Optimizations implemented:

- Set explicit dimensions on all media elements
- Use aspect-ratio CSS property for videos
- Reserve space for dynamic content
- Optimize font loading to prevent FOIT/FOUT

```typescript
// Ensure all images have dimensions
const images = document.querySelectorAll("img:not([width]):not([height])");
images.forEach((img) => {
  const element = img as HTMLImageElement;
  if (element.naturalWidth && element.naturalHeight) {
    element.width = element.naturalWidth;
    element.height = element.naturalHeight;
  }
});
```

## Animation Performance Testing

### Performance Monitoring

The `AnimationPerformanceMonitor` class tracks:

- Frame rate (target: 60 FPS)
- Frame drops
- Animation duration
- Memory usage

```typescript
const monitor = new AnimationPerformanceMonitor("hero-animation");
monitor.start();

const animation = gsap.to(".hero-title", { duration: 1, y: 0 });
animation.eventCallback("onComplete", () => {
  const metrics = monitor.stop();
  console.log(`Animation FPS: ${metrics.fps}`);
});
```

### Device Capability Detection

Automatic optimization based on device capabilities:

```typescript
const capabilities = getDeviceCapabilities();

if (capabilities.isLowEndDevice || capabilities.preferReducedMotion) {
  // Reduce animation complexity
  gsap.globalTimeline.timeScale(0.5);
  gsap.config({ force3D: false });
} else {
  // Enable hardware acceleration
  gsap.config({ force3D: true });
}
```

### Performance Budgets

Automated monitoring of performance budgets:

- Max LCP: 2500ms
- Max FID: 100ms
- Max CLS: 0.1
- Max bundle size: 500KB
- Max image size: 200KB per image

## Visual Regression Testing

### Screenshot Comparison

Pixel-perfect comparison between original and migrated versions:

```typescript
const comparison = await compareImages(
  originalScreenshot,
  migratedScreenshot,
  0.95
);

if (comparison.similarity < 0.95) {
  console.warn(
    `Visual regression detected: ${comparison.similarity * 100}% similarity`
  );
}
```

### Multi-Viewport Testing

Tests run across multiple viewports:

- Desktop: 1920x1080
- Tablet: 1024x768
- Mobile: 375x667

### Test Automation

Automated visual regression testing:

```bash
npm run performance:test
```

## Performance Testing Suite

### Running Tests

Access the performance testing suite at `/performance-test` or run:

```bash
npm run performance:test
```

### Test Categories

1. **Animation Performance Tests**

   - Frame rate monitoring
   - Animation timing accuracy
   - GPU acceleration verification

2. **Core Web Vitals Collection**

   - Real-time metrics collection
   - Historical data analysis
   - Performance budget monitoring

3. **Visual Regression Tests**
   - Cross-viewport comparison
   - Animation state verification
   - Layout consistency checks

### Exporting Results

Test results can be exported as JSON for analysis:

- Animation performance metrics
- Web Vitals reports
- Visual regression comparisons
- Device capability information

## Performance Monitoring in Production

### Real-Time Monitoring

The `PerformanceProvider` enables continuous monitoring:

```typescript
<PerformanceProvider autoStart={true} enableOptimizations={true}>
  <App />
</PerformanceProvider>
```

### Analytics Integration

Web Vitals are automatically sent to analytics:

```typescript
// Google Analytics 4 integration
gtag("event", report.name, {
  event_category: "Web Vitals",
  event_label: report.id,
  value: Math.round(report.value),
});
```

## Optimization Recommendations

### Based on Performance Data

The system automatically generates recommendations:

- **Low FPS**: Reduce animation complexity or duration
- **High frame drops**: Implement animation culling
- **Long animations**: Break into smaller chunks
- **Large bundles**: Implement more aggressive code splitting

### Device-Specific Optimizations

- **Low-end devices**: Reduce animation complexity, disable hardware acceleration
- **Slow connections**: Implement progressive loading, reduce media quality
- **Reduced motion preference**: Respect user preferences, provide alternatives

## Monitoring Dashboard

### Key Metrics

The performance dashboard tracks:

- Average FPS across all animations
- Web Vitals scores over time
- Bundle size trends
- Visual regression test results

### Alerts

Automated alerts for:

- Performance budget violations
- Animation performance degradation
- Visual regression failures
- Core Web Vitals threshold breaches

## Best Practices

### Animation Performance

1. Use `transform` and `opacity` for GPU acceleration
2. Implement animation culling for off-screen elements
3. Use `will-change` property judiciously
4. Batch DOM reads and writes
5. Prefer GSAP over CSS animations for complex sequences

### Bundle Optimization

1. Implement route-based code splitting
2. Use dynamic imports for heavy components
3. Tree-shake unused GSAP plugins
4. Optimize third-party dependencies
5. Monitor bundle size in CI/CD

### Core Web Vitals

1. Prioritize above-the-fold content
2. Optimize font loading strategies
3. Use Next.js Image component with proper sizing
4. Implement proper caching strategies
5. Monitor real user metrics (RUM)

## Troubleshooting

### Common Issues

1. **High CLS**: Check for unsized images or fonts causing layout shifts
2. **Poor LCP**: Optimize critical resource loading and server response times
3. **Low animation FPS**: Reduce animation complexity or implement device-based optimization
4. **Large bundles**: Analyze bundle composition and implement more aggressive splitting

### Debug Tools

- Bundle analyzer: `npm run build:analyze`
- Lighthouse: `npm run performance:lighthouse`
- Performance testing suite: `/performance-test`
- Browser DevTools Performance tab
- Web Vitals extension

## Continuous Improvement

### Performance CI/CD

Integrate performance testing into CI/CD:

```yaml
- name: Performance Tests
  run: |
    npm run build
    npm run performance:test
    npm run performance:lighthouse
```

### Monitoring and Alerting

Set up monitoring for:

- Core Web Vitals degradation
- Bundle size increases
- Animation performance regressions
- Visual regression failures

### Regular Audits

Schedule regular performance audits:

- Monthly bundle analysis
- Quarterly visual regression testing
- Continuous Core Web Vitals monitoring
- Annual performance strategy review
