"use client";

import { NavBar, FooterSection } from "@/components";

const FooterNavTest = () => {
  return (
    <div className="min-h-screen bg-milk">
      <NavBar />

      <div className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="general-title text-center text-dark-brown mb-8">
            Footer & Navigation Test
          </h1>
          <p className="font-paragraph text-center text-dark-brown max-w-2xl mx-auto">
            This page tests the migrated NavBar and FooterSection components.
            The NavBar should be fixed at the top with the logo, and the
            FooterSection should include social media links, newsletter signup,
            and footer content with animations.
          </p>
        </div>
      </div>

      <FooterSection />
    </div>
  );
};

export default FooterNavTest;
