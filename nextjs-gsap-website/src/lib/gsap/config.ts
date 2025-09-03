import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

export interface GSAPConfig {
  scrollSmoother: {
    smooth: number;
    effects: boolean;
  };
  scrollTrigger: {
    defaults: {
      toggleActions: string;
      markers: boolean;
    };
  };
}

export const defaultGSAPConfig: GSAPConfig = {
  scrollSmoother: {
    smooth: 1.5,
    effects: true,
  },
  scrollTrigger: {
    defaults: {
      toggleActions: "restart pause resume pause",
      markers: false,
    },
  },
};

export const initializeGSAP = (config: GSAPConfig = defaultGSAPConfig) => {
  // Register plugins
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

  // Set global GSAP configuration
  gsap.config({
    force3D: true,
    nullTargetWarn: false,
  });

  // Configure ScrollTrigger defaults
  ScrollTrigger.config({
    ignoreMobileResize: true,
    autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
  });

  // Set ScrollTrigger defaults
  ScrollTrigger.defaults(config.scrollTrigger.defaults);

  return config;
};

export const cleanupGSAP = () => {
  // Kill all ScrollTrigger instances
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

  // Kill all GSAP tweens
  gsap.killTweensOf("*");

  // Refresh ScrollTrigger
  ScrollTrigger.refresh();
};
