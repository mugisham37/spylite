# Design Document

## Overview

This design outlines the migration strategy for transforming a sophisticated Vite React GSAP website into a high-performance Next.js application. The migration preserves all visual elements, animations, and user experience while leveraging Next.js advanced features including App Router, image optimization, font optimization, and SSR/SSG capabilities.

The current project features:

- Complex GSAP animations with ScrollTrigger and ScrollSmoother
- Multiple video backgrounds and interactive elements
- Custom Tailwind CSS configuration with extensive theming
- Responsive design with mobile-specific optimizations
- Seven main sections: Hero, Message, Flavor, Nutrition, Benefits, Testimonials, Footer

## Architecture

### Project Structure

```
nextjs-gsap-website/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── components/
├── components/
│   ├── ui/
│   ├── sections/
│   └── animations/
├── lib/
│   ├── constants/
│   ├── utils/
│   └── gsap/
├── public/
│   ├── images/
│   ├── videos/
│   └── fonts/
├── types/
└── hooks/
```

### Technology Stack

- **Framework:** Next.js 14+ with App Router
- **Styling:** Tailwind CSS v4 with custom theme preservation
- **Animations:** GSAP with @gsap/react integration
- **TypeScript:** Full type safety implementation
- **Image Optimization:** Next.js Image component
- **Font Optimization:** Next.js Font optimization
- **Video Handling:** Optimized video loading strategies

## Components and Interfaces

### Core Layout Components

#### RootLayout

```typescript
interface RootLayoutProps {
  children: React.ReactNode;
}
```

- Implements Next.js App Router layout
- Configures global fonts and metadata
- Sets up GSAP plugins registration
- Handles global CSS imports

#### GSAPProvider

```typescript
interface GSAPProviderProps {
  children: React.ReactNode;
}
```

- Manages GSAP plugin registration
- Handles client-side only GSAP initialization
- Provides GSAP context to child components

### Section Components

#### HeroSection

```typescript
interface HeroSectionProps {
  title: string;
  subtitle: string;
  description: string;
  videoSrc?: string;
  imageSrc?: string;
}
```

- Implements hero animations with SplitText
- Handles responsive video/image switching
- Manages scroll-triggered transformations

#### FlavorSection

```typescript
interface FlavorItem {
  name: string;
  color: string;
  rotation: string;
}

interface FlavorSectionProps {
  flavors: FlavorItem[];
}
```

- Implements horizontal scroll animation
- Manages flavor slider with GSAP ScrollTrigger
- Handles responsive behavior for mobile/tablet

#### TestimonialSection

```typescript
interface TestimonialCard {
  src: string;
  rotation: string;
  name: string;
  img: string;
  translation?: string;
}

interface TestimonialSectionProps {
  cards: TestimonialCard[];
}
```

- Implements pinned scroll animation
- Manages video card carousel
- Handles responsive testimonial display

### Animation Components

#### ClipPathTitle

```typescript
interface ClipPathTitleProps {
  text: string;
  className?: string;
  animationDelay?: number;
}
```

- Implements clip-path reveal animations
- Manages text splitting and staggered animations
- Provides reusable title animation component

#### VideoPinSection

```typescript
interface VideoPinSectionProps {
  videoSrc: string;
  posterSrc?: string;
  className?: string;
}
```

- Implements video pinning with ScrollTrigger
- Manages video playback controls
- Handles responsive video behavior

### Utility Interfaces

#### MediaQuery Hook

```typescript
interface UseMediaQueryResult {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}
```

#### GSAP Animation Config

```typescript
interface GSAPConfig {
  scrollSmoother: {
    smooth: number;
    effects: boolean;
  };
  scrollTrigger: {
    defaults: ScrollTriggerConfig;
  };
}
```

## Data Models

### Constants Structure

```typescript
// Flavor data model
interface FlavorData {
  name: string;
  color: "brown" | "red" | "blue" | "orange" | "white" | "black";
  rotation: string;
}

// Nutrition data model
interface NutrientData {
  label: string;
  amount: string;
}

// Testimonial card data model
interface CardData {
  src: string;
  rotation: string;
  name: string;
  img: string;
  translation?: string;
}
```

### Configuration Models

```typescript
// Tailwind theme configuration
interface CustomTheme {
  colors: {
    black: string;
    "main-bg": string;
    white: string;
    "dark-brown": string;
    "mid-brown": string;
    "light-brown": string;
    "red-brown": string;
    "yellow-brown": string;
    "milk-yellow": string;
    red: string;
    milk: string;
  };
  fontFamily: {
    sans: string[];
    paragraph: string[];
  };
}

// GSAP animation configuration
interface AnimationConfig {
  timeline: GSAPTimelineConfig;
  scrollTrigger: ScrollTriggerConfig;
  splitText: SplitTextConfig;
}
```

## Error Handling

### GSAP Error Boundaries

- Implement error boundaries around GSAP components
- Provide fallback UI for animation failures
- Handle ScrollTrigger cleanup on component unmount

### Media Loading Errors

- Implement fallback images for failed video loads
- Provide loading states for heavy media content
- Handle font loading failures gracefully

### Hydration Error Prevention

- Use client-side only rendering for GSAP components
- Implement proper useEffect patterns for animations
- Handle server/client rendering differences

## Testing Strategy

### Animation Testing

- Test GSAP animations across different viewport sizes
- Verify ScrollTrigger behavior on various scroll speeds
- Validate animation performance on different devices

### Visual Regression Testing

- Compare screenshots between original and migrated versions
- Test responsive breakpoints for visual consistency
- Validate color accuracy and typography matching

### Performance Testing

- Measure Core Web Vitals improvements
- Test image and video loading performance
- Validate animation frame rates and smoothness

### Cross-browser Testing

- Test GSAP compatibility across modern browsers
- Validate video playback across different platforms
- Ensure font rendering consistency

## Migration Strategy

### Phase 1: Project Setup

1. Initialize Next.js project with App Router
2. Configure Tailwind CSS with custom theme
3. Set up TypeScript configuration
4. Install and configure GSAP dependencies

### Phase 2: Core Infrastructure

1. Create layout components and providers
2. Implement GSAP provider and configuration
3. Set up media optimization utilities
4. Create responsive hooks and utilities

### Phase 3: Component Migration

1. Migrate section components one by one
2. Implement GSAP animations with proper Next.js patterns
3. Optimize media assets and loading strategies
4. Test each component for visual accuracy

### Phase 4: Integration and Optimization

1. Integrate all components into main layout
2. Optimize performance and loading strategies
3. Implement error boundaries and fallbacks
4. Conduct comprehensive testing

### Phase 5: Final Polish

1. Fine-tune animations and transitions
2. Optimize for Core Web Vitals
3. Implement SEO optimizations
4. Conduct final visual regression testing

## Performance Optimizations

### Image Optimization

- Use Next.js Image component with proper sizing
- Implement lazy loading for below-fold images
- Optimize image formats (WebP, AVIF when supported)
- Use responsive images for different viewport sizes

### Video Optimization

- Implement lazy loading for video content
- Use appropriate video formats and compression
- Provide poster images for video elements
- Optimize video loading based on connection speed

### Animation Performance

- Use GSAP's performance best practices
- Implement proper cleanup for ScrollTrigger instances
- Optimize animation timelines for smooth playback
- Use transform and opacity for GPU acceleration

### Bundle Optimization

- Implement code splitting for GSAP plugins
- Use dynamic imports for heavy components
- Optimize Tailwind CSS purging
- Minimize JavaScript bundle size
