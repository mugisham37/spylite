"use client";

import { useState, useEffect } from "react";
import { usePerformanceContext } from "@/providers/PerformanceProvider";

interface PerformanceMonitorProps {
  showInProduction?: boolean;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

export function PerformanceMonitor({
  showInProduction = false,
  position = "top-right",
}: PerformanceMonitorProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const performance = usePerformanceContext();

  // Only show in development unless explicitly enabled for production
  const shouldShow = process.env.NODE_ENV === "development" || showInProduction;

  useEffect(() => {
    if (!shouldShow) return;

    // Show monitor after initialization
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [shouldShow]);

  if (!shouldShow || !isVisible || !performance.isInitialized) {
    return null;
  }

  const positionClasses = {
    "top-left": "top-4 left-4",
    "top-right": "top-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "bottom-right": "bottom-4 right-4",
  };

  const getPerformanceColor = (value: number, thresholds: [number, number]) => {
    if (value >= thresholds[1]) return "text-green-500";
    if (value >= thresholds[0]) return "text-yellow-500";
    return "text-red-500";
  };

  const getFPSColor = (fps: number) => getPerformanceColor(fps, [30, 50]);
  const getCacheColor = (rate: number) =>
    getPerformanceColor(rate * 100, [50, 80]);

  return (
    <div
      className={`fixed ${
        positionClasses[position]
      } z-50 bg-black/80 backdrop-blur-sm text-white text-xs font-mono rounded-lg border border-gray-600 transition-all duration-300 ${
        isExpanded ? "w-80" : "w-16"
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-2 text-left hover:bg-white/10 rounded-lg transition-colors"
        title="Performance Monitor"
      >
        {isExpanded ? "📊 Performance" : "📊"}
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-3 pt-0 space-y-2">
          {/* FPS */}
          <div className="flex justify-between items-center">
            <span>FPS:</span>
            <span className={getFPSColor(performance.metrics.fps)}>
              {performance.metrics.fps || 0}
            </span>
          </div>

          {/* Cache Hit Rate */}
          <div className="flex justify-between items-center">
            <span>Cache:</span>
            <span className={getCacheColor(performance.metrics.cacheHitRate)}>
              {Math.round((performance.metrics.cacheHitRate || 0) * 100)}%
            </span>
          </div>

          {/* Average Load Time */}
          <div className="flex justify-between items-center">
            <span>Avg Load:</span>
            <span
              className={
                performance.metrics.averageLoadTime > 1000
                  ? "text-red-500"
                  : "text-green-500"
              }
            >
              {Math.round(performance.metrics.averageLoadTime || 0)}ms
            </span>
          </div>

          {/* Total Assets */}
          <div className="flex justify-between items-center">
            <span>Assets:</span>
            <span className="text-blue-400">
              {performance.metrics.totalAssets || 0}
            </span>
          </div>

          {/* Memory Usage */}
          {performance.metrics.memoryUsage && (
            <div className="flex justify-between items-center">
              <span>Memory:</span>
              <span
                className={
                  performance.metrics.memoryUsage > 100
                    ? "text-yellow-500"
                    : "text-green-500"
                }
              >
                {Math.round(performance.metrics.memoryUsage)}MB
              </span>
            </div>
          )}

          {/* Device Capabilities */}
          <div className="border-t border-gray-600 pt-2 mt-2">
            <div className="text-gray-400 mb-1">Device:</div>
            <div className="flex justify-between items-center">
              <span>Cores:</span>
              <span className="text-blue-400">
                {performance.deviceCapabilities.cores}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>WebP:</span>
              <span
                className={
                  performance.deviceCapabilities.supportsWebP
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                {performance.deviceCapabilities.supportsWebP ? "✓" : "✗"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>AVIF:</span>
              <span
                className={
                  performance.deviceCapabilities.supportsAVIF
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                {performance.deviceCapabilities.supportsAVIF ? "✓" : "✗"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Connection:</span>
              <span className="text-blue-400 text-xs">
                {performance.deviceCapabilities.connectionType}
              </span>
            </div>
            {performance.deviceCapabilities.memoryGB && (
              <div className="flex justify-between items-center">
                <span>RAM:</span>
                <span className="text-blue-400">
                  {performance.deviceCapabilities.memoryGB}GB
                </span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span>Low-end:</span>
              <span
                className={
                  performance.deviceCapabilities.isLowEnd
                    ? "text-yellow-500"
                    : "text-green-500"
                }
              >
                {performance.deviceCapabilities.isLowEnd ? "Yes" : "No"}
              </span>
            </div>
          </div>

          {/* Performance Tips */}
          <div className="border-t border-gray-600 pt-2 mt-2">
            <div className="text-gray-400 mb-1">Tips:</div>
            {performance.metrics.fps < 30 && performance.metrics.fps > 0 && (
              <div className="text-red-400 text-xs">• Low FPS detected</div>
            )}
            {performance.metrics.cacheHitRate < 0.5 && (
              <div className="text-yellow-400 text-xs">
                • Low cache hit rate
              </div>
            )}
            {performance.metrics.averageLoadTime > 2000 && (
              <div className="text-yellow-400 text-xs">
                • Slow asset loading
              </div>
            )}
            {performance.deviceCapabilities.isLowEnd && (
              <div className="text-blue-400 text-xs">
                • Low-end device optimizations active
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default PerformanceMonitor;
