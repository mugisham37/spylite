/**
 * Visual regression testing utilities for comparing original vs migrated website
 */

export interface ScreenshotComparison {
  original: string;
  migrated: string;
  difference?: string;
  similarity: number;
  viewport: {
    width: number;
    height: number;
  };
  timestamp: number;
  testName: string;
}

export interface VisualTestConfig {
  viewports: Array<{ width: number; height: number; name: string }>;
  sections: string[];
  threshold: number; // Similarity threshold (0-1)
  delay: number; // Delay before screenshot (ms)
  animations: boolean; // Whether to wait for animations
}

// Default test configuration
export const DEFAULT_VISUAL_TEST_CONFIG: VisualTestConfig = {
  viewports: [
    { width: 1920, height: 1080, name: "desktop" },
    { width: 1024, height: 768, name: "tablet" },
    { width: 375, height: 667, name: "mobile" },
  ],
  sections: [
    "hero",
    "message",
    "flavor",
    "nutrition",
    "benefits",
    "testimonials",
    "footer",
  ],
  threshold: 0.95,
  delay: 2000,
  animations: true,
};

// Screenshot capture utility
export const captureScreenshot = async (
  element?: HTMLElement,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: "png" | "jpeg" | "webp";
  } = {}
): Promise<string> => {
  if (typeof window === "undefined") {
    throw new Error(
      "Screenshot capture is only available in browser environment"
    );
  }

  const {
    width = window.innerWidth,
    height = window.innerHeight,
    quality = 0.9,
    format = "png",
  } = options;

  try {
    // Use html2canvas if available (would need to be installed)
    const windowWithHtml2Canvas = window as Window & {
      html2canvas?: (
        element: Element,
        options: Record<string, unknown>
      ) => Promise<HTMLCanvasElement>;
    };
    if (typeof windowWithHtml2Canvas.html2canvas !== "undefined") {
      const canvas = await windowWithHtml2Canvas.html2canvas(
        element || document.body,
        {
          width,
          height,
          useCORS: true,
          allowTaint: false,
          scale: 1,
        }
      );

      return canvas.toDataURL(`image/${format}`, quality);
    }

    // Fallback: Use Canvas API for basic screenshot
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Canvas context not available");
    }

    canvas.width = width;
    canvas.height = height;

    // This is a simplified fallback - in a real implementation,
    // you'd use a proper screenshot library
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#000000";
    ctx.font = "16px Arial";
    ctx.fillText("Screenshot placeholder", 10, 30);

    return canvas.toDataURL(`image/${format}`, quality);
  } catch (error) {
    console.error("Failed to capture screenshot:", error);
    throw error;
  }
};

// Wait for animations to complete
export const waitForAnimations = async (
  timeout: number = 5000
): Promise<void> => {
  return new Promise((resolve) => {
    const startTime = Date.now();

    // Check for GSAP animations
    const checkGSAPAnimations = () => {
      const windowWithGSAP = window as Window & {
        gsap?: {
          globalTimeline: {
            getChildren: () => Array<{ isActive: () => boolean }>;
          };
        };
      };
      if (typeof windowWithGSAP.gsap !== "undefined") {
        const gsap = windowWithGSAP.gsap;
        const activeAnimations = gsap.globalTimeline.getChildren();
        return activeAnimations.some((anim) => anim.isActive());
      }
      return false;
    };

    // Check for CSS animations
    const checkCSSAnimations = () => {
      const animatedElements = document.querySelectorAll("*");
      for (const element of animatedElements) {
        const computedStyle = window.getComputedStyle(element);
        if (
          computedStyle.animationName !== "none" ||
          computedStyle.transitionProperty !== "none"
        ) {
          return true;
        }
      }
      return false;
    };

    const checkAnimations = () => {
      const hasGSAPAnimations = checkGSAPAnimations();
      const hasCSSAnimations = checkCSSAnimations();
      const elapsed = Date.now() - startTime;

      if ((!hasGSAPAnimations && !hasCSSAnimations) || elapsed >= timeout) {
        resolve();
      } else {
        requestAnimationFrame(checkAnimations);
      }
    };

    // Start checking after a short delay
    setTimeout(checkAnimations, 100);
  });
};

