/**
 * Performance testing page for running comprehensive performance tests
 */

import { Suspense } from "react";
import { PerformanceTest } from "@/components/test/PerformanceTest";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export const metadata = {
  title: "Performance Testing - GSAP Awwwards Website",
  description:
    "Comprehensive performance testing suite for animation performance, Core Web Vitals, and visual regression testing",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PerformanceTestPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Performance Testing Suite
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive testing for animation performance, Core Web Vitals
            optimization, and visual regression testing against the original
            website.
          </p>
        </div>

        <Suspense fallback={<LoadingSpinner />}>
          <PerformanceTest />
        </Suspense>

        <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Testing Information</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">
                Animation Performance Tests
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Frame rate monitoring (target: 60 FPS)</li>
                <li>• Frame drop detection</li>
                <li>• Animation timing accuracy</li>
                <li>• GPU acceleration verification</li>
                <li>• Memory usage during animations</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Core Web Vitals</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Largest Contentful Paint (LCP)</li>
                <li>• First Input Delay (FID)</li>
                <li>• Cumulative Layout Shift (CLS)</li>
                <li>• First Contentful Paint (FCP)</li>
                <li>• Time to First Byte (TTFB)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Visual Regression</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Pixel-perfect comparison</li>
                <li>• Multi-viewport testing</li>
                <li>• Animation state verification</li>
                <li>• Layout consistency checks</li>
                <li>• Cross-browser compatibility</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">
                Device Optimization
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Low-end device detection</li>
                <li>• Reduced motion preferences</li>
                <li>• Network condition adaptation</li>
                <li>• Memory constraint handling</li>
                <li>• CPU core optimization</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">
              Performance Targets
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="font-medium">LCP</div>
                <div className="text-blue-700">&lt; 2.5s</div>
              </div>
              <div>
                <div className="font-medium">FID</div>
                <div className="text-blue-700">&lt; 100ms</div>
              </div>
              <div>
                <div className="font-medium">CLS</div>
                <div className="text-blue-700">&lt; 0.1</div>
              </div>
              <div>
                <div className="font-medium">Animation FPS</div>
                <div className="text-blue-700">&gt; 55 FPS</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
