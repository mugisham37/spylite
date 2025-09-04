"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { SectionSkeleton } from "@/components/LoadingStates";
import NavBar from "@/components/NavBar";

// Dynamic imports for sections with proper loading states
const HeroSection = dynamic(() => import("@/sections/HeroSection"), {
  ssr: false,
  loading: () => <SectionSkeleton showTitle={false} />,
});

const MessageSection = dynamic(() => import("@/sections/MessageSection"), {
  ssr: false,
  loading: () => <SectionSkeleton showTitle={false} />,
}) as React.ComponentType<{}>;

const FlavorSection = dynamic(() => import("@/sections/FlavorSection"), {
  ssr: false,
  loading: () => <SectionSkeleton showTitle={false} />,
});

const NutritionSection = dynamic(() => import("@/sections/NutritionSection"), {
  ssr: false,
  loading: () => <SectionSkeleton showTitle={false} />,
});

const BenefitSection = dynamic(() => import("@/sections/BenefitSection"), {
  ssr: false,
  loading: () => <SectionSkeleton showTitle={false} />,
});

const TestimonialSection = dynamic(
  () => import("@/sections/TestimonialSection"),
  {
    ssr: false,
    loading: () => <SectionSkeleton showTitle={false} />,
  }
);

const FooterSection = dynamic(() => import("@/sections/FooterSection"), {
  ssr: false,
  loading: () => <SectionSkeleton showTitle={false} />,
});

export default function MainContent() {
  useEffect(() => {
    console.log("MainContent mounted - GSAP sections ready");
  }, []);

  return (
    <main>
      <NavBar />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <HeroSection />
          <MessageSection />
          <FlavorSection />
          <NutritionSection />

          <div>
            <BenefitSection />
            <TestimonialSection />
          </div>

          <FooterSection />
        </div>
      </div>
    </main>
  );
}