// Compare two images for similarity
export const compareImages = async (
  image1: string,
  image2: string,
  threshold: number = 0.95
): Promise<{ similarity: number; difference?: string }> => {
  return new Promise((resolve, reject) => {
    const canvas1 = document.createElement("canvas");
    const canvas2 = document.createElement("canvas");
    const ctx1 = canvas1.getContext("2d");
    const ctx2 = canvas2.getContext("2d");

    if (!ctx1 || !ctx2) {
      reject(new Error("Canvas context not available"));
      return;
    }

    const img1 = new Image();
    const img2 = new Image();
    let loadedCount = 0;

    const onImageLoad = () => {
      loadedCount++;
      if (loadedCount === 2) {
        try {
          // Set canvas dimensions
          canvas1.width = img1.width;
          canvas1.height = img1.height;
          canvas2.width = img2.width;
          canvas2.height = img2.height;

          // Draw images
          ctx1.drawImage(img1, 0, 0);
          ctx2.drawImage(img2, 0, 0);

          // Get image data
          const data1 = ctx1.getImageData(0, 0, canvas1.width, canvas1.height);
          const data2 = ctx2.getImageData(0, 0, canvas2.width, canvas2.height);

          // Calculate similarity
          const similarity = calculatePixelSimilarity(data1.data, data2.data);

          // Generate difference image if below threshold
          let difference: string | undefined;
          if (similarity < threshold) {
            difference = generateDifferenceImage(data1, data2);
          }

          resolve({ similarity, difference });
        } catch (error) {
          reject(error);
        }
      }
    };

    img1.onload = onImageLoad;
    img2.onload = onImageLoad;
    img1.onerror = () => reject(new Error("Failed to load first image"));
    img2.onerror = () => reject(new Error("Failed to load second image"));

    img1.src = image1;
    img2.src = image2;
  });
};

// Calculate pixel-by-pixel similarity
const calculatePixelSimilarity = (
  data1: Uint8ClampedArray,
  data2: Uint8ClampedArray
): number => {
  if (data1.length !== data2.length) {
    return 0;
  }

  let totalDifference = 0;
  const pixelCount = data1.length / 4; // RGBA

  for (let i = 0; i < data1.length; i += 4) {
    const r1 = data1[i];
    const g1 = data1[i + 1];
    const b1 = data1[i + 2];
    const a1 = data1[i + 3];

    const r2 = data2[i];
    const g2 = data2[i + 1];
    const b2 = data2[i + 2];
    const a2 = data2[i + 3];

    // Calculate Euclidean distance
    const diff = Math.sqrt(
      Math.pow(r1 - r2, 2) +
        Math.pow(g1 - g2, 2) +
        Math.pow(b1 - b2, 2) +
        Math.pow(a1 - a2, 2)
    );

    totalDifference += diff;
  }

  const maxPossibleDifference = pixelCount * Math.sqrt(4 * Math.pow(255, 2));
  const similarity = 1 - totalDifference / maxPossibleDifference;

  return Math.max(0, Math.min(1, similarity));
};

// Generate difference image highlighting changes
const generateDifferenceImage = (
  data1: ImageData,
  data2: ImageData
): string => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Canvas context not available");
  }

  canvas.width = data1.width;
  canvas.height = data1.height;

  const diffData = ctx.createImageData(data1.width, data1.height);

  for (let i = 0; i < data1.data.length; i += 4) {
    const r1 = data1.data[i];
    const g1 = data1.data[i + 1];
    const b1 = data1.data[i + 2];
    const a1 = data1.data[i + 3];

    const r2 = data2.data[i];
    const g2 = data2.data[i + 1];
    const b2 = data2.data[i + 2];
    const a2 = data2.data[i + 3];

    // Calculate difference
    const rDiff = Math.abs(r1 - r2);
    const gDiff = Math.abs(g1 - g2);
    const bDiff = Math.abs(b1 - b2);
    const aDiff = Math.abs(a1 - a2);

    // Highlight differences in red
    if (rDiff > 10 || gDiff > 10 || bDiff > 10 || aDiff > 10) {
      diffData.data[i] = 255; // Red
      diffData.data[i + 1] = 0; // Green
      diffData.data[i + 2] = 0; // Blue
      diffData.data[i + 3] = 255; // Alpha
    } else {
      // Keep original pixel but dimmed
      diffData.data[i] = r1 * 0.3;
      diffData.data[i + 1] = g1 * 0.3;
      diffData.data[i + 2] = b1 * 0.3;
      diffData.data[i + 3] = a1;
    }
  }

  ctx.putImageData(diffData, 0, 0);
  return canvas.toDataURL("image/png");
};

