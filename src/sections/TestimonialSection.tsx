"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { cards } from "../constants";
import { TestimonialVideoCard } from "../components/TestimonialVideoCard";
import type { TestimonialCardData } from "../constants";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface TestimonialSectionProps {
  className?: string;
}

const TestimonialSection: React.FC<TestimonialSectionProps> = ({
  className = "",
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRefs = useRef<{
    first: HTMLHeadingElement | null;
    second: HTMLHeadingElement | null;
    third: HTMLHeadingElement | null;
  }>({
    first: null,
    second: null,
    third: null,
  });

  useGSAP(() => {
    if (!sectionRef.current) return;

    // Set initial position for the testimonials section
    gsap.set(sectionRef.current, {
      marginTop: "-140vh",
    });

    // Title animation timeline
    const titleTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top bottom",
        end: "200% top",
        scrub: true,
      },
    });

    // Animate titles with different x translations
    if (titleRefs.current.first) {
      titleTimeline.to(titleRefs.current.first, {
        xPercent: 70,
      });
    }

    if (titleRefs.current.second) {
      titleTimeline.to(
        titleRefs.current.second,
        {
          xPercent: 25,
        },
        "<"
      );
    }

    if (titleRefs.current.third) {
      titleTimeline.to(
        titleRefs.current.third,
        {
          xPercent: -50,
        },
        "<"
      );
    }

    // Pin and card animation timeline
    const pinTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "10% top",
        end: "200% top",
        scrub: 1.5,
        pin: true,
      },
    });

    // Animate video cards from bottom
    pinTimeline.from(".vd-card", {
      yPercent: 150,
      stagger: 0.2,
      ease: "power1.inOut",
    });

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach((trigger: any) => {
        if (trigger.trigger === sectionRef.current) {
          trigger.kill();
        }
      });
    };
  }, []);

  return (
    <section ref={sectionRef} className={`testimonials-section ${className}`}>
      {/* Title Section */}
      <div className="absolute size-full flex flex-col items-center pt-[5vw]">
        <h1
          ref={(el) => {
            titleRefs.current.first = el;
          }}
          className="text-black first-title text-[8vw] md:text-[6vw] font-bold leading-none"
        >
          What's
        </h1>
        <h1
          ref={(el) => {
            titleRefs.current.second = el;
          }}
          className="text-light-brown sec-title text-[8vw] md:text-[6vw] font-bold leading-none"
        >
          Everyone
        </h1>
        <h1
          ref={(el) => {
            titleRefs.current.third = el;
          }}
          className="text-black third-title text-[8vw] md:text-[6vw] font-bold leading-none"
        >
          Talking
        </h1>
      </div>

      {/* Video Cards Container */}
      <div className="pin-box">
        {cards.map((card: TestimonialCardData, index: number) => (
          <TestimonialVideoCard
            key={card.id}
            card={card}
            index={index}
            className={`vd-card ${card.translation || ""} ${card.rotation}`}
          />
        ))}
      </div>
    </section>
  );
};

export default TestimonialSection;
