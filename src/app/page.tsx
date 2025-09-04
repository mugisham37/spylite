"use client";

import {
  HeroSection,
  MessageSection,
  FlavorSection,
  NutritionSection,
  BenefitSection,
  TestimonialSection,
  FooterSection,
  NavBar,
  SectionErrorBoundary,
} from "@/components";
import ScrollSmootherWrapper from "@/components/scroll/ScrollSmootherWrapper";
import SafeSection from "@/components/ui/SafeSection";

// Dynamically import test components to avoid SSR issues

export default function Home() {
  return (
    <main className="relative">
      <div data-testid="navbar">
        <NavBar />
      </div>
      <ScrollSmootherWrapper>
        <SafeSection sectionName="Hero">
          <div data-testid="herosection" className="min-h-screen">
            <HeroSection />
          </div>
        </SafeSection>
        <SectionErrorBoundary sectionName="Message">
          <div data-testid="messagesection" className="min-h-screen">
            <MessageSection />
          </div>
        </SectionErrorBoundary>
        <SectionErrorBoundary sectionName="Flavor">
          <div data-testid="flavorsection" className="min-h-screen">
            <FlavorSection />
          </div>
        </SectionErrorBoundary>
        <SectionErrorBoundary sectionName="Nutrition">
          <div data-testid="nutritionsection" className="min-h-screen">
            <NutritionSection />
          </div>
        </SectionErrorBoundary>
        <SectionErrorBoundary sectionName="Benefits">
          <div data-testid="benefitsection" className="min-h-screen">
            <BenefitSection />
          </div>
        </SectionErrorBoundary>
        <SectionErrorBoundary sectionName="Testimonials">
          <div data-testid="testimonialsection" className="min-h-screen">
            <TestimonialSection />
          </div>
        </SectionErrorBoundary>
        <SectionErrorBoundary sectionName="Footer">
          <div data-testid="footersection" className="min-h-screen">
            <FooterSection />
          </div>
        </SectionErrorBoundary>
      </ScrollSmootherWrapper>
    </main>
  );
}
