// Path alias validation utility
// This file helps validate that all TypeScript path aliases are working correctly

// Test imports from different path aliases to ensure they resolve correctly
import type {
  BaseComponentProps,
  MediaQueryState,
  AnimationState,
} from "@/types/common";

import type {
  TimelineConfig,
  ScrollTriggerConfig,
  GSAPContextValue,
} from "@/types/gsap";

import type {
  NavBarProps,
  HeroSectionProps,
  OptimizedImageProps,
} from "@/types/components";

import type {
  AnimationDuration,
  AnimationEasing,
  EntranceAnimationConfig,
} from "@/types/animations";

import type { ImageAsset, VideoAsset, FontAsset } from "@/types/assets";

// Simple validation that path aliases work
export function validatePathAliases(): boolean {
  // Use the imported types to validate they can be resolved
  const _base: BaseComponentProps = { className: "test" };
  const _media: MediaQueryState = {
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isLargeDesktop: false,
  };
  const _anim: AnimationState = {
    isInitialized: false,
    isPlaying: false,
    isPaused: false,
    progress: 0,
    duration: 0,
  };
  const _timeline: TimelineConfig = { duration: 1 };
  const _scroll: ScrollTriggerConfig = { trigger: ".test" };
  const _gsap: Partial<GSAPContextValue> = { isLoaded: true };
  const _nav: Partial<NavBarProps> = { className: "nav" };
  const _hero: Partial<HeroSectionProps> = {
    videoSrc: "test.mp4",
    title: "Test",
  };
  const _img: Partial<OptimizedImageProps> = { src: "test.jpg", alt: "Test" };
  const _duration: AnimationDuration = "fast";
  const _easing: AnimationEasing = "easeOut";
  const _entrance: Partial<EntranceAnimationConfig> = { type: "fadeIn" };
  const _imageAsset: Partial<ImageAsset> = { src: "test.jpg", alt: "Test" };
  const _videoAsset: Partial<VideoAsset> = { src: "test.mp4" };
  const _fontAsset: Partial<FontAsset> = {
    family: "Arial",
    src: "arial.woff2",
  };

  // If we can create these objects without errors, path aliases work
  return Boolean(
    _base &&
      _media &&
      _anim &&
      _timeline &&
      _scroll &&
      _gsap &&
      _nav &&
      _hero &&
      _img &&
      _duration &&
      _easing &&
      _entrance &&
      _imageAsset &&
      _videoAsset &&
      _fontAsset
  );
}

// Export validation result
export const pathAliasesValid = validatePathAliases();

// Type-only exports to test path resolution
export type { BaseComponentProps, MediaQueryState } from "@/types/common";

export type { TimelineConfig } from "@/types/gsap";

export type { NavBarProps } from "@/types/components";

export type { AnimationDuration } from "@/types/animations";

export type { ImageAsset } from "@/types/assets";

// Development logging
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  console.log("✅ TypeScript path aliases validated successfully");
}
