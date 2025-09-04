"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import ClipPathTitle from "../components/ClipPathTitle";
import VideoPinSection from "../components/VideoPinSection";
import type { BenefitSectionProps } from "../types/components";

interface BenefitItem {
  id: string;
  title: string;
  color: string;
  bg: string;
  className: string;
  borderColor: string;
}

const BenefitSection: React.FC<Partial<BenefitSectionProps>> = () => {
  const benefitItems: BenefitItem[] = [
    {
      id: "shelf-stable",
      title: "Shelf stable",
      color: "#faeade",
      bg: "#c88e64",
      className: "first-title",
      borderColor: "#222123",
    },
    {
      id: "protein-caffeine",
      title: "Protein + Caffeine",
      color: "#222123",
      bg: "#faeade",
      className: "second-title",
      borderColor: "#222123",
    },
    {
      id: "recyclable",
      title: "Infinitely recyclable",
      color: "#faeade",
      bg: "#7F3B2D",
      className: "third-title",
      borderColor: "#222123",
    },
    {
      id: "lactose-free",
      title: "Lactose free",
      color: "#2E2D2F",
      bg: "#FED775",
      className: "fourth-title",
      borderColor: "#222123",
    },
  ];

  useGSAP(() => {
    // Enhanced title reveal animation with precise timing and rotation
    const revealTl = gsap.timeline({
      delay: 0.5,
      scrollTrigger: {
        trigger: ".benefit-section",
        start: "top 70%",
        end: "top 20%",
        scrub: 1.2,
        markers: false,
        id: "benefit-titles",
      },
    });

    // Animate each title with staggered timing and rotation preservation
    benefitItems.forEach((item, index) => {
      revealTl.to(
        `.benefit-section .${item.className}`,
        {
          duration: 1.2,
          opacity: 1,
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          ease: "circ.out",
          rotateZ: 0, // Preserve rotation while animating
          transformOrigin: "center center",
        },
        index * 0.15 // Stagger timing
      );
    });

    // Enhanced rotation animations for titles
    const rotationTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".benefit-section",
        start: "top 50%",
        end: "bottom 50%",
        scrub: 0.5,
        id: "benefit-rotations",
      },
    });

    // Precise rotation animations matching original design
    rotationTl
      .to(".first-title", {
        rotation: 6,
        duration: 1,
        ease: "power1.inOut",
      })
      .to(
        ".second-title",
        {
          rotation: -2,
          duration: 1,
          ease: "power1.inOut",
        },
        "-=0.8"
      )
      .to(
        ".third-title",
        {
          rotation: 2,
          duration: 1,
          ease: "power1.inOut",
        },
        "-=0.8"
      )
      .to(
        ".fourth-title",
        {
          rotation: -8,
          duration: 1,
          ease: "power1.inOut",
        },
        "-=0.8"
      );

    // Cleanup function
    return () => {
      revealTl.kill();
      rotationTl.kill();
    };
  }, []);

  return (
    <section className="benefit-section">
      <div className="container mx-auto pt-20">
        <div className="col-center">
          <p>
            Unlock the Advantages: <br />
            Explore the Key Benefits of Choosing SPYLT
          </p>

          <div className="mt-20 col-center">
            {benefitItems.map((item) => (
              <ClipPathTitle
                key={item.id}
                title={item.title}
                color={item.color}
                bg={item.bg}
                className={item.className}
                borderColor={item.borderColor}
              />
            ))}
          </div>

          <div className="md:mt-0 mt-10">
            <p>And much more ...</p>
          </div>
        </div>
      </div>

      <div className="relative overlay-box">
        <VideoPinSection />
      </div>
    </section>
  );
};

export default BenefitSection;
