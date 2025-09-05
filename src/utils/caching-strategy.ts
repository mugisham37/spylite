"use client";

// Comprehensive caching strategy for optimal performance
export interface CacheConfig {
  staticAssets: {
    maxAge: number;
    immutable: boolean;
  };
  images: {
    maxAge: number;
    staleWhileRevalidate: number;
  };
  videos: {
    maxAge: number;
    acceptRanges: boolean;
  };
  fonts: {
    maxAge: number;
    crossOrigin: boolean;
  };
  api: {
    maxAge: number;
    mustRevalidate: boolean;
  };
}

export interface ServiceWorkerConfig {
  enabled: boolean;
  cacheFirst: string[];
  networkFirst: string[];
  staleWhileRevalidate: string[];
}

class CachingStrategy {
  private config: CacheConfig;
  private swConfig: ServiceWorkerConfig;

  constructor() {
    this.config = {
      staticAssets: {
        maxAge: 31536000, // 1 year
        immutable: true,
      },
      images: {
        maxAge: 31536000, // 1 year
        staleWhileRevalidate: 86400, // 1 day
      },
      videos: {
        maxAge: 31536000, // 1 year
        acceptRanges: true,
      },
      fonts: {
        maxAge: 31536000, // 1 year
        crossOrigin: true,
      },
      api: {
        maxAge: 0,
        mustRevalidate: true,
      },
    };

    this.swConfig = {
      enabled: true,
      cacheFirst: ["/images/", "/videos/", "/fonts/", "/_next/static/"],
      networkFirst: ["/api/"],
      staleWhileRevalidate: ["/", "/about", "/contact"],
    };
  }

  // Generate cache headers for different asset types
  generateCacheHeaders(assetType: keyof CacheConfig): Record<string, string> {
    const config = this.config[assetType];
    const headers: Record<string, string> = {};

    switch (assetType) {
      case "staticAssets":
        const staticConfig = config as typeof this.config.staticAssets;
        headers["Cache-Control"] = `public, max-age=${staticConfig.maxAge}${
          staticConfig.immutable ? ", immutable" : ""
        }`;
        break;

      case "images":
        const imageConfig = config as typeof this.config.images;
        headers[
          "Cache-Control"
        ] = `public, max-age=${imageConfig.maxAge}, stale-while-revalidate=${imageConfig.staleWhileRevalidate}`;
        headers["Vary"] = "Accept";
        break;

      case "videos":
        const videoConfig = config as typeof this.config.videos;
        headers["Cache-Control"] = `public, max-age=${videoConfig.maxAge}`;
        if (videoConfig.acceptRanges) {
          headers["Accept-Ranges"] = "bytes";
        }
        break;

      case "fonts":
        const fontConfig = config as typeof this.config.fonts;
        headers[
          "Cache-Control"
        ] = `public, max-age=${fontConfig.maxAge}, immutable`;
        if (fontConfig.crossOrigin) {
          headers["Access-Control-Allow-Origin"] = "*";
        }
        break;

      case "api":
        const apiConfig = config as typeof this.config.api;
        if (apiConfig.maxAge === 0) {
          headers["Cache-Control"] = "no-store, no-cache, must-revalidate";
        } else {
          headers["Cache-Control"] = `public, max-age=${apiConfig.maxAge}${
            apiConfig.mustRevalidate ? ", must-revalidate" : ""
          }`;
        }
        break;
    }

    return headers;
  }

  // Browser cache management
  manageBrowserCache() {
    if (typeof window === "undefined") return;

    // Clear old cache entries
    this.clearOldCacheEntries();

    // Preload critical resources
    this.preloadCriticalResources();

    // Set up cache warming
    this.warmCache();
  }

  private clearOldCacheEntries() {
    if ("caches" in window) {
      caches.keys().then((cacheNames) => {
        cacheNames.forEach((cacheName) => {
          // Remove old version caches
          if (cacheName.includes("old") || cacheName.includes("v1")) {
            caches.delete(cacheName);
          }
        });
      });
    }
  }

