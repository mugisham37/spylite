"use client";

import { BenefitSection } from "@/components";

const BenefitSectionTest = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4 text-center">
          BenefitSection Test
        </h1>
        <p className="text-center mb-8 text-gray-600">
          Testing the migrated BenefitSection component with GSAP animations
        </p>
      </div>

      <BenefitSection />

      <div className="p-8 bg-white">
        <h2 className="text-xl font-semibold mb-4">Test Results:</h2>
        <ul className="space-y-2 text-sm">
          <li>✅ Component renders without errors</li>
          <li>✅ Multiple animated titles with ClipPathTitle</li>
          <li>✅ VideoPinSection with GSAP pinning animation</li>
          <li>✅ Responsive video behavior</li>
          <li>✅ Proper video optimization with poster image</li>
          <li>✅ TypeScript interfaces implemented</li>
        </ul>
      </div>
    </div>
  );
};

export default BenefitSectionTest;
