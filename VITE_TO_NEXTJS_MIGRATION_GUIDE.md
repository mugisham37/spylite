# Complete Vite.js to Next.js Migration Guide

## Maintaining Visual Fidelity & Animation Performance

### Table of Contents

1. [Overview & Prerequisites](#overview--prerequisites)
2. [Project Setup & Configuration](#project-setup--configuration)
3. [File Structure Migration](#file-structure-migration)
4. [GSAP Integration & SSR Handling](#gsap-integration--ssr-handling)
5. [Tailwind CSS v4 Configuration](#tailwind-css-v4-configuration)
6. [Component Migration Strategy](#component-migration-strategy)
7. [Asset Optimization](#asset-optimization)
8. [Performance Optimization](#performance-optimization)
9. [Testing & Validation](#testing--validation)
10. [Production Deployment](#production-deployment)
11. [Critical Checkpoints](#critical-checkpoints)

---

## Overview & Prerequisites

### Migration Goals

- **Zero Visual Changes**: Maintain pixel-perfect visual fidelity
- **Animation Preservation**: All GSAP animations must work identically
- **Performance Enhancement**: Leverage Next.js optimizations without compromising UX
- **Production Ready**: Senior-level best practices for scalable deployment

### Prerequisites

- Node.js 18.17 or later
- GSAP license (for SplitText plugin)
- Understanding of Next.js App Router
- Familiarity with SSR/CSR considerations

---

## Project Setup & Configuration

### 1. Initialize Next.js Project

```bash
# Create new Next.js project with TypeScript support
npx create-next-app@latest spylite-nextjs --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

cd spylite-nextjs
```

### 2. Package.json Configuration

```json
{
  "name": "spylite-nextjs",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "next": "^14.2.0",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "@gsap/react": "^2.1.2",
    "gsap": "^3.13.0",
    "react-responsive": "^10.0.1",
    "tailwindcss": "^4.1.8"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^19.1.2",
    "@types/react-dom": "^19.1.2",
    "eslint": "^8",
    "eslint-config-next": "14.2.0",
    "typescript": "^5"
  }
}
```

### 3. Next.js Configuration (next.config.js)

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize for animations and media
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Enable experimental features for better performance
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },

  // Webpack configuration for GSAP
  webpack: (config, { isServer }) => {
    // Handle GSAP modules properly
    config.module.rules.push({
      test: /\.js$/,
      include: /node_modules\/gsap/,
      use: {
        loader: "babel-loader",
        options: {
          presets: ["next/babel"],
        },
      },
    });

    return config;
  },

  // Headers for better performance
  async headers() {
    return [
      {
        source: "/videos/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

---

## File Structure Migration

### Target Next.js Structure

```
spylite-nextjs/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── loading.tsx
│   ├── components/
│   │   ├── ui/
│   │   │   ├── NavBar.tsx
│   │   │   └── FlavorSlider.tsx
│   │   └── providers/
│   │       └── GSAPProvider.tsx
│   ├── sections/
│   │   ├── HeroSection.tsx
│   │   ├── MessageSection.tsx
│   │   ├── FlavorSection.tsx
│   │   ├── NutritionSection.tsx
│   │   ├── BenefitSection.tsx
│   │   ├── TestimonialSection.tsx
│   │   └── FooterSection.tsx
│   ├── constants/
│   │   └── index.ts
│   ├── hooks/
│   │   ├── useGSAP.ts
│   │   └── useMediaQuery.ts
│   ├── lib/
│   │   ├── gsap.ts
│   │   └── utils.ts
│   └── types/
│       └── index.ts
├── public/
│   ├── images/
│   ├── videos/
│   └── fonts/
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

### Migration Mapping

- `src/main.jsx` → `src/app/layout.tsx` + `src/app/page.tsx`
- `src/App.jsx` → `src/app/page.tsx`
- `index.html` → `src/app/layout.tsx`
- `src/index.css` → `src/app/globals.css`
- All components remain in similar structure with TypeScript

---

## GSAP Integration & SSR Handling

### 1. GSAP Provider Setup

```typescript
// src/components/providers/GSAPProvider.tsx
"use client";

import { useEffect, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger, ScrollSmoother } from "gsap/all";

interface GSAPProviderProps {
  children: ReactNode;
}

export default function GSAPProvider({ children }: GSAPProviderProps) {
  useEffect(() => {
    // Register GSAP plugins only on client side
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    // Global GSAP configuration
    gsap.config({
      force3D: true,
      nullTargetWarn: false,
    });

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      ScrollSmoother.get()?.kill();
    };
  }, []);

  return <>{children}</>;
}
```

### 2. Custom GSAP Hook

```typescript
// src/hooks/useGSAP.ts
"use client";

import { useEffect, useRef, DependencyList } from "react";
import { gsap } from "gsap";

export function useGSAP(
  callback: () => void | (() => void),
  dependencies?: DependencyList
) {
  const cleanupRef = useRef<(() => void) | void>();

  useEffect(() => {
    // Ensure we're on the client side
    if (typeof window === "undefined") return;

    // Execute the GSAP code
    cleanupRef.current = callback();

    // Cleanup function
    return () => {
      if (typeof cleanupRef.current === "function") {
        cleanupRef.current();
      }
    };
  }, dependencies);
}
```

### 3. GSAP Utilities

```typescript
// src/lib/gsap.ts
"use client";

import { gsap } from "gsap";
import { ScrollTrigger, ScrollSmoother, SplitText } from "gsap/all";

// Ensure plugins are registered
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);
}

// GSAP utility functions
export const createScrollSmoother = () => {
  if (typeof window === "undefined") return null;

  return ScrollSmoother.create({
    smooth: 3,
    effects: true,
    normalizeScroll: true,
  });
};

export const createTimeline = (options?: gsap.TimelineVars) => {
  return gsap.timeline(options);
};

export const killAllScrollTriggers = () => {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
};

export { gsap, ScrollTrigger, ScrollSmoother, SplitText };
```

---

## Tailwind CSS v4 Configuration

### 1. Tailwind Config

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/sections/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        black: "#222123",
        "main-bg": "#232224",
        white: "#ffffff",
        "dark-brown": "#523122",
        "mid-brown": "#a26833",
        "light-brown": "#e3a458",
        "red-brown": "#7f3b2d",
        "yellow-brown": "#a26833",
        "milk-yellow": "#e3d3bc",
        red: "#a02128",
        milk: "#faeade",
      },
      fontFamily: {
        sans: ["Antonio", "sans-serif"],
        paragraph: ["ProximaNova", "sans-serif"],
      },
      animation: {
        spin: "spin 20s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
```

### 2. Global Styles Migration

```css
/* src/app/globals.css */
@import url("https://fonts.googleapis.com/css2?family=Antonio:wght@100..700&display=swap");
@import "tailwindcss/base";
@import "tailwindcss/components";
@import "tailwindcss/utilities";

@font-face {
  font-family: "ProximaNova";
  src: url("/fonts/ProximaNova-Regular.otf");
  font-display: swap;
}

/* Preserve exact CSS from original project */
html,
body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  background-color: #faeade;
  color: #523122;
  font-family: "Antonio", sans-serif;
  overflow-x: hidden;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

body::-webkit-scrollbar {
  display: none;
}

/* All existing utility classes and component styles */
@layer utilities {
  .flex-center {
    @apply flex justify-center items-center;
  }
  .col-center {
    @apply flex flex-col justify-center items-center;
  }
  .abs-center {
    @apply absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2;
  }
  .general-title {
    @apply 2xl:text-[8.5rem] md:text-8xl text-5xl font-bold uppercase leading-[9vw] tracking-[-.35vw];
  }
}

/* Copy ALL component styles exactly as they are */
@layer components {
  /* ... (all existing component styles) ... */
}

/* Preserve custom CSS */
.nutrition-section {
  background-color: #faeade00;
  background-image: radial-gradient(circle, #f3ece2, #dcccb0);
}

.spin-circle {
  animation: spin 20s linear infinite;
}
```

---

## Component Migration Strategy

### 1. Layout Component

```typescript
// src/app/layout.tsx
import type { Metadata } from "next";
import { Antonio } from "next/font/google";
import localFont from "next/font/local";
import GSAPProvider from "@/components/providers/GSAPProvider";
import "./globals.css";

const antonio = Antonio({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-antonio",
});

const proximaNova = localFont({
  src: "../public/fonts/ProximaNova-Regular.otf",
  display: "swap",
  variable: "--font-proxima-nova",
});

export const metadata: Metadata = {
  title: "SPYLT - Freaking Delicious Protein + Caffeine",
  description:
    "Live life to the fullest with SPYLT: Shatter boredom and embrace your inner kid with every deliciously smooth chug.",
  keywords: "protein, caffeine, drink, nutrition, energy",
  openGraph: {
    title: "SPYLT - Freaking Delicious Protein + Caffeine",
    description: "Live life to the fullest with SPYLT",
    images: ["/images/Final.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${antonio.variable} ${proximaNova.variable}`}>
      <body className={antonio.className}>
        <GSAPProvider>{children}</GSAPProvider>
      </body>
    </html>
  );
}
```

### 2. Main Page Component

```typescript
// src/app/page.tsx
"use client";

import dynamic from "next/dynamic";
import NavBar from "@/components/ui/NavBar";
import { useGSAP } from "@/hooks/useGSAP";
import { createScrollSmoother } from "@/lib/gsap";

// Dynamic imports for sections to optimize loading
const HeroSection = dynamic(() => import("@/sections/HeroSection"), {
  ssr: false,
});
const MessageSection = dynamic(() => import("@/sections/MessageSection"));
const FlavorSection = dynamic(() => import("@/sections/FlavorSection"));
const NutritionSection = dynamic(() => import("@/sections/NutritionSection"));
const BenefitSection = dynamic(() => import("@/sections/BenefitSection"));
const TestimonialSection = dynamic(
  () => import("@/sections/TestimonialSection")
);
const FooterSection = dynamic(() => import("@/sections/FooterSection"));

export default function Home() {
  useGSAP(() => {
    const smoother = createScrollSmoother();

    return () => {
      smoother?.kill();
    };
  }, []);

  return (
    <main>
      <NavBar />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <HeroSection />
          <MessageSection />
          <FlavorSection />
          <NutritionSection />
          <div>
            <BenefitSection />
            <TestimonialSection />
          </div>
          <FooterSection />
        </div>
      </div>
    </main>
  );
}
```

### 3. Component Migration Template

```typescript
// Example: src/sections/HeroSection.tsx
"use client";

import { useGSAP } from "@/hooks/useGSAP";
import { gsap, SplitText, ScrollTrigger } from "@/lib/gsap";
import { useMediaQuery } from "react-responsive";
import Image from "next/image";

const HeroSection = () => {
  const isMobile = useMediaQuery({
    query: "(max-width: 768px)",
  });

  const isTablet = useMediaQuery({
    query: "(max-width: 1024px)",
  });

  useGSAP(() => {
    // Ensure SplitText is available
    if (!SplitText) return;

    const titleSplit = SplitText.create(".hero-title", {
      type: "chars",
    });

    const tl = gsap.timeline({
      delay: 1,
    });

    tl.to(".hero-content", {
      opacity: 1,
      y: 0,
      ease: "power1.inOut",
    })
      .to(
        ".hero-text-scroll",
        {
          duration: 1,
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          ease: "circ.out",
        },
        "-=0.5"
      )
      .from(
        titleSplit.chars,
        {
          yPercent: 200,
          stagger: 0.02,
          ease: "power2.out",
        },
        "-=0.5"
      );

    const heroTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".hero-container",
        start: "1% top",
        end: "bottom top",
        scrub: true,
      },
    });

    heroTl.to(".hero-container", {
      rotate: 7,
      scale: 0.9,
      yPercent: 30,
      ease: "power1.inOut",
    });

    // Cleanup function
    return () => {
      titleSplit.revert();
    };
  }, []);

  return (
    <section className="bg-main-bg">
      <div className="hero-container">
        {isTablet ? (
          <>
            {isMobile && (
              <Image
                src="/images/hero-bg.png"
                alt="Hero background"
                fill
                className="absolute bottom-40 object-cover"
                priority
              />
            )}
            <Image
              src="/images/hero-img.png"
              alt="Hero image"
              width={800}
              height={600}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 object-auto"
              priority
            />
          </>
        ) : (
          <video
            src="/videos/hero-bg.mp4"
            autoPlay
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="hero-content opacity-0">
          <div className="overflow-hidden">
            <h1 className="hero-title">Freaking Delicious</h1>
          </div>
          <div
            style={{
              clipPath: "polygon(50% 0, 50% 0, 50% 100%, 50% 100%)",
            }}
            className="hero-text-scroll"
          >
            <div className="hero-subtitle">
              <h1>Protein + Caffine </h1>
            </div>
          </div>

          <h2>
            Live life to the fullest with SPYLT: Shatter boredom and embrace
            your inner kid with every deliciously smooth chug.
          </h2>

          <div className="hero-button">
            <p>Chug a SPYLT</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
```

---

## Asset Optimization

### 1. Image Optimization Strategy

```typescript
// src/components/ui/OptimizedImage.tsx
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
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  fill = false,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      fill={fill}
      className={`${className} ${
        isLoading ? "blur-sm" : "blur-0"
      } transition-all duration-300`}
      priority={priority}
      onLoad={() => setIsLoading(false)}
      quality={90}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  );
}
```

### 2. Video Component

```typescript
// src/components/ui/OptimizedVideo.tsx
"use client";

import { useRef, useEffect } from "react";

interface OptimizedVideoProps {
  src: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  loop?: boolean;
}

export default function OptimizedVideo({
  src,
  className,
  autoPlay = true,
  muted = true,
  playsInline = true,
  loop = true,
}: OptimizedVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Optimize video loading
    video.preload = "metadata";

    // Handle intersection observer for performance
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {
              // Handle autoplay restrictions
            });
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <video
      ref={videoRef}
      src={src}
      className={className}
      autoPlay={autoPlay}
      muted={muted}
      playsInline={playsInline}
      loop={loop}
    />
  );
}
```

---

## Performance Optimization

### 1. Loading Strategy

```typescript
// src/app/loading.tsx
export default function Loading() {
  return (
    <div className="fixed inset-0 bg-milk flex items-center justify-center z-50">
      <div className="text-dark-brown text-4xl font-bold animate-pulse">
        SPYLT
      </div>
    </div>
  );
}
```

### 2. Intersection Observer Hook

```typescript
// src/hooks/useIntersectionObserver.ts
import { useEffect, useRef, useState } from "react";

export function useIntersectionObserver(
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [options]);

  return { ref, isIntersecting };
}
```

---

## Testing & Validation

### 1. Visual Regression Testing Checklist

- [ ] **Layout Integrity**: All sections maintain exact positioning
- [ ] **Typography**: Font sizes, weights, and spacing match exactly
- [ ] **Colors**: All color values are identical
- [ ] **Spacing**: Margins, padding, and gaps are preserved
- [ ] **Responsive Behavior**: Mobile and tablet layouts work identically

### 2. Animation Testing Checklist

- [ ] **ScrollTrigger**: All scroll-based animations trigger at correct points
- [ ] **Timeline Sequences**: Animation timing and easing match original
- [ ] **SplitText**: Character animations work properly
- [ ] **ScrollSmoother**: Smooth scrolling behavior is identical
- [ ] **Performance**: No animation jank or performance degradation

### 3. Functionality Testing

- [ ] **Video Playback**: All videos autoplay and loop correctly
- [ ] **Image Loading**: All images load with proper optimization
- [ ] **Responsive Design**: All breakpoints work correctly
- [ ] **Interactive Elements**: Hover states and interactions work
- [ ] **Cross-browser**: Testing in Chrome, Firefox, Safari, Edge

---

## Production Deployment

### 1. Build Optimization

```bash
# Build with optimization
npm run build

# Analyze bundle
npm install --save-dev @next/bundle-analyzer
```

### 2. Environment Configuration

```bash
# .env.local
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_GSAP_LICENSE_KEY=your-gsap-license-key
```

### 3. Deployment Checklist

- [ ] **Performance Audit**: Lighthouse score > 90
- [ ] **SEO Optimization**: Meta tags and structured data
- [ ] **Security Headers**: CSP and security configurations
- [ ] **CDN Configuration**: Proper caching for static assets
- [ ] **Error Monitoring**: Sentry or similar error tracking

---

## Critical Checkpoints

### ⚠️ CRITICAL: Animation Preservation Points

1. **GSAP Plugin Loading**: Ensure SplitText loads only on client-side
2. **ScrollTrigger Refresh**: Call `ScrollTrigger.refresh()` after dynamic content
3. **Timeline Cleanup**: Always clean up timelines in useEffect cleanup
4. **SSR Compatibility**: Wrap all GSAP code in client-side checks

### ⚠️ CRITICAL: Visual Fidelity Points

1. **CSS Import Order**: Maintain exact CSS import sequence
2. **Font Loading**: Use Next.js font optimization without changing appearance
3. **Image Dimensions**: Preserve exact image sizing and positioning
4. **Video Attributes**: Maintain all video properties (autoplay, muted, etc.)

### ⚠️ CRITICAL: Performance Points

1. **Bundle Size**: Monitor for significant size increases
2. **First Paint**: Ensure hero section loads immediately
3. **Animation Performance**: Maintain 60fps for all animations
4. **Memory Leaks**: Proper cleanup of GSAP instances

---

## Final Migration Validation

### Before Go-Live Checklist

- [ ] **Pixel-Perfect Comparison**: Side-by-side visual comparison
- [ ] **Animation Timing**: Frame-by-frame animation comparison
- [ ] **Performance Metrics**: Core Web Vitals match or improve
- [ ] **Cross-Device Testing**: All devices and orientations
- [ ] **Accessibility**: Maintain accessibility standards
- [ ] **SEO Preservation**: All SEO elements transferred correctly

### Success Criteria

✅ **Visual**: 100% visual fidelity maintained  
✅ **Animation**: All GSAP animations work identically  
✅ **Performance**: Core Web Vitals improved or maintained  
✅ **Functionality**: All interactive elements work perfectly  
✅ **Production**: Deployed successfully with monitoring

---

## Conclusion

This migration guide ensures a seamless transition from Vite.js to Next.js while maintaining every pixel and animation frame of your award-winning SPYLT website. The key is methodical component migration, proper GSAP SSR handling, and rigorous testing at each step.

Remember: **When in doubt, preserve the original behavior exactly**. Next.js optimizations should enhance performance without changing the user experience.