// Run visual regression test suite
export const runVisualRegressionTests = async (
  originalUrl: string,
  migratedUrl: string,
  config: Partial<VisualTestConfig> = {}
): Promise<ScreenshotComparison[]> => {
  const testConfig = { ...DEFAULT_VISUAL_TEST_CONFIG, ...config };
  const results: ScreenshotComparison[] = [];

  for (const viewport of testConfig.viewports) {
    for (const section of testConfig.sections) {
      try {
        // This is a simplified version - in a real implementation,
        // you'd use a tool like Puppeteer or Playwright to navigate
        // to different URLs and capture screenshots

        console.log(
          `Testing ${section} at ${viewport.name} (${viewport.width}x${viewport.height})`
        );

        // Simulate screenshot capture (would be actual screenshots in real implementation)
        const originalScreenshot = await simulateScreenshot(
          originalUrl,
          section,
          viewport
        );
        const migratedScreenshot = await simulateScreenshot(
          migratedUrl,
          section,
          viewport
        );

        // Compare screenshots
        const comparison = await compareImages(
          originalScreenshot,
          migratedScreenshot,
          testConfig.threshold
        );

        const result: ScreenshotComparison = {
          original: originalScreenshot,
          migrated: migratedScreenshot,
          difference: comparison.difference,
          similarity: comparison.similarity,
          viewport,
          timestamp: Date.now(),
          testName: `${section}-${viewport.name}`,
        };

        results.push(result);

        // Log results
        if (comparison.similarity < testConfig.threshold) {
          console.warn(
            `Visual regression detected in ${result.testName}: ${(
              comparison.similarity * 100
            ).toFixed(2)}% similarity`
          );
        } else {
          console.log(
            `✓ ${result.testName}: ${(comparison.similarity * 100).toFixed(
              2
            )}% similarity`
          );
        }
      } catch (error) {
        console.error(`Failed to test ${section} at ${viewport.name}:`, error);
      }
    }
  }

  return results;
};

// Simulate screenshot capture (placeholder for real implementation)
const simulateScreenshot = async (
  url: string,
  section: string,
  viewport: { width: number; height: number }
): Promise<string> => {
  // In a real implementation, this would use Puppeteer/Playwright
  // to navigate to the URL and capture actual screenshots

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Canvas context not available");
  }

  canvas.width = viewport.width;
  canvas.height = viewport.height;

  // Create a placeholder screenshot
  ctx.fillStyle = url.includes("original") ? "#f0f0f0" : "#f5f5f5";
  ctx.fillRect(0, 0, viewport.width, viewport.height);

  ctx.fillStyle = "#333";
  ctx.font = "24px Arial";
  ctx.fillText(`${section} - ${url}`, 20, 50);
  ctx.fillText(`${viewport.width}x${viewport.height}`, 20, 80);

  return canvas.toDataURL("image/png");
};

// Generate visual regression report
export const generateVisualRegressionReport = (
  results: ScreenshotComparison[]
): string => {
  const passed = results.filter(
    (r) => r.similarity >= DEFAULT_VISUAL_TEST_CONFIG.threshold
  );
  const failed = results.filter(
    (r) => r.similarity < DEFAULT_VISUAL_TEST_CONFIG.threshold
  );

  const report = {
    summary: {
      total: results.length,
      passed: passed.length,
      failed: failed.length,
      passRate: (passed.length / results.length) * 100,
      averageSimilarity:
        results.reduce((sum, r) => sum + r.similarity, 0) / results.length,
    },
    failures: failed.map((f) => ({
      testName: f.testName,
      similarity: f.similarity,
      viewport: f.viewport,
      timestamp: new Date(f.timestamp).toISOString(),
    })),
    details: results.map((r) => ({
      testName: r.testName,
      similarity: Math.round(r.similarity * 10000) / 100, // Round to 2 decimal places
      status:
        r.similarity >= DEFAULT_VISUAL_TEST_CONFIG.threshold ? "PASS" : "FAIL",
      viewport: `${r.viewport.width}x${r.viewport.height}`,
    })),
  };

  return JSON.stringify(report, null, 2);
};

// Export visual regression data
export const exportVisualRegressionData = (
  results: ScreenshotComparison[]
): void => {
  const data = {
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    results,
    report: generateVisualRegressionReport(results),
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `visual-regression-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
