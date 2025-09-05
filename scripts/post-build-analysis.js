#!/usr/bin/env node

/**
 * Post-build analysis script for production optimization validation
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// ANSI color codes for console output
const colors = {
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  reset: "\x1b[0m",
  bold: "\x1b[1m",
};

// Log with colors
const log = {
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  header: (msg) =>
    console.log(`\n${colors.bold}${colors.blue}${msg}${colors.reset}\n`),
};

// Configuration
const BUILD_DIR = ".next";
const STATIC_DIR = path.join(BUILD_DIR, "static");
const ANALYSIS_OUTPUT = "build-analysis.json";

// File size thresholds (in bytes)
const THRESHOLDS = {
  JS_CHUNK_MAX: 250 * 1024, // 250KB
  CSS_CHUNK_MAX: 50 * 1024, // 50KB
  TOTAL_JS_MAX: 1024 * 1024, // 1MB
  TOTAL_CSS_MAX: 100 * 1024, // 100KB
};

async function analyzeBuild() {
  log.header("🔍 Post-Build Analysis");

  const analysis = {
    timestamp: new Date().toISOString(),
    buildSize: {},
    chunks: {},
    performance: {},
    recommendations: [],
    passed: true,
  };

  try {
    // Check if build directory exists
    if (!fs.existsSync(BUILD_DIR)) {
      log.error('Build directory not found. Run "npm run build" first.');
      process.exit(1);
    }

    // Analyze build size
    await analyzeBuildSize(analysis);

    // Analyze chunks
    await analyzeChunks(analysis);

    // Check for optimization opportunities
    await checkOptimizations(analysis);

    // Generate recommendations
    generateRecommendations(analysis);

    // Save analysis results
    fs.writeFileSync(ANALYSIS_OUTPUT, JSON.stringify(analysis, null, 2));
    log.info(`Analysis saved to ${ANALYSIS_OUTPUT}`);

    // Print summary
    printSummary(analysis);

    if (!analysis.passed) {
      log.error(
        "Build analysis failed. Please review the recommendations above."
      );
      process.exit(1);
    }

    log.success("Build analysis completed successfully!");
  } catch (error) {
    log.error(`Analysis failed: ${error.message}`);
    process.exit(1);
  }
}

async function analyzeBuildSize(analysis) {
  log.info("Analyzing build size...");

  const getBuildSize = (dir) => {
    let totalSize = 0;
    const files = fs.readdirSync(dir, { withFileTypes: true });

    for (const file of files) {
      const filePath = path.join(dir, file.name);
      if (file.isDirectory()) {
        totalSize += getBuildSize(filePath);
      } else {
        totalSize += fs.statSync(filePath).size;
      }
    }
    return totalSize;
  };

  const totalSize = getBuildSize(BUILD_DIR);
  const staticSize = fs.existsSync(STATIC_DIR) ? getBuildSize(STATIC_DIR) : 0;

  analysis.buildSize = {
    total: totalSize,
    static: staticSize,
    totalMB: (totalSize / (1024 * 1024)).toFixed(2),
    staticMB: (staticSize / (1024 * 1024)).toFixed(2),
  };

  log.success(`Total build size: ${analysis.buildSize.totalMB}MB`);
  log.success(`Static assets size: ${analysis.buildSize.staticMB}MB`);
}

async function analyzeChunks(analysis) {
  log.info("Analyzing JavaScript and CSS chunks...");

  const chunks = {
    js: [],
    css: [],
    totalJSSize: 0,
    totalCSSSize: 0,
  };

  // Find all JS and CSS files in static directory
  if (fs.existsSync(STATIC_DIR)) {
    const findFiles = (dir, extension) => {
      const files = [];
      const items = fs.readdirSync(dir, { withFileTypes: true });

      for (const item of items) {
        const itemPath = path.join(dir, item.name);
        if (item.isDirectory()) {
          files.push(...findFiles(itemPath, extension));
        } else if (item.name.endsWith(extension)) {
          const stats = fs.statSync(itemPath);
          files.push({
            name: item.name,
            path: itemPath,
            size: stats.size,
            sizeKB: (stats.size / 1024).toFixed(2),
          });
        }
      }
      return files;
    };

    chunks.js = findFiles(STATIC_DIR, ".js");
    chunks.css = findFiles(STATIC_DIR, ".css");

    chunks.totalJSSize = chunks.js.reduce((sum, file) => sum + file.size, 0);
    chunks.totalCSSSize = chunks.css.reduce((sum, file) => sum + file.size, 0);

    // Check for large chunks
    const largeJSChunks = chunks.js.filter(
      (file) => file.size > THRESHOLDS.JS_CHUNK_MAX
    );
    const largeCSSChunks = chunks.css.filter(
      (file) => file.size > THRESHOLDS.CSS_CHUNK_MAX
    );

    if (largeJSChunks.length > 0) {
      analysis.passed = false;
      largeJSChunks.forEach((chunk) => {
        log.warning(
          `Large JS chunk detected: ${chunk.name} (${chunk.sizeKB}KB)`
        );
      });
    }

    if (largeCSSChunks.length > 0) {
      analysis.passed = false;
      largeCSSChunks.forEach((chunk) => {
        log.warning(
          `Large CSS chunk detected: ${chunk.name} (${chunk.sizeKB}KB)`
        );
      });
    }

    // Check total sizes
    if (chunks.totalJSSize > THRESHOLDS.TOTAL_JS_MAX) {
      analysis.passed = false;
      log.warning(
        `Total JS size exceeds threshold: ${(chunks.totalJSSize / 1024).toFixed(
          2
        )}KB > ${(THRESHOLDS.TOTAL_JS_MAX / 1024).toFixed(2)}KB`
      );
    }

    if (chunks.totalCSSSize > THRESHOLDS.TOTAL_CSS_MAX) {
      analysis.passed = false;
      log.warning(
        `Total CSS size exceeds threshold: ${(
          chunks.totalCSSSize / 1024
        ).toFixed(2)}KB > ${(THRESHOLDS.TOTAL_CSS_MAX / 1024).toFixed(2)}KB`
      );
    }
  }

  analysis.chunks = chunks;
  log.success(
    `JS chunks: ${chunks.js.length} files, ${(
      chunks.totalJSSize / 1024
    ).toFixed(2)}KB total`
  );
  log.success(
    `CSS chunks: ${chunks.css.length} files, ${(
      chunks.totalCSSSize / 1024
    ).toFixed(2)}KB total`
  );
}

async function checkOptimizations(analysis) {
  log.info("Checking optimization opportunities...");

  const optimizations = {
    compression: false,
    minification: false,
    treeshaking: false,
    codesplitting: false,
  };

  // Check if files are minified (basic check)
  if (analysis.chunks.js.length > 0) {
    const sampleJS = fs.readFileSync(analysis.chunks.js[0].path, "utf8");
    optimizations.minification =
      !sampleJS.includes("\n  ") && !sampleJS.includes("  //");
  }

  // Check for code splitting (multiple JS chunks indicate splitting)
  optimizations.codesplitting = analysis.chunks.js.length > 1;

  // Check for tree shaking (smaller bundle sizes indicate effective tree shaking)
  optimizations.treeshaking =
    analysis.chunks.totalJSSize < THRESHOLDS.TOTAL_JS_MAX * 0.8;

  analysis.performance.optimizations = optimizations;

  if (optimizations.minification) {
    log.success("Code minification: Enabled");
  } else {
    log.warning("Code minification: Not detected");
    analysis.recommendations.push(
      "Enable code minification for production builds"
    );
  }

  if (optimizations.codesplitting) {
    log.success("Code splitting: Enabled");
  } else {
    log.warning("Code splitting: Limited");
    analysis.recommendations.push("Implement more aggressive code splitting");
  }
}

function generateRecommendations(analysis) {
  log.info("Generating optimization recommendations...");

  // Large chunk recommendations
  const largeJSChunks = analysis.chunks.js.filter(
    (file) => file.size > THRESHOLDS.JS_CHUNK_MAX
  );
  if (largeJSChunks.length > 0) {
    analysis.recommendations.push(
      "Consider splitting large JavaScript chunks using dynamic imports"
    );
    analysis.recommendations.push(
      "Review and optimize GSAP imports to reduce bundle size"
    );
  }

  // Total size recommendations
  if (analysis.chunks.totalJSSize > THRESHOLDS.TOTAL_JS_MAX) {
    analysis.recommendations.push(
      "Implement lazy loading for non-critical components"
    );
    analysis.recommendations.push(
      "Consider using a CDN for large third-party libraries"
    );
  }

  // Performance recommendations
  if (analysis.buildSize.total > 10 * 1024 * 1024) {
    // 10MB
    analysis.recommendations.push(
      "Consider implementing service worker for caching"
    );
    analysis.recommendations.push(
      "Optimize images and videos for web delivery"
    );
  }

  // Security recommendations
  analysis.recommendations.push(
    "Ensure all environment variables are properly configured"
  );
  analysis.recommendations.push(
    "Verify Content Security Policy headers are set"
  );
  analysis.recommendations.push(
    "Enable security headers for production deployment"
  );
}

function printSummary(analysis) {
  log.header("📊 Build Analysis Summary");

  console.log(`Build Size: ${analysis.buildSize.totalMB}MB`);
  console.log(
    `JavaScript: ${(analysis.chunks.totalJSSize / 1024).toFixed(2)}KB (${
      analysis.chunks.js.length
    } files)`
  );
  console.log(
    `CSS: ${(analysis.chunks.totalCSSSize / 1024).toFixed(2)}KB (${
      analysis.chunks.css.length
    } files)`
  );

  if (analysis.recommendations.length > 0) {
    log.header("💡 Recommendations");
    analysis.recommendations.forEach((rec, index) => {
      console.log(`${index + 1}. ${rec}`);
    });
  }

  const status = analysis.passed ? "PASSED" : "NEEDS ATTENTION";
  const statusColor = analysis.passed ? colors.green : colors.yellow;
  console.log(
    `\n${colors.bold}Status: ${statusColor}${status}${colors.reset}\n`
  );
}

// Run analysis
if (require.main === module) {
  analyzeBuild().catch((error) => {
    log.error(`Unexpected error: ${error.message}`);
    process.exit(1);
  });
}

module.exports = { analyzeBuild };
