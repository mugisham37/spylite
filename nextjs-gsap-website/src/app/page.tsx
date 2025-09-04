import { MessageSection, FlavorSection, NutritionSection } from "@/components";

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

const BenefitSection = () => (
  <section className="benefit-section">
    <div className="flex-center h-full">
      <div className="col-center gap-8 p-8 max-w-4xl w-full">
        <h1 className="general-title text-milk text-center">
          Benefits Section
        </h1>
        <p className="font-paragraph text-milk text-center max-w-2xl">
          This section will showcase the health benefits of our milk protein
          drinks.
          <br />
          <span className="text-light-brown">
            Coming Soon - Migration in Progress
          </span>
        </p>
      </div>
    </div>
  </section>
);

const TestimonialSection = () => (
  <section className="testimonials-section">
    <div className="flex-center h-full">
      <div className="col-center gap-8 p-8 max-w-4xl w-full">
        <h1 className="general-title text-dark-brown text-center">
          Testimonials
        </h1>
        <p className="font-paragraph text-dark-brown text-center max-w-2xl">
          Customer testimonials and reviews will be displayed here.
          <br />
          <span className="text-mid-brown">
            Coming Soon - Migration in Progress
          </span>
        </p>
      </div>
    </div>
  </section>
);

const FooterSection = () => (
  <section className="footer-section">
    <div className="flex-center h-full">
      <div className="col-center gap-8 p-8 max-w-4xl w-full">
        <h1 className="general-title text-milk text-center">Footer Section</h1>
        <p className="font-paragraph text-milk text-center max-w-2xl">
          Contact information, social links, and company details.
          <br />
          <span className="text-light-brown">
            Coming Soon - Migration in Progress
          </span>
        </p>
      </div>
    </div>
  </section>
);

export default function Home() {
  return (
    <main>
      {/* Navigation would go here */}

      <div id="smooth-wrapper">
        <div id="smooth-content">
          {/* 1. Hero Section - 🚧 Placeholder */}
          <HeroSection />

          {/* 2. Message Section - ✅ Migrated */}
          <MessageSection />

          {/* 3. Flavor Section - ✅ Migrated */}
          <FlavorSection />

          {/* 4. Nutrition Section - ✅ Migrated */}
          <NutritionSection />

          {/* 5. Benefit Section - 🚧 Placeholder */}
          <BenefitSection />

          {/* 6. Testimonial Section - 🚧 Placeholder */}
          <TestimonialSection />

          {/* 7. Footer Section - 🚧 Placeholder */}
          <FooterSection />
        </div>
      </div>
    </main>
  );
}
