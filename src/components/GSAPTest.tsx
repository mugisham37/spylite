"use client";

import React, { useRef } from "react";
import { useGSAP } from "@/hooks/useGSAP";
import { useGSAPContext } from "@/providers/GSAPProvider";

export function GSAPTest() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isLoaded, isInitialized } = useGSAPContext();

  // Test basic GSAP animation
  useGSAP(
    ({ timeline, gsap }) => {
      if (!containerRef.current) return;

      const boxes = containerRef.current.querySelectorAll(".test-box");

      timeline
        .from(boxes, {
          opacity: 0,
          y: 50,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
        })
        .to(
          boxes,
          {
            rotation: 360,
            duration: 1,
            stagger: 0.1,
            ease: "power2.inOut",
          },
          "-=0.3"
        );

      return () => {
        // Cleanup function
        gsap.killTweensOf(boxes);
      };
    },
    { autoPlay: true },
    [isLoaded]
  );

  if (!isLoaded) {
    return (
      <div className="p-8 text-center">
        <p>Loading GSAP...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">GSAP Provider Test</h2>
      <p className="mb-4">
        GSAP Status: {isLoaded ? "✅ Loaded" : "❌ Not Loaded"} | Initialized:{" "}
        {isInitialized ? "✅ Yes" : "❌ No"}
      </p>

      <div ref={containerRef} className="flex gap-4 flex-wrap">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="test-box w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold"
          >
            {i}
          </div>
        ))}
      </div>

      <div className="mt-8">
        <p className="text-sm text-gray-600">
          If GSAP is working correctly, you should see the boxes animate in with
          a stagger effect, followed by a rotation animation.
        </p>
      </div>
    </div>
  );
}
