"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { useResponsive } from "@/lib/utils/mediaQuery";
import OptimizedImage from "../ui/OptimizedImage";
import OptimizedVideo from "../ui/OptimizedVideo";
import {
  imageDimensions,
  videoConfigs,
  shouldLoadWithPriority,
} from "@/lib/utils/imageOptimization";
import { HeroSectionProps } from "@/types/components";

const HeroSection = ({ className = "" }: HeroSectionProps = {}) => {
  const { isMobile } = useResponsive();

  useGSAP(() => {
    // Register plugins
    gsap.registerPlugin(SplitText);

    // Check if elements exist before creating animations
    const heroTitleEl = document.querySelector(".hero-title");
    const heroSubtitleEl = document.querySelector(".hero-text-scroll h1");
    const heroDescEl = document.querySelector(".hero-content h2");
    const heroButtonEl = document.querySelector(".hero-button");

    if (!heroTitleEl || !heroSubtitleEl || !heroDescEl || !heroButtonEl) {
      console.warn("HeroSection: Required elements not found");
      return;
    }

    // Create SplitText instances
    const titleSplit = SplitText.create(".hero-title", {
      type: "chars",
    });
    const subtitleSplit = SplitText.create(".hero-text-scroll h1", {
      type: "chars",
    });
    const descSplit = SplitText.create(".hero-content h2", {
      type: "words",
    });

    // Main timeline
    const tl = gsap.timeline({ delay: 0.5 });

    // Title animation
    tl.from(titleSplit.chars, {
      yPercent: 100,
      stagger: 0.02,
      ease: "power2.out",
      duration: 1,
    });

    // Subtitle reveal
    tl.to(
      ".hero-text-scroll",
      {
        duration: 1,
        opacity: 1,
        clipPath: "polygon(100% 0, 0 0, 0 100%, 100% 100%)",
        ease: "power1.inOut",
      },
      "-=0.5"
    );

    tl.from(
      subtitleSplit.chars,
      {
        yPercent: 100,
        stagger: 0.02,
        ease: "power2.out",
        duration: 0.8,
      },
      "-=0.3"
    );

    // Description animation
    tl.from(
      descSplit.words,
      {
        yPercent: 100,
        stagger: 0.01,
        ease: "power1.out",
        duration: 0.8,
      },
      "-=0.2"
    );

    // Button animation
    tl.from(
      ".hero-button",
      {
        y: 50,
        opacity: 0,
        ease: "back.out(1.7)",
        duration: 0.6,
      },
      "-=0.2"
    );

    // Scroll-triggered animations
    gsap.to(".hero-content", {
      yPercent: -50,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero-container",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    // Cleanup function
    return () => {
      titleSplit.revert();
      subtitleSplit.revert();
      descSplit.revert();
    };
  }, []);

  return (
    <section className={`hero-container ${className}`}>
      <div className="hero-content">
        <h1 className="hero-title">SPYLT</h1>
        <div
          className="hero-text-scroll"
          style={{
            clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)",
            opacity: 0,
          }}
        >
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

      {/* Background media */}
      <div className="absolute inset-0 z-0">
        {isMobile ? (
          <>
            <OptimizedImage
              src="/images/hero-bg.png"
              alt="Hero background"
              fill
              className="absolute bottom-40 object-cover"
              priority={shouldLoadWithPriority("/images/hero-bg.png")}
              sizes={imageDimensions.hero.sizes}
              quality={85}
            />
            <OptimizedImage
              src="/images/hero-img.png"
              alt="Hero product"
              width={600}
              height={800}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 object-auto"
              priority={shouldLoadWithPriority("/images/hero-img.png")}
              sizes={imageDimensions.hero.sizes}
              quality={90}
            />
          </>
        ) : (
          <>
            <OptimizedVideo
              src="/videos/hero-bg.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
              preload={videoConfigs.hero.preload}
              lazy={false}
              poster={videoConfigs.hero.poster}
            />
            <OptimizedImage
              src="/images/hero-img.png"
              alt="Hero product"
              width={600}
              height={800}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 object-auto z-10"
              priority={shouldLoadWithPriority("/images/hero-img.png")}
              sizes={imageDimensions.hero.sizes}
              quality={90}
            />
          </>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
