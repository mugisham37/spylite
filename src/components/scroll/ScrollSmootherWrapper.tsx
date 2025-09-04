"use client";

import { ReactNode, useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface ScrollSmootherWrapperProps {
  children: ReactNode;
}

export default function ScrollSmootherWrapper({
  children,
}: ScrollSmootherWrapperProps) {
  const scrollSmootherRef = useRef<ScrollSmoother | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Ensure elements exist before initializing ScrollSmoother
    if (!wrapperRef.current || !contentRef.current) return;

    try {
      // Kill any existing ScrollSmoother instance
      if (scrollSmootherRef.current) {
        scrollSmootherRef.current.kill();
      }

      // Create ScrollSmoother instance
      scrollSmootherRef.current = ScrollSmoother.create({
        wrapper: wrapperRef.current,
        content: contentRef.current,
        smooth: 3, // Smooth scrolling intensity (matches original)
        effects: true, // Enable data-speed and data-lag effects
        smoothTouch: 0.1, // Smooth scrolling on touch devices
        normalizeScroll: true, // Normalize scroll behavior across browsers
        ignoreMobileResize: true, // Prevent issues on mobile resize
      });

      // Refresh ScrollTrigger after ScrollSmoother initialization
      ScrollTrigger.refresh();
    } catch (error) {
      console.warn("ScrollSmoother initialization failed:", error);
      // Fallback: ensure ScrollTrigger still works without ScrollSmoother
      ScrollTrigger.refresh();
    }

    return () => {
      if (scrollSmootherRef.current) {
        scrollSmootherRef.current.kill();
        scrollSmootherRef.current = null;
      }
    };
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (scrollSmootherRef.current) {
        scrollSmootherRef.current.kill();
        scrollSmootherRef.current = null;
      }
    };
  }, []);

  return (
    <div id="smooth-wrapper" ref={wrapperRef}>
      <div id="smooth-content" ref={contentRef}>
        {children}
      </div>
    </div>
  );
}
