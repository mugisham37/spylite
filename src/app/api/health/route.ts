/**
 * Health check endpoint for production monitoring
 */

import { NextRequest, NextResponse } from "next/server";

// Health check data interface
interface HealthCheckData {
  status: "healthy" | "unhealthy";
  timestamp: string;
  uptime: number;
  environment: string;
  version: string;
  checks: {
    server: boolean;
    memory: boolean;
    dependencies: boolean;
  };
  metrics?: {
    memoryUsage: NodeJS.MemoryUsage;
    cpuUsage?: NodeJS.CpuUsage;
  };
}

// Memory threshold (in MB)
const MEMORY_THRESHOLD = 512;

export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Basic server check
    const serverCheck = true;

    // Memory usage check
    const memoryUsage = process.memoryUsage();
    const memoryUsageMB = memoryUsage.heapUsed / 1024 / 1024;
    const memoryCheck = memoryUsageMB < MEMORY_THRESHOLD;

    // Dependencies check (basic check for critical modules)
    let dependenciesCheck = true;
    try {
      // Check if critical dependencies are available
      await import("next");
      await import("react");
      await import("react-dom");
    } catch {
      dependenciesCheck = false;
    }

    // Overall health status
    const isHealthy = serverCheck && memoryCheck && dependenciesCheck;

    const healthData: HealthCheckData = {
      status: isHealthy ? "healthy" : "unhealthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "unknown",
      version: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
      checks: {
        server: serverCheck,
        memory: memoryCheck,
        dependencies: dependenciesCheck,
      },
    };

    // Include detailed metrics in development or if requested
    const includeMetrics =
      process.env.NODE_ENV === "development" ||
      request.nextUrl.searchParams.get("metrics") === "true";

    if (includeMetrics) {
      healthData.metrics = {
        memoryUsage,
        cpuUsage: process.cpuUsage(),
      };
    }

    const responseTime = Date.now() - startTime;

    return NextResponse.json(healthData, {
      status: isHealthy ? 200 : 503,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
        "X-Response-Time": `${responseTime}ms`,
      },
    });
  } catch (error) {
    console.error("Health check failed:", error);

    const errorHealthData: HealthCheckData = {
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "unknown",
      version: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
      checks: {
        server: false,
        memory: false,
        dependencies: false,
      },
    };

    return NextResponse.json(errorHealthData, {
      status: 503,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  }
}

// HEAD request for simple health check
export async function HEAD() {
  try {
    // Simple check - if we can respond, we're alive
    return new NextResponse(null, {
      status: 200,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch {
    return new NextResponse(null, {
      status: 503,
    });
  }
}
