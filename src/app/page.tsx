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
    <main>
      <div data-testid="navbar">
        <NavBar />
      </div>
      <ScrollSmootherWrapper>
        <SafeSection sectionName="Hero" showLoader>
          <div data-testid="herosection">
            <HeroSection />
          </div>
        </SafeSection>
        <SectionErrorBoundary sectionName="Message">
          <div data-testid="messagesection">
            <MessageSection />
          </div>
        </SectionErrorBoundary>
        <SectionErrorBoundary sectionName="Flavor">
          <div data-testid="flavorsection">
            <FlavorSection />
          </div>
        </SectionErrorBoundary>
        <SectionErrorBoundary sectionName="Nutrition">
          <div data-testid="nutritionsection">
            <NutritionSection />
          </div>
        </SectionErrorBoundary>
        <SectionErrorBoundary sectionName="Benefits">
          <div data-testid="benefitsection">
            <BenefitSection />
          </div>
        </SectionErrorBoundary>
        <SectionErrorBoundary sectionName="Testimonials">
          <div data-testid="testimonialsection">
            <TestimonialSection />
          </div>
        </SectionErrorBoundary>
        <SectionErrorBoundary sectionName="Footer">
          <div data-testid="footersection">
            <FooterSection />
          </div>
        </SectionErrorBoundary>
      </ScrollSmootherWrapper>
    </main>
  );
}
