/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features for optimal performance
  experimental: {
    optimizePackageImports: ["gsap", "@gsap/react"],
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

  // Enhanced headers for security and performance
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
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
        ],
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
