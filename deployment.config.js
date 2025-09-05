/**
 * Production deployment configuration
 */

module.exports = {
  // Application configuration
  app: {
    name: "spylt-website",
    version: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
    environment: process.env.NODE_ENV || "production",
  },

  // Server configuration
  server: {
    port: process.env.PORT || 3000,
    host: process.env.HOSTNAME || "0.0.0.0",
    timeout: 30000,
  },

  // Performance configuration
  performance: {
    // Enable compression
    compression: {
      enabled: true,
      level: 9,
      threshold: 1024,
    },

    // Caching configuration
    cache: {
      static: {
        maxAge: 31536000, // 1 year
        immutable: true,
      },
      api: {
        maxAge: 0,
        noCache: true,
      },
      pages: {
        maxAge: 3600, // 1 hour
        staleWhileRevalidate: 86400, // 24 hours
      },
    },

    // Rate limiting
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    },
  },

  // Security configuration
  security: {
    // HTTPS configuration
    https: {
      enabled: process.env.NODE_ENV === "production",
      forceRedirect: true,
    },

    // CORS configuration
    cors: {
      origin: process.env.ALLOWED_ORIGINS?.split(",") || ["https://spylt.com"],
      credentials: true,
    },

    // Security headers
    headers: {
      "Strict-Transport-Security":
        "max-age=31536000; includeSubDomains; preload",
      "X-Frame-Options": "DENY",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "origin-when-cross-origin",
      "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    },

    // Content Security Policy
    csp: {
      "default-src": ["'self'"],
      "script-src": [
        "'self'",
        "'unsafe-inline'",
        "'unsafe-eval'",
        "https://www.googletagmanager.com",
        "https://www.google-analytics.com",
      ],
      "style-src": [
        "'self'",
        "'unsafe-inline'",
        "https://fonts.googleapis.com",
      ],
      "font-src": ["'self'", "https://fonts.gstatic.com"],
      "img-src": ["'self'", "data:", "blob:", "https:"],
      "media-src": ["'self'", "blob:"],
      "connect-src": [
        "'self'",
        "https://www.google-analytics.com",
        "https://analytics.google.com",
      ],
    },
  },

  // Monitoring configuration
  monitoring: {
    // Health check configuration
    healthCheck: {
      enabled: true,
      endpoint: "/api/health",
      interval: 30000, // 30 seconds
    },

    // Analytics configuration
    analytics: {
      enabled: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true",
      googleAnalytics: {
        measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
      },
      googleTagManager: {
        containerId: process.env.NEXT_PUBLIC_GTM_ID,
      },
    },

    // Error monitoring
    errorMonitoring: {
      enabled: process.env.NEXT_PUBLIC_ENABLE_ERROR_REPORTING === "true",
      sentry: {
        dsn: process.env.SENTRY_DSN,
        environment: process.env.NEXT_PUBLIC_APP_ENV,
        tracesSampleRate: 0.1,
      },
    },

    // Performance monitoring
    performanceMonitoring: {
      enabled: process.env.NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING === "true",
      webVitals: true,
      customMetrics: true,
    },
  },

  // Build configuration
  build: {
    // Output configuration
    output: "standalone",

    // Optimization settings
    optimization: {
      minify: true,
      compress: true,
      treeshake: true,
      splitChunks: true,
    },

    // Bundle analysis
    analyze: process.env.ANALYZE === "true",

    // Source maps
    sourceMaps: process.env.NODE_ENV !== "production",
  },

  // CDN configuration
  cdn: {
    enabled: !!process.env.NEXT_PUBLIC_CDN_URL,
    baseUrl: process.env.NEXT_PUBLIC_CDN_URL,
    assets: {
      images: true,
      videos: true,
      fonts: true,
      static: true,
    },
  },

  // Database configuration (if needed)
  database: {
    // Add database configuration if needed
  },

  // External services
  services: {
    // Add external service configurations
  },

  // Deployment targets
  deployment: {
    // Vercel configuration
    vercel: {
      regions: ["iad1"], // US East
      functions: {
        "src/app/api/**": {
          maxDuration: 10,
        },
      },
    },

    // Docker configuration
    docker: {
      image: "spylt-website",
      tag: process.env.DOCKER_TAG || "latest",
      registry: process.env.DOCKER_REGISTRY,
    },

    // Kubernetes configuration
    kubernetes: {
      namespace: "spylt-production",
      replicas: 3,
      resources: {
        requests: {
          cpu: "100m",
          memory: "128Mi",
        },
        limits: {
          cpu: "500m",
          memory: "512Mi",
        },
      },
    },
  },

  // Environment-specific overrides
  environments: {
    development: {
      security: {
        csp: {
          "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        },
      },
      monitoring: {
        analytics: { enabled: false },
        errorMonitoring: { enabled: false },
      },
    },

    staging: {
      monitoring: {
        analytics: { enabled: false },
        errorMonitoring: { enabled: true },
      },
    },

    production: {
      performance: {
        compression: { level: 9 },
      },
      monitoring: {
        analytics: { enabled: true },
        errorMonitoring: { enabled: true },
        performanceMonitoring: { enabled: true },
      },
    },
  },
};
