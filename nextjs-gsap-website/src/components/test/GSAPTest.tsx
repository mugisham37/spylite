"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useRef } from "react";
import GSAPErrorBoundary from "../error/GSAPErrorBoundary";

export default function GSAPTest() {
  const containerRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!boxRef.current) return;

      // Simple animation to test GSAP is working
      gsap.fromTo(
        boxRef.current,
        {
          opacity: 0,
          y: 50,
          rotation: 0,
        },
        {
          opacity: 1,
          y: 0,
          rotation: 360,
          duration: 2,
          ease: "power2.out",
          repeat: -1,
          yoyo: true,
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <GSAPErrorBoundary>
      <div
        ref={containerRef}
        className="flex-center min-h-[300px] bg-dark-brown rounded-lg p-8"
      >
        <div className="col-center gap-4">
          <h3 className="text-milk font-bold text-xl">GSAP Test</h3>
          <div ref={boxRef} className="w-16 h-16 bg-light-brown rounded-lg" />
          <p className="font-paragraph text-milk text-sm text-center max-w-xs">
            If you see the box animating, GSAP is working correctly!
          </p>
        </div>
      </div>
    </GSAPErrorBoundary>
  );
}
