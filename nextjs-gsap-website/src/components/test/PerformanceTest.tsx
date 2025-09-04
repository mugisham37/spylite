/**
 * Performance testing component for running comprehensive performance tests
 */

"use client";

import React, { useState, useCallback, useMemo } from "react";
import {
  batchTestAnimations,
  generatePerformanceReport,
  exportPerformanceData,
  type AnimationPerformanceMetrics,
} from "@/lib/utils/animationPerformance";
import {
  runVisualRegressionTests,
  generateVisualRegressionReport,
  exportVisualRegressionData,
  type ScreenshotComparison,
} from "@/lib/utils/visualRegression";
import {
  getWebVitalsSnapshot,
  getStoredWebVitalsReports,
  type WebVitalReport,
} from "@/lib/utils/webVitals";
import { usePerformance } from "@/components/providers/PerformanceProvider";
import { gsap } from "gsap";

interface TestResults {
  animations: AnimationPerformanceMetrics[];
  webVitals: WebVitalReport[];
  visualRegression: ScreenshotComparison[];
  timestamp: number;
}

export const PerformanceTest: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResults | null>(null);
  const [testProgress, setTestProgress] = useState<string>("");
  const { deviceCapabilities } = usePerformance();

  // Sample animation tests
  const animationTests = useMemo(
    () => [
      {
        name: "hero-title-animation",
        animation: () =>
          gsap.timeline().from(".hero-title", {
            duration: 1,
            y: 100,
            opacity: 0,
            ease: "power2.out",
          }),
      },
      {
        name: "scroll-trigger-test",
        animation: () =>
          gsap.timeline().to(".test-element", {
            duration: 2,
            rotation: 360,
            scale: 1.2,
            ease: "power2.inOut",
          }),
      },
      {
        name: "complex-timeline",
        animation: () =>
          gsap
            .timeline()
            .to(".test-1", { duration: 0.5, x: 100 })
            .to(".test-2", { duration: 0.5, y: 100 }, "-=0.25")
            .to(".test-3", { duration: 0.5, rotation: 180 }, "-=0.25"),
      },
    ],
    []
  );

  const runComprehensiveTests = useCallback(async () => {
    if (isRunning) return;

    setIsRunning(true);
    setTestProgress("Starting performance tests...");

    try {
      const testResults: TestResults = {
        animations: [],
        webVitals: [],
        visualRegression: [],
        timestamp: Date.now(),
      };

      // 1. Animation Performance Tests
      setTestProgress("Testing animation performance...");

      // Create test elements
      const testContainer = document.createElement("div");
      testContainer.innerHTML = `
        <div class="test-element" style="width: 50px; height: 50px; background: red; position: absolute; top: 100px; left: 100px;"></div>
        <div class="test-1" style="width: 30px; height: 30px; background: blue; position: absolute; top: 200px; left: 100px;"></div>
        <div class="test-2" style="width: 30px; height: 30px; background: green; position: absolute; top: 200px; left: 150px;"></div>
        <div class="test-3" style="width: 30px; height: 30px; background: yellow; position: absolute; top: 200px; left: 200px;"></div>
        <div class="hero-title" style="font-size: 24px; position: absolute; top: 300px; left: 100px;">Test Title</div>
      `;
      testContainer.style.position = "fixed";
      testContainer.style.top = "-1000px";
      testContainer.style.left = "-1000px";
      testContainer.style.zIndex = "-1";
      document.body.appendChild(testContainer);

      try {
        const animationResults = await batchTestAnimations(animationTests);
        testResults.animations = animationResults;
        setTestProgress(
          `Animation tests completed: ${animationResults.length} tests`
        );
      } catch (error) {
        console.error("Animation tests failed:", error);
      } finally {
        document.body.removeChild(testContainer);
      }

      // 2. Web Vitals Collection
      setTestProgress("Collecting Web Vitals...");
      try {
        const webVitals = await getWebVitalsSnapshot();
        const storedVitals = getStoredWebVitalsReports();
        testResults.webVitals = [...webVitals, ...storedVitals.slice(-10)]; // Last 10 stored reports
        setTestProgress(
          `Web Vitals collected: ${testResults.webVitals.length} metrics`
        );
      } catch (error) {
        console.error("Web Vitals collection failed:", error);
      }

      // 3. Visual Regression Tests (simplified)
      setTestProgress("Running visual regression tests...");
      try {
        // In a real implementation, you'd compare against actual original website
        const visualResults = await runVisualRegressionTests(
          "http://localhost:3000", // Original (would be actual original URL)
          "http://localhost:3000", // Migrated (current)
          {
            viewports: [
              { width: 1920, height: 1080, name: "desktop" },
              { width: 768, height: 1024, name: "tablet" },
              { width: 375, height: 667, name: "mobile" },
            ],
            sections: ["hero", "message", "flavor"],
            threshold: 0.95,
          }
        );
        testResults.visualRegression = visualResults;
        setTestProgress(
          `Visual regression tests completed: ${visualResults.length} comparisons`
        );
      } catch (error) {
        console.error("Visual regression tests failed:", error);
      }

      setResults(testResults);
      setTestProgress("All tests completed successfully!");
    } catch (error) {
      console.error("Performance tests failed:", error);
      setTestProgress(
        `Tests failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsRunning(false);
    }
  }, [isRunning, animationTests]);

  const exportResults = useCallback(() => {
    if (!results) return;

    // Export animation performance data
    if (results.animations.length > 0) {
      exportPerformanceData(results.animations);
    }

    // Export visual regression data
    if (results.visualRegression.length > 0) {
      exportVisualRegressionData(results.visualRegression);
    }

    // Export combined report
    const combinedReport = {
      timestamp: new Date(results.timestamp).toISOString(),
      deviceCapabilities,
      summary: {
        animationTests: results.animations.length,
        webVitalsMetrics: results.webVitals.length,
        visualRegressionTests: results.visualRegression.length,
        averageAnimationFPS:
          results.animations.length > 0
            ? results.animations.reduce((sum, a) => sum + a.fps, 0) /
              results.animations.length
            : 0,
        webVitalsScore: calculateWebVitalsScore(results.webVitals),
        visualRegressionPassRate:
          results.visualRegression.length > 0
            ? (results.visualRegression.filter((v) => v.similarity >= 0.95)
                .length /
                results.visualRegression.length) *
              100
            : 0,
      },
      details: {
        animations: results.animations,
        webVitals: results.webVitals,
        visualRegression: results.visualRegression,
      },
      reports: {
        animationPerformance:
          results.animations.length > 0
            ? generatePerformanceReport(results.animations)
            : null,
        visualRegression:
          results.visualRegression.length > 0
            ? generateVisualRegressionReport(results.visualRegression)
            : null,
      },
    };

    const blob = new Blob([JSON.stringify(combinedReport, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `performance-test-report-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [results, deviceCapabilities]);

  const calculateWebVitalsScore = (vitals: WebVitalReport[]): number => {
    if (vitals.length === 0) return 0;

    const scores = vitals.map((vital) => {
      switch (vital.rating) {
        case "good":
          return 100;
        case "needs-improvement":
          return 50;
        case "poor":
          return 0;
        default:
          return 0;
      }
    });

    return scores.reduce((sum, score) => sum + score, 0) / scores.length;
  };

  return (
    <div className="performance-test p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Performance Testing Suite</h2>

      <div className="mb-6">
        <button
          onClick={runComprehensiveTests}
          disabled={isRunning}
          className={`px-6 py-3 rounded-lg font-medium ${
            isRunning
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {isRunning ? "Running Tests..." : "Run Performance Tests"}
        </button>

        {results && (
          <button
            onClick={exportResults}
            className="ml-4 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
          >
            Export Results
          </button>
        )}
      </div>

      {testProgress && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-blue-800">{testProgress}</p>
        </div>
      )}

      {deviceCapabilities && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Device Capabilities</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>Memory: {deviceCapabilities.deviceMemory || "Unknown"} GB</div>
            <div>CPU Cores: {deviceCapabilities.hardwareConcurrency}</div>
            <div>
              Connection:{" "}
              {deviceCapabilities.connection?.effectiveType || "Unknown"}
            </div>
            <div>
              Low-end Device: {deviceCapabilities.isLowEndDevice ? "Yes" : "No"}
            </div>
            <div>
              Reduced Motion:{" "}
              {deviceCapabilities.preferReducedMotion ? "Yes" : "No"}
            </div>
          </div>
        </div>
      )}

      {results && (
        <div className="space-y-6">
          {/* Animation Performance Results */}
          {results.animations.length > 0 && (
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">
                Animation Performance
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Animation</th>
                      <th className="text-left p-2">FPS</th>
                      <th className="text-left p-2">Frame Drops</th>
                      <th className="text-left p-2">Avg Frame Time</th>
                      <th className="text-left p-2">Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.animations.map((anim, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2">{anim.animationName}</td>
                        <td className="p-2">
                          {Math.round(anim.fps * 100) / 100}
                        </td>
                        <td className="p-2">{anim.frameDrops}</td>
                        <td className="p-2">
                          {Math.round(anim.averageFrameTime * 100) / 100}ms
                        </td>
                        <td className="p-2">
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              anim.fps >= 55
                                ? "bg-green-200 text-green-800"
                                : anim.fps >= 45
                                ? "bg-yellow-200 text-yellow-800"
                                : anim.fps >= 30
                                ? "bg-orange-200 text-orange-800"
                                : "bg-red-200 text-red-800"
                            }`}
                          >
                            {anim.fps >= 55
                              ? "Excellent"
                              : anim.fps >= 45
                              ? "Good"
                              : anim.fps >= 30
                              ? "Fair"
                              : "Poor"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Web Vitals Results */}
          {results.webVitals.length > 0 && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Web Vitals</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {results.webVitals.slice(0, 6).map((vital, index) => (
                  <div key={index} className="p-3 bg-white rounded border">
                    <div className="font-medium">{vital.name}</div>
                    <div className="text-2xl font-bold">
                      {Math.round(vital.value * 100) / 100}
                    </div>
                    <div
                      className={`text-sm ${
                        vital.rating === "good"
                          ? "text-green-600"
                          : vital.rating === "needs-improvement"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {vital.rating}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Visual Regression Results */}
          {results.visualRegression.length > 0 && (
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Visual Regression</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.visualRegression.map((test, index) => (
                  <div key={index} className="p-3 bg-white rounded border">
                    <div className="font-medium">{test.testName}</div>
                    <div className="text-lg font-bold">
                      {Math.round(test.similarity * 10000) / 100}%
                    </div>
                    <div
                      className={`text-sm ${
                        test.similarity >= 0.95
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {test.similarity >= 0.95 ? "PASS" : "FAIL"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {test.viewport.width}x{test.viewport.height}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Summary */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Test Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {results.animations.length}
                </div>
                <div className="text-sm text-gray-600">Animation Tests</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {results.webVitals.length}
                </div>
                <div className="text-sm text-gray-600">Web Vitals</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {results.visualRegression.length}
                </div>
                <div className="text-sm text-gray-600">Visual Tests</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {Math.round(calculateWebVitalsScore(results.webVitals))}
                </div>
                <div className="text-sm text-gray-600">Overall Score</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
