"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { SectionSkeleton } from "@/components/LoadingStates";

// Dynamic imports for sections with proper loading states
const HeroSection = dynamic(() => import("@/sections/HeroSection"), {
  ssr: false,
  loading: () => <SectionSkeleton showTitle={false} />,
});

const MessageSection = dynamic(() => import("@/sections/MessageSection"), {
  ssr: false,
  loading: () => <SectionSkeleton showTitle={false} />,
}) as React.ComponentType<{}>;

export default function MainContent() {
  useEffect(() => {
    console.log("MainContent mounted - GSAP sections ready");
  }, []);

  return (
    <main>
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <HeroSection />
          <MessageSection />
        </div>
      </div>
    </main>
  );
}
