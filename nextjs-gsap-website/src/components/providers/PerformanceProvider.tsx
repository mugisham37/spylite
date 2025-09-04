"use client";

import { useEffect } from "react";
import { initializePerformanceMonitoring } from "@/lib/utils/performanceMonitoring";

export default function PerformanceProvider() {
  useEffect(() => {
    initializePerformanceMonitoring();
  }, []);

  return null;
}
