"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { SplitText } from "gsap/SplitText";
import { ReactNode, useEffect } from "react";

interface GSAPProviderProps {
  children: ReactNode;
}

export default function GSAPProvider({ children }: GSAPProviderProps) {
  useGSAP(() => {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

    // Set up global GSAP configurations
    gsap.config({
      force3D: true,
      nullTargetWarn: false,
    });

    // Configure ScrollTrigger defaults
    ScrollTrigger.config({
      ignoreMobileResize: true,
      autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
    });

    // Refresh ScrollTrigger on window resize
    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Clean up ScrollTrigger instances on unmount
  useEffect(() => {
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return <>{children}</>;
}
