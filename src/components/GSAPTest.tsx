"use client";

import { useEffect, useRef } from "react";
import { useGSAPContext } from "@/providers/GSAPProvider";

const GSAPTest: React.FC = () => {
  const { isLoaded } = useGSAPContext();
  const testRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoaded || !testRef.current) return;

    const gsap = window.gsap;
    if (!gsap) return;

    console.log("GSAP Test: Starting animation");

    // Simple test animation
    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    tl.to(testRef.current, {
      x: 100,
      rotation: 360,
      duration: 2,
      ease: "power2.inOut",
    });

    return () => {
      tl.kill();
    };
  }, [isLoaded]);

  if (!isLoaded) {
    return (
      <div className="fixed top-4 right-4 bg-red-500 text-white p-2 rounded">
        GSAP Loading...
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 bg-green-500 text-white p-2 rounded">
      <div ref={testRef} className="w-4 h-4 bg-white rounded-full mb-2"></div>
      GSAP Ready
    </div>
  );
};

export default GSAPTest;