  private preloadCriticalResources() {
    const criticalResources = [
      { href: "/fonts/ProximaNova-Regular.otf", as: "font", type: "font/otf" },
      { href: "/images/hero-bg.png", as: "image" },
      { href: "/images/logo.png", as: "image" },
      { href: "/videos/hero-bg.mp4", as: "video" },
    ];

    criticalResources.forEach(({ href, as, type }) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.href = href;
      link.as = as;
      if (type) link.type = type;
      if (as === "font") link.crossOrigin = "anonymous";
      document.head.appendChild(link);
    });
  }

  private warmCache() {
    // Warm cache with likely-to-be-needed resources
    const warmupResources = [
      "/images/nav-logo.svg",
      "/images/arrow.svg",
      "/images/play.svg",
    ];

    warmupResources.forEach((resource) => {
      const img = new Image();
      img.src = resource;
    });
  }

  // Service Worker registration and management
  registerServiceWorker() {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return Promise.resolve();
    }

    return navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("Service Worker registered:", registration);
        return registration;
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  }

  // Generate service worker content
  generateServiceWorkerContent(): string {
    const cacheVersion = "v1";
    const cacheName = `spylt-cache-${cacheVersion}`;

    return `
const CACHE_NAME = '${cacheName}';
const STATIC_CACHE = '${cacheName}-static';
const DYNAMIC_CACHE = '${cacheName}-dynamic';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/fonts/ProximaNova-Regular.otf',
  '/images/logo.png',
  '/images/nav-logo.svg',
  '/images/hero-bg.png',
  '/_next/static/css/',
  '/_next/static/js/',
];

// Cache strategies
const CACHE_FIRST = ${JSON.stringify(this.swConfig.cacheFirst)};
const NETWORK_FIRST = ${JSON.stringify(this.swConfig.networkFirst)};
const STALE_WHILE_REVALIDATE = ${JSON.stringify(
      this.swConfig.staleWhileRevalidate
    )};

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Cache first strategy for static assets
  if (CACHE_FIRST.some(pattern => url.pathname.startsWith(pattern))) {
    event.respondWith(
      caches.match(request).then((response) => {
        return response || fetch(request).then((fetchResponse) => {
          const responseClone = fetchResponse.clone();
          caches.open(STATIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
          return fetchResponse;
        });
      })
    );
    return;
  }

  // Network first strategy for API calls
  if (NETWORK_FIRST.some(pattern => url.pathname.startsWith(pattern))) {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match(request);
      })
    );
    return;
  }

  // Stale while revalidate for pages
  if (STALE_WHILE_REVALIDATE.some(pattern => url.pathname === pattern)) {
    event.respondWith(
      caches.match(request).then((response) => {
        const fetchPromise = fetch(request).then((fetchResponse) => {
          const responseClone = fetchResponse.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
          return fetchResponse;
        });
        return response || fetchPromise;
      })
    );
    return;
  }

  // Default: network first, fallback to cache
  event.respondWith(
    fetch(request).catch(() => {
      return caches.match(request);
    })
  );
});
`;
  }

  // HTTP/2 Server Push hints
  generateServerPushHints(): Array<{
    path: string;
    as: string;
    type?: string;
  }> {
    return [
      { path: "/fonts/ProximaNova-Regular.otf", as: "font", type: "font/otf" },
      { path: "/images/hero-bg.png", as: "image" },
      { path: "/images/logo.png", as: "image" },
      { path: "/_next/static/css/app.css", as: "style" },
      { path: "/_next/static/js/app.js", as: "script" },
    ];
  }

  // CDN configuration
  getCDNConfig() {
    return {
      domains: ["cdn.spylt.com", "assets.spylt.com"],
      regions: ["us-east-1", "eu-west-1", "ap-southeast-1"],
      cacheRules: {
        images: {
          ttl: 31536000, // 1 year
          compress: true,
          webp: true,
          avif: true,
        },
        videos: {
          ttl: 31536000, // 1 year
          compress: false,
          streaming: true,
        },
        fonts: {
          ttl: 31536000, // 1 year
          compress: true,
          cors: true,
        },
      },
    };
  }

  // Performance monitoring for cache effectiveness
  monitorCachePerformance() {
    if (typeof window === "undefined") return;

    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === "resource") {
          const resourceEntry = entry as PerformanceResourceTiming;

          // Check if resource was served from cache
          const fromCache =
            resourceEntry.transferSize === 0 &&
            resourceEntry.decodedBodySize > 0;

          if (fromCache) {
            console.log(`Cache hit: ${resourceEntry.name}`);
          } else {
            console.log(`Cache miss: ${resourceEntry.name}`);
          }
        }
      });
    });

    observer.observe({ entryTypes: ["resource"] });

    return () => observer.disconnect();
  }

  // Update cache configuration
  updateConfig(newConfig: Partial<CacheConfig>) {
    this.config = { ...this.config, ...newConfig };
  }

  // Get current configuration
  getConfig(): CacheConfig {
    return this.config;
  }
}

// Singleton instance
let cachingStrategy: CachingStrategy | null = null;

export function createCachingStrategy(): CachingStrategy {
  if (!cachingStrategy) {
    cachingStrategy = new CachingStrategy();
  }
  return cachingStrategy;
}

export function getCachingStrategy(): CachingStrategy | null {
  return cachingStrategy;
}

// React hook for caching strategy
export function useCachingStrategy() {
  if (typeof window === "undefined") {
    return {
      strategy: null,
      generateCacheHeaders: () => ({}),
      manageBrowserCache: () => {},
      registerServiceWorker: () => Promise.resolve(),
    };
  }

  const strategy = createCachingStrategy();

  return {
    strategy,
    generateCacheHeaders: (assetType: keyof CacheConfig) =>
      strategy.generateCacheHeaders(assetType),
    manageBrowserCache: () => strategy.manageBrowserCache(),
    registerServiceWorker: () => strategy.registerServiceWorker(),
    monitorCachePerformance: () => strategy.monitorCachePerformance(),
  };
}

export default CachingStrategy;
