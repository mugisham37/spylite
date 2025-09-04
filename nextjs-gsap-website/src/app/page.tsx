import {
  HeroSection,
  MessageSection,
  FlavorSection,
  NutritionSection,
  BenefitSection,
  TestimonialSection,
  FooterSection,
  NavBar,
} from "@/components";
import ScrollSmootherWrapper from "@/components/scroll/ScrollSmootherWrapper";

export default function Home() {
  return (
    <main>
      {/* Navigation - ✅ Migrated */}
      <NavBar />

      <ScrollSmootherWrapper>
        <HeroSection />
        <MessageSection />
        <FlavorSection />
        <NutritionSection />
        <BenefitSection />
        <TestimonialSection />
        <FooterSection />
      </ScrollSmootherWrapper>
    </main>
  );
}
