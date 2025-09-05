#!/usr/bin/env node

/**
 * Pre-deployment validation script
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// ANSI color codes
const colors = {
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  reset: "\x1b[0m",
  bold: "\x1b[1m",
};

const log = {
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  header: (msg) =>
    console.log(`\n${colors.bold}${colors.blue}${msg}${colors.reset}\n`),
};

async function runDeploymentCheck() {
  log.header("🚀 Pre-Deployment Validation");

  let allChecksPassed = true;
  const results = {
    timestamp: new Date().toISOString(),
    checks: {},
    environment: process.env.NODE_ENV || "development",
    passed: true,
  };

  try {
    // Environment checks
    allChecksPassed &= await checkEnvironment(results);

    // Build checks
    allChecksPassed &= await checkBuild(results);

    // Security checks
    allChecksPassed &= await checkSecurity(results);

    // Performance checks
    allChecksPassed &= await checkPerformance(results);

    // Dependencies checks
    allChecksPassed &= await checkDependencies(results);

    // Configuration checks
    allChecksPassed &= await checkConfiguration(results);

    results.passed = allChecksPassed;

    // Save results
    fs.writeFileSync(
      "deployment-check-results.json",
      JSON.stringify(results, null, 2)
    );

    // Print summary
    printDeploymentSummary(results);

    if (!allChecksPassed) {
      log.error(
        "Deployment validation failed. Please fix the issues above before deploying."
      );
      process.exit(1);
    }

    log.success(
      "All deployment checks passed! Ready for production deployment."
    );
  } catch (error) {
    log.error(`Deployment check failed: ${error.message}`);
    process.exit(1);
  }
}

async function checkEnvironment(results) {
  log.info("Checking environment configuration...");
  let passed = true;

  const checks = {
    nodeEnv: false,
    envFiles: false,
    requiredVars: false,
  };

  // Check NODE_ENV
  if (process.env.NODE_ENV === "production") {
    checks.nodeEnv = true;
    log.success("NODE_ENV is set to production");
  } else {
    log.warning(`NODE_ENV is set to: ${process.env.NODE_ENV || "undefined"}`);
    passed = false;
  }

  // Check for environment files
  const envFiles = [".env.production", ".env.local"];
  const existingEnvFiles = envFiles.filter((file) => fs.existsSync(file));

  if (existingEnvFiles.length > 0) {
    checks.envFiles = true;
    log.success(`Environment files found: ${existingEnvFiles.join(", ")}`);
  } else {
    log.warning("No environment files found");
  }

  // Check required environment variables
  const requiredVars = ["NEXT_PUBLIC_APP_ENV", "NEXT_PUBLIC_APP_VERSION"];

  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length === 0) {
    checks.requiredVars = true;
    log.success("All required environment variables are set");
  } else {
    log.error(`Missing environment variables: ${missingVars.join(", ")}`);
    passed = false;
  }

  results.checks.environment = checks;
  return passed;
}

async function checkBuild(results) {
  log.info("Checking build artifacts...");
  let passed = true;

  const checks = {
    buildExists: false,
    staticAssets: false,
    manifestExists: false,
  };

  // Check if build directory exists
  if (fs.existsSync(".next")) {
    checks.buildExists = true;
    log.success("Build directory exists");

    // Check for static assets
    if (fs.existsSync(".next/static")) {
      checks.staticAssets = true;
      log.success("Static assets directory exists");
    } else {
      log.error("Static assets directory not found");
      passed = false;
    }

    // Check for build manifest
    if (fs.existsSync(".next/build-manifest.json")) {
      checks.manifestExists = true;
      log.success("Build manifest exists");
    } else {
      log.warning("Build manifest not found");
    }
  } else {
    log.error('Build directory not found. Run "npm run build" first.');
    passed = false;
  }

  results.checks.build = checks;
  return passed;
}

async function checkSecurity(results) {
  log.info("Checking security configuration...");
  let passed = true;

  const checks = {
    nextConfig: false,
    headers: false,
    csp: false,
  };

  // Check Next.js configuration
  if (fs.existsSync("next.config.js")) {
    const configContent = fs.readFileSync("next.config.js", "utf8");

    // Check for security headers
    if (
      configContent.includes("headers()") &&
      configContent.includes("X-Frame-Options")
    ) {
      checks.headers = true;
      log.success("Security headers configured");
    } else {
      log.error("Security headers not properly configured");
      passed = false;
    }

    // Check for CSP
    if (configContent.includes("Content-Security-Policy")) {
      checks.csp = true;
      log.success("Content Security Policy configured");
    } else {
      log.warning("Content Security Policy not found");
    }

    checks.nextConfig = true;
  } else {
    log.error("next.config.js not found");
    passed = false;
  }

  results.checks.security = checks;
  return passed;
}

async function checkPerformance(results) {
  log.info("Checking performance configuration...");
  let passed = true;

  const checks = {
    compression: false,
    imageOptimization: false,
    caching: false,
  };

  if (fs.existsSync("next.config.js")) {
    const configContent = fs.readFileSync("next.config.js", "utf8");

    // Check compression
    if (configContent.includes("compress: true")) {
      checks.compression = true;
      log.success("Compression enabled");
    } else {
      log.warning("Compression not enabled");
    }

    // Check image optimization
    if (
      configContent.includes("images:") &&
      configContent.includes("formats")
    ) {
      checks.imageOptimization = true;
      log.success("Image optimization configured");
    } else {
      log.warning("Image optimization not properly configured");
    }

    // Check caching headers
    if (configContent.includes("Cache-Control")) {
      checks.caching = true;
      log.success("Caching headers configured");
    } else {
      log.warning("Caching headers not found");
    }
  }

  results.checks.performance = checks;
  return passed;
}

async function checkDependencies(results) {
  log.info("Checking dependencies...");
  let passed = true;

  const checks = {
    packageJson: false,
    lockFile: false,
    vulnerabilities: false,
  };

  // Check package.json
  if (fs.existsSync("package.json")) {
    checks.packageJson = true;
    log.success("package.json exists");

    // Check for lock file
    if (fs.existsSync("package-lock.json") || fs.existsSync("yarn.lock")) {
      checks.lockFile = true;
      log.success("Lock file exists");
    } else {
      log.warning("No lock file found");
    }

    // Check for vulnerabilities (if npm audit is available)
    try {
      execSync("npm audit --audit-level=high", { stdio: "pipe" });
      checks.vulnerabilities = true;
      log.success("No high-severity vulnerabilities found");
    } catch (error) {
      log.warning(
        'High-severity vulnerabilities detected. Run "npm audit" for details.'
      );
    }
  } else {
    log.error("package.json not found");
    passed = false;
  }

  results.checks.dependencies = checks;
  return passed;
}

async function checkConfiguration(results) {
  log.info("Checking configuration files...");
  let passed = true;

  const checks = {
    typescript: false,
    eslint: false,
    tailwind: false,
  };

  // Check TypeScript configuration
  if (fs.existsSync("tsconfig.json")) {
    checks.typescript = true;
    log.success("TypeScript configuration exists");
  } else {
    log.warning("TypeScript configuration not found");
  }

  // Check ESLint configuration
  if (fs.existsSync(".eslintrc.json") || fs.existsSync(".eslintrc.js")) {
    checks.eslint = true;
    log.success("ESLint configuration exists");
  } else {
    log.warning("ESLint configuration not found");
  }

  // Check Tailwind configuration
  if (
    fs.existsSync("tailwind.config.ts") ||
    fs.existsSync("tailwind.config.js")
  ) {
    checks.tailwind = true;
    log.success("Tailwind CSS configuration exists");
  } else {
    log.warning("Tailwind CSS configuration not found");
  }

  results.checks.configuration = checks;
  return passed;
}

function printDeploymentSummary(results) {
  log.header("📋 Deployment Check Summary");

  const categories = Object.keys(results.checks);
  let totalChecks = 0;
  let passedChecks = 0;

  categories.forEach((category) => {
    const checks = results.checks[category];
    const categoryPassed = Object.values(checks).filter(Boolean).length;
    const categoryTotal = Object.keys(checks).length;

    totalChecks += categoryTotal;
    passedChecks += categoryPassed;

    const status = categoryPassed === categoryTotal ? "✓" : "⚠";
    const color =
      categoryPassed === categoryTotal ? colors.green : colors.yellow;

    console.log(
      `${color}${status}${colors.reset} ${category}: ${categoryPassed}/${categoryTotal} checks passed`
    );
  });

  console.log(`\nOverall: ${passedChecks}/${totalChecks} checks passed`);

  const status = results.passed ? "READY FOR DEPLOYMENT" : "NEEDS ATTENTION";
  const statusColor = results.passed ? colors.green : colors.red;
  console.log(
    `\n${colors.bold}Status: ${statusColor}${status}${colors.reset}\n`
  );

  if (!results.passed) {
    log.info("Please fix the issues above before proceeding with deployment.");
    log.info("Run this script again after making the necessary changes.");
  }
}

// Run deployment check
if (require.main === module) {
  runDeploymentCheck().catch((error) => {
    log.error(`Unexpected error: ${error.message}`);
    process.exit(1);
  });
}

module.exports = { runDeploymentCheck };
