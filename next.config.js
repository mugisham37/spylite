/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production build optimizations
  output: process.env.NODE_ENV === "production" ? "standalone" : undefined,

  // Enable experimental features for optimal performance
  experimental: {
    optimizePackageImports: ["gsap", "@gsap/react"],
    optimizeCss: true,
    gzipSize: true,
  },

  // Image optimization configuration with enhanced settings
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    minimumCacheTTL: 31536000, // 1 year cache for images
    loader: "default",
    unoptimized: false,
  },

  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  generateEtags: true, // Enable ETags for better caching

  // Production-specific optimizations
  reactStrictMode: true,
  productionBrowserSourceMaps: false, // Disable source maps in production for security

  // Compiler optimizations
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"],
          }
        : false,
  },

  // Enhanced headers for security and performance
  async headers() {
    const securityHeaders = [
      {
        key: "X-Frame-Options",
        value: "DENY",
      },
      {
        key: "X-Content-Type-Options",
        value: "nosniff",
      },
      {
        key: "Referrer-Policy",
        value: "origin-when-cross-origin",
      },
      {
        key: "X-DNS-Prefetch-Control",
        value: "on",
      },
      {
        key: "Strict-Transport-Security",
        value: "max-age=31536000; includeSubDomains; preload",
      },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
      },
      {
        key: "Content-Security-Policy",
        value:
          process.env.NODE_ENV === "production"
            ? "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https:; media-src 'self' blob:; connect-src 'self' https://www.google-analytics.com https://analytics.google.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self';"
            : "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; media-src 'self' blob:; connect-src 'self'; frame-ancestors 'none';",
      },
    ];

    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      // Static assets with long-term caching
      {
        source: "/fonts/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
        ],
      },
      {
        source: "/images/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
          {
            key: "Vary",
            value: "Accept",
          },
        ],
      },
      {
        source: "/videos/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
          {
            key: "Accept-Ranges",
            value: "bytes",
          },
        ],
      },
      // SVG files with compression
      {
        source: "/(.*)\\.svg",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
          {
            key: "Content-Encoding",
            value: "gzip",
          },
        ],
      },
      // JavaScript and CSS files
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // API routes with no-cache
      {
        source: "/api/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate",
          },
        ],
      },
    ];
  },

  // Webpack configuration for GSAP
  webpack: (config, { isServer }) => {
    // GSAP configuration
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }

    // Optimize GSAP imports
    config.resolve.alias = {
      ...config.resolve.alias,
      "gsap/dist/gsap": "gsap/dist/gsap.min.js",
      "gsap/dist/ScrollTrigger": "gsap/dist/ScrollTrigger.min.js",
      "gsap/dist/ScrollSmoother": "gsap/dist/ScrollSmoother.min.js",
      "gsap/dist/SplitText": "gsap/dist/SplitText.min.js",
    };

    return config;
  },
};

module.exports = nextConfig;
