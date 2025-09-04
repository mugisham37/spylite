/**
 * Performance monitoring provider for tracking Core Web Vitals and animation performance
 */

"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import {
  initWebVitalsMonitoring,
  getWebVitalsSnapshot,
  optimizeForWebVitals,
  monitorPerformanceBudget,
  type WebVitalReport,
} from "@/lib/utils/webVitals";
import {
  getDeviceCapabilities,
  optimizeGSAPForDevice,
  startRealTimeMonitoring,
  type DeviceCapabilities,
  type AnimationPerformanceMetrics,
} from "@/lib/utils/animationPerformance";
import {
  preloadCriticalComponents,
  addResourceHints,
} from "@/lib/utils/dynamicImports";

interface PerformanceMetrics {
  webVitals: WebVitalReport[];
  animations: AnimationPerformanceMetrics[];
  deviceCapabilities: DeviceCapabilities;
  timestamp: number;
}

interface PerformanceContextType {
  isMonitoring: boolean;
  metrics: PerformanceMetrics | null;
  deviceCapabilities: DeviceCapabilities | null;
  startMonitoring: () => void;
  stopMonitoring: () => void;
  getMetrics: () => Promise<PerformanceMetrics>;
  optimizeForDevice: () => void;
}

const PerformanceContext = createContext<PerformanceContextType | undefined>(
  undefined
);

export const usePerformance = () => {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error("usePerformance must be used within a PerformanceProvider");
  }
  return context;
};

interface PerformanceProviderProps {
  children: ReactNode;
  autoStart?: boolean;
  enableOptimizations?: boolean;
}

export const PerformanceProvider: React.FC<PerformanceProviderProps> = ({
  children,
  autoStart = true,
  enableOptimizations = true,
}) => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [deviceCapabilities, setDeviceCapabilities] =
    useState<DeviceCapabilities | null>(null);
  const [cleanupFunctions, setCleanupFunctions] = useState<(() => void)[]>([]);

  // Initialize device capabilities
  useEffect(() => {
    if (typeof window !== "undefined") {
      const capabilities = getDeviceCapabilities();
      setDeviceCapabilities(capabilities);

      if (enableOptimizations) {
        optimizeGSAPForDevice(capabilities);
      }
    }
  }, [enableOptimizations]);

  const startMonitoring = useCallback(() => {
    if (isMonitoring || typeof window === "undefined") return;

    setIsMonitoring(true);
    const cleanup: (() => void)[] = [];

    try {
      // Initialize Web Vitals monitoring
      initWebVitalsMonitoring();

      // Start real-time performance monitoring
      const realtimeCleanup = startRealTimeMonitoring();
      cleanup.push(realtimeCleanup);

      // Monitor performance budget
      monitorPerformanceBudget();

      // Optimize for Web Vitals
      if (enableOptimizations) {
        optimizeForWebVitals();
        preloadCriticalComponents();
        addResourceHints();
      }

      setCleanupFunctions(cleanup);

      console.log("Performance monitoring started");
    } catch (error) {
      console.error("Failed to start performance monitoring:", error);
      setIsMonitoring(false);
    }
  }, [isMonitoring, enableOptimizations]);

  const stopMonitoring = useCallback(() => {
    if (!isMonitoring) return;

    setIsMonitoring(false);

    // Run cleanup functions
    cleanupFunctions.forEach((cleanup) => {
      try {
        cleanup();
      } catch (error) {
        console.error("Error during performance monitoring cleanup:", error);
      }
    });

    setCleanupFunctions([]);
    console.log("Performance monitoring stopped");
  }, [isMonitoring, cleanupFunctions]);

  // Auto-start monitoring
  useEffect(() => {
    if (autoStart && typeof window !== "undefined") {
      startMonitoring();
    }

    return () => {
      stopMonitoring();
    };
  }, [autoStart, startMonitoring, stopMonitoring]);

  const getMetrics = useCallback(async (): Promise<PerformanceMetrics> => {
    if (typeof window === "undefined") {
      throw new Error("Metrics can only be collected in browser environment");
    }

    try {
      const webVitals = await getWebVitalsSnapshot();
      const capabilities = deviceCapabilities || getDeviceCapabilities();

      const performanceMetrics: PerformanceMetrics = {
        webVitals,
        animations: [], // Would be populated by animation tests
        deviceCapabilities: capabilities,
        timestamp: Date.now(),
      };

      setMetrics(performanceMetrics);
      return performanceMetrics;
    } catch (error) {
      console.error("Failed to collect performance metrics:", error);
      throw error;
    }
  }, [deviceCapabilities]);

  const optimizeForDevice = useCallback(() => {
    if (!deviceCapabilities || typeof window === "undefined") return;

    try {
      optimizeGSAPForDevice(deviceCapabilities);
      optimizeForWebVitals();
      console.log("Device optimizations applied");
    } catch (error) {
      console.error("Failed to apply device optimizations:", error);
    }
  }, [deviceCapabilities]);

  // Periodic metrics collection
  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(async () => {
      try {
        await getMetrics();
      } catch (error) {
        console.error("Failed to collect periodic metrics:", error);
      }
    }, 30000); // Collect metrics every 30 seconds

    return () => clearInterval(interval);
  }, [isMonitoring, getMetrics]);

  const contextValue: PerformanceContextType = {
    isMonitoring,
    metrics,
    deviceCapabilities,
    startMonitoring,
    stopMonitoring,
    getMetrics,
    optimizeForDevice,
  };

  return (
    <PerformanceContext.Provider value={contextValue}>
      {children}
    </PerformanceContext.Provider>
  );
};

// Legacy default export for backward compatibility
export default function PerformanceProviderLegacy() {
  return (
    <PerformanceProvider>
      <></>
    </PerformanceProvider>
  );
}
