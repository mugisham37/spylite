"use client";

import { useScrollSmoother, useScrollTo } from "@/hooks/useScrollSmoother";
import {
  testScrollPerformance,
  getDeviceInfo,
} from "@/utils/scrollPerformance";
import { useEffect, useState } from "react";

interface PerformanceTestResult {
  deviceInfo: ReturnType<typeof getDeviceInfo>;
  performanceMetrics: {
    averageFps: number;
    totalScrollDistance: number;
    samplesCount: number;
    smootherActive: boolean;
  } | null;
  detailedMetrics: Array<{
    fps: number;
    scrollDelta: number;
    timestamp: number;
    smootherActive: boolean;
  }>;
}

export default function ScrollSmootherTest() {
  const scrollSmoother = useScrollSmoother();
  const scrollTo = useScrollTo();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [performanceData, setPerformanceData] =
    useState<PerformanceTestResult | null>(null);

  useEffect(() => {
    if (scrollSmoother) {
      setIsInitialized(true);
      console.log("ScrollSmoother initialized successfully:", scrollSmoother);
      console.log("Device info:", getDeviceInfo());
    }
  }, [scrollSmoother]);

  const handleScrollToTop = () => {
    scrollTo(0, true);
  };

  const handleScrollToSection = (selector: string) => {
    scrollTo(selector, true);
  };

  const startPerformanceTest = async () => {
    setIsMonitoring(true);
    setPerformanceData(null);

    try {
      const results = await testScrollPerformance(5000); // 5 second test
      setPerformanceData(results);
    } catch (error) {
      console.error("Performance test failed:", error);
    } finally {
      setIsMonitoring(false);
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 bg-black/80 text-white p-4 rounded-lg text-sm max-w-xs">
      <div className="mb-2">
        <strong>ScrollSmoother Status:</strong>
        <span
          className={`ml-2 px-2 py-1 rounded text-xs ${
            isInitialized ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {isInitialized ? "Active" : "Not Active"}
        </span>
      </div>

      {isInitialized && (
        <div className="space-y-2">
          <button
            onClick={handleScrollToTop}
            className="block w-full bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-xs"
          >
            Scroll to Top
          </button>
          <button
            onClick={() => handleScrollToSection(".message-content")}
            className="block w-full bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-xs"
          >
            Scroll to Message
          </button>
          <button
            onClick={() => handleScrollToSection(".flavor-section")}
            className="block w-full bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-xs"
          >
            Scroll to Flavor
          </button>

          <hr className="border-gray-600" />

          <button
            onClick={startPerformanceTest}
            disabled={isMonitoring}
            className="block w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 px-3 py-1 rounded text-xs"
          >
            {isMonitoring ? "Testing..." : "Test Performance"}
          </button>

          {performanceData && (
            <div className="mt-2 p-2 bg-gray-800 rounded text-xs">
              <div>
                Avg FPS:{" "}
                {performanceData.performanceMetrics?.averageFps || "N/A"}
              </div>
              <div>
                Device:{" "}
                {performanceData.deviceInfo?.isMobile
                  ? "Mobile"
                  : performanceData.deviceInfo?.isTablet
                  ? "Tablet"
                  : "Desktop"}
              </div>
              <div>
                Viewport: {performanceData.deviceInfo?.viewport?.width}x
                {performanceData.deviceInfo?.viewport?.height}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
