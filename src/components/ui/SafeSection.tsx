"use client";

import { ReactNode } from "react";
import SectionErrorBoundary from "../error/SectionErrorBoundary";
import MediaLoader from "./MediaLoader";

interface SafeSectionProps {
  children: ReactNode;
  sectionName: string;
  className?: string;
  showLoader?: boolean;
  loadingText?: string;
  fallback?: ReactNode;
}

/**
 * SafeSection - A wrapper component that provides error boundaries and loading states
 * for section components. Use this to wrap any section that contains animations or media.
 *
 * Example usage:
 * <SafeSection sectionName="Hero" showLoader>
 *   <HeroSection />
 * </SafeSection>
 */
export default function SafeSection({
  children,
  sectionName,
  className = "",
  showLoader = false,
  loadingText,
  fallback,
}: SafeSectionProps) {
  const content = showLoader ? (
    <MediaLoader
      loadingText={loadingText || `Loading ${sectionName} section...`}
      className={className}
    >
      {children}
    </MediaLoader>
  ) : (
    <div className={className}>{children}</div>
  );

  return (
    <SectionErrorBoundary sectionName={sectionName} fallback={fallback}>
      {content}
    </SectionErrorBoundary>
  );
}
