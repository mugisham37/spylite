"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
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
  const [isInitialized, setIsInitialized] = useState(false);

  useGSAP(() => {
    // Ensure elements exist before initializing ScrollSmoother
    if (!wrapperRef.current || !contentRef.current) return;

    // Add a small delay to ensure all content is rendered
    const initTimer = setTimeout(() => {
      try {
        // Kill any existing ScrollSmoother instance
        if (scrollSmootherRef.current) {
          scrollSmootherRef.current.kill();
        }

        // Create ScrollSmoother instance with safer settings
        scrollSmootherRef.current = ScrollSmoother.create({
          wrapper: wrapperRef.current,
          content: contentRef.current,
          smooth: 1, // Reduced smooth scrolling intensity
          effects: true, // Enable data-speed and data-lag effects
          smoothTouch: 0, // Disable smooth scrolling on touch devices to prevent issues
          normalizeScroll: false, // Let browser handle normal scroll behavior
          ignoreMobileResize: true, // Prevent issues on mobile resize
        });

        // Refresh ScrollTrigger after ScrollSmoother initialization
        ScrollTrigger.refresh();
        setIsInitialized(true);
      } catch (error) {
        console.warn("ScrollSmoother initialization failed:", error);
        // Fallback: ensure ScrollTrigger still works without ScrollSmoother
        ScrollTrigger.refresh();
        setIsInitialized(true);
      }
    }, 100);

    return () => {
      clearTimeout(initTimer);
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
    <div id="smooth-wrapper" ref={wrapperRef} className="relative">
      <div id="smooth-content" ref={contentRef} className="relative">
        {children}
      </div>
    </div>
  );
}
