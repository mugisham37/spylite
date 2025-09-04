"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAPContext } from "@/providers/GSAPProvider";
import OptimizedVideo from "@/components/OptimizedVideo";
import OptimizedImage from "@/components/OptimizedImage";
import { ScrollTriggerConfig } from "@/types/gsap";

// Media query breakpoints matching original
const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
} as const;

// Animation timing constants for exact preservation
const ANIMATION_TIMING = {
  initialDelay: 1,
  contentDuration: 1,
  clipPathDuration: 1,
  staggerDelay: 0.02,
  scrollStart: "1% top",
  scrollEnd: "bottom top",
} as const;

// Text animation configuration (inline usage for exact timing preservation)

// ScrollTrigger configuration for hero container
const heroScrollConfig: ScrollTriggerConfig = {
  trigger: ".hero-container",
  start: ANIMATION_TIMING.scrollStart,
  end: ANIMATION_TIMING.scrollEnd,
  scrub: true,
};

interface MediaQueryState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

const HeroSection: React.FC = () => {
  const { isLoaded, registerAnimation, createTimeline } = useGSAPContext();
  const [mediaQuery, setMediaQuery] = useState<MediaQueryState>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
  });

  const heroContainerRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroTextScrollRef = useRef<HTMLDivElement>(null);
  const splitTextInstanceRef = useRef<any>(null);
  const timelineRef = useRef<any>(null);
  const scrollTimelineRef = useRef<any>(null);

  // Media query detection with SSR safety
  useEffect(() => {
    const updateMediaQuery = () => {
      const width = window.innerWidth;
      setMediaQuery({
        isMobile: width <= BREAKPOINTS.mobile,
        isTablet: width <= BREAKPOINTS.tablet,
        isDesktop: width > BREAKPOINTS.tablet,
      });
    };

    // Initial check
    updateMediaQuery();

    // Add resize listener
    window.addEventListener("resize", updateMediaQuery);
    return () => window.removeEventListener("resize", updateMediaQuery);
  }, []);

  // GSAP animations with exact timing preservation
  useEffect(() => {
    if (!isLoaded || typeof window === "undefined") return;

    const { gsap, SplitText, ScrollTrigger } = window as any;
    if (!gsap || !SplitText || !ScrollTrigger) return;

    const heroContainer = heroContainerRef.current;
    const heroContent = heroContentRef.current;
    const heroTitle = heroTitleRef.current;
    const heroTextScroll = heroTextScrollRef.current;

    if (!heroContainer || !heroContent || !heroTitle || !heroTextScroll) return;

    // Create SplitText instance for character animation
    const titleSplit = new SplitText(heroTitle, {
      type: "chars",
    });
    splitTextInstanceRef.current = titleSplit;

    // Main timeline with exact timing from original
    const mainTimeline = createTimeline({
      delay: ANIMATION_TIMING.initialDelay,
    });

    if (mainTimeline) {
      mainTimeline
        .to(heroContent, {
          opacity: 1,
          y: 0,
          duration: ANIMATION_TIMING.contentDuration,
          ease: "power1.inOut",
        })
        .to(
          heroTextScroll,
          {
            duration: ANIMATION_TIMING.clipPathDuration,
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            ease: "circ.out",
          },
          "-=0.5"
        )
        .from(
          titleSplit.chars,
          {
            yPercent: 200,
            stagger: ANIMATION_TIMING.staggerDelay,
            ease: "power2.out",
          },
          "-=0.5"
        );

      timelineRef.current = mainTimeline;
    }

    // ScrollTrigger animation for hero container transformation
    const scrollTimeline = gsap.timeline({
      scrollTrigger: {
        ...heroScrollConfig,
        trigger: heroContainer,
      },
    });

    scrollTimeline.to(heroContainer, {
      rotate: 7,
      scale: 0.9,
      yPercent: 30,
      ease: "power1.inOut",
    });

    scrollTimelineRef.current = scrollTimeline;

    // Register cleanup functions
    const cleanup = () => {
      if (splitTextInstanceRef.current) {
        splitTextInstanceRef.current.revert();
        splitTextInstanceRef.current = null;
      }
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }
      if (scrollTimelineRef.current) {
        scrollTimelineRef.current.kill();
        scrollTimelineRef.current = null;
      }
    };

    registerAnimation(cleanup);

    return cleanup;
  }, [isLoaded, registerAnimation, createTimeline]);

  // Handle video load for performance
  const handleVideoLoad = () => {
    // Video loaded successfully
    console.log("Hero video loaded");
  };

  const handleVideoError = () => {
    console.warn("Hero video failed to load");
  };

  return (
    <section className="bg-main-bg">
      <div className="hero-container" ref={heroContainerRef}>
        {/* Responsive media with optimized components */}
        {mediaQuery.isTablet ? (
          <>
            {/* Mobile background image */}
            {mediaQuery.isMobile && (
              <OptimizedImage
                src="/images/hero-bg.png"
                alt="Hero background"
                fill
                priority
                quality={90}
                className="absolute bottom-40 object-cover"
                sizes="100vw"
              />
            )}
            {/* Tablet/Mobile hero image */}
            <OptimizedImage
              src="/images/hero-img.png"
              alt="SPYLT protein drink"
              width={800}
              height={600}
              priority
              quality={95}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 object-auto"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </>
        ) : (
          /* Desktop video background with optimization */
          <OptimizedVideo
            src="/videos/hero-bg.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover"
            onLoad={handleVideoLoad}
            onError={handleVideoError}
            lazy={false} // Don't lazy load hero video
          />
        )}

        {/* Hero content with exact structure preservation */}
        <div className="hero-content opacity-0" ref={heroContentRef}>
          <div className="overflow-hidden">
            <h1 className="hero-title" ref={heroTitleRef}>
              Freaking Delicious
            </h1>
          </div>

          <div
            style={{
              clipPath: "polygon(50% 0, 50% 0, 50% 100%, 50% 100%)",
            }}
            className="hero-text-scroll"
            ref={heroTextScrollRef}
          >
            <div className="hero-subtitle">
              <h1>Protein + Caffine</h1>
            </div>
          </div>

          <h2>
            Live life to the fullest with SPYLT: Shatter boredom and embrace
            your inner kid with every deliciously smooth chug.
          </h2>

          <div className="hero-button">
            <p>Chug a SPYLT</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
