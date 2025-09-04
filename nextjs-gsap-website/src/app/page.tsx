import {
  MessageSection,
  FlavorSection,
  NutritionSection,
  BenefitSection,
  TestimonialSection,
  FooterSection,
  NavBar,
} from "@/components";
import ScrollSmootherWrapper from "@/components/scroll/ScrollSmootherWrapper";

// Placeholder components for sections not yet migrated
const HeroSection = () => (
  <section className="hero-container">
    <div className="hero-content">
      <h1 className="hero-title">SPYLT</h1>
      <div className="hero-text-scroll">
        <div className="hero-subtitle">
          <h1>Milk Protein</h1>
        </div>
      </div>
      <h2>
        Experience the perfect blend of nutrition and taste with our premium
        milk protein drinks.
      </h2>
      <button className="hero-button">Discover More</button>
    </div>
  </section>
);

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
