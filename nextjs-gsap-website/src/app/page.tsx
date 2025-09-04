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

export default function Home() {
  return (
    <main>
      {/* Navigation - ✅ Migrated */}
      <NavBar />

      <ScrollSmootherWrapper>
        <SafeSection sectionName="Hero" showLoader>
          <HeroSection />
        </SafeSection>
        <SectionErrorBoundary sectionName="Message">
          <MessageSection />
        </SectionErrorBoundary>
        <SectionErrorBoundary sectionName="Flavor">
          <FlavorSection />
        </SectionErrorBoundary>
        <SectionErrorBoundary sectionName="Nutrition">
          <NutritionSection />
        </SectionErrorBoundary>
        <SectionErrorBoundary sectionName="Benefits">
          <BenefitSection />
        </SectionErrorBoundary>

        <SectionErrorBoundary sectionName="Testimonials">
          <TestimonialSection />
        </SectionErrorBoundary>
        <SectionErrorBoundary sectionName="Footer">
          <FooterSection />
        </SectionErrorBoundary>
      </ScrollSmootherWrapper>
    </main>
  );
}
