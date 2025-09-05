"use client";

import { useEffect, useState } from "react";
import { useGSAPContext } from "@/providers/GSAPProvider";

const GSAPDebug: React.FC = () => {
  const { isLoaded, isInitialized } = useGSAPContext();
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    const checkGSAP = () => {
      const info = {
        isLoaded,
        isInitialized,
        hasWindow: typeof window !== "undefined",
        hasGSAP: typeof window !== "undefined" && !!window.gsap,
        hasScrollTrigger:
          typeof window !== "undefined" && !!window.ScrollTrigger,
        hasScrollSmoother:
          typeof window !== "undefined" && !!window.ScrollSmoother,
        hasSplitText: typeof window !== "undefined" && !!window.SplitText,
        smoothWrapper:
          typeof document !== "undefined" &&
          !!document.getElementById("smooth-wrapper"),
        smoothContent:
          typeof document !== "undefined" &&
          !!document.getElementById("smooth-content"),
        bodyOverflow:
          typeof document !== "undefined"
            ? document.body.style.overflow
            : "unknown",
        htmlOverflow:
          typeof document !== "undefined"
            ? document.documentElement.style.overflow
            : "unknown",
      };
      setDebugInfo(info);
    };

    checkGSAP();
    const interval = setInterval(checkGSAP, 1000);

    return () => clearInterval(interval);
  }, [isLoaded, isInitialized]);

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 bg-black text-white p-4 rounded text-xs max-w-xs z-50">
      <h3 className="font-bold mb-2">GSAP Debug Info</h3>
      <div className="space-y-1">
        {Object.entries(debugInfo).map(([key, value]) => (
          <div key={key} className="flex justify-between">
            <span>{key}:</span>
            <span className={value ? "text-green-400" : "text-red-400"}>
              {String(value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GSAPDebug;
