"use client";

import { MessageSection } from "@/components";

const MessageSectionTest = () => {
  return (
    <div className="w-full">
      {/* Add some content before MessageSection to test scroll animations */}
      <div className="min-h-screen bg-dark-brown flex-center">
        <div className="col-center gap-8 p-8">
          <h1 className="general-title text-milk text-center">
            MessageSection Animation Test
          </h1>
          <p className="font-paragraph text-milk text-center max-w-2xl">
            Scroll down to see the MessageSection with GSAP animations. The text
            should animate on scroll with proper timing and easing.
          </p>
          <div className="mt-8 text-milk text-center">
            <p className="font-paragraph">↓ Scroll to test animations ↓</p>
          </div>
        </div>
      </div>

      {/* MessageSection Component */}
      <MessageSection />

      {/* Add content after to test scroll behavior */}
      <div className="min-h-screen bg-milk flex-center">
        <div className="col-center gap-8 p-8">
          <h1 className="general-title text-dark-brown text-center">
            Animation Test Complete
          </h1>
          <p className="font-paragraph text-dark-brown text-center max-w-2xl">
            If you scrolled through the MessageSection above, you should have
            seen:
          </p>
          <ul className="font-paragraph text-dark-brown text-left max-w-2xl space-y-2">
            <li>• Text color animations on the main headings</li>
            <li>
              • Clip-path reveal animation on the &quot;Fuel Up&quot; text
            </li>
            <li>• Paragraph text reveal with rotation and stagger</li>
            <li>• Proper responsive behavior on different screen sizes</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MessageSectionTest;
