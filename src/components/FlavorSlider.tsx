import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { flavorlists, type FlavorData } from "../constants";
import { FlavorSliderProps } from "../types/components";
import OptimizedImage from "./OptimizedImage";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const FlavorSlider: React.FC<FlavorSliderProps> = ({
  flavors = flavorlists,
  className = "",
}) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sliderRef.current) return;

    const slider = sliderRef.current;

    // Calculate scroll amount based on content width
    const scrollAmount = slider.scrollWidth - window.innerWidth;

    // Only apply horizontal scroll on desktop (non-tablet)
    const mediaQuery = window.matchMedia("(min-width: 1025px)");

    const setupHorizontalScroll = () => {
      if (mediaQuery.matches && scrollAmount > 0) {
        // Horizontal scroll animation with pinning
        const horizontalTl = gsap.timeline({
          scrollTrigger: {
            trigger: ".flavor-section",
            start: "2% top",
            end: `+=${scrollAmount + 1500}px`,
            scrub: true,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        horizontalTl.to(slider, {
          x: `-${scrollAmount + 1500}px`,
          ease: "power1.inOut",
        });
      }
    };

    // Text scroll animations for flavor title
    const titleTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".flavor-section",
        start: "top top",
        end: "bottom 80%",
        scrub: true,
        invalidateOnRefresh: true,
      },
    });

    titleTl
      .to(".first-text-split", {
        xPercent: -30,
        ease: "power1.inOut",
      })
      .to(
        ".flavor-text-scroll",
        {
          xPercent: -22,
          ease: "power1.inOut",
        },
        "<"
      )
      .to(
        ".second-text-split",
        {
          xPercent: -10,
          ease: "power1.inOut",
        },
        "<"
      );

    // Setup horizontal scroll
    setupHorizontalScroll();

    // Handle resize
    const handleResize = () => {
      ScrollTrigger.refresh();
      setupHorizontalScroll();
    };

    mediaQuery.addEventListener("change", handleResize);
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      mediaQuery.removeEventListener("change", handleResize);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div ref={containerRef} className={`slider-wrapper ${className}`}>
      <div ref={sliderRef} className="flavors flex">
        {flavors.map((flavor: FlavorData) => (
          <FlavorCard key={flavor.id} flavor={flavor} />
        ))}
      </div>
    </div>
  );
};

// Individual flavor card component
interface FlavorCardProps {
  flavor: FlavorData;
}

const FlavorCard: React.FC<FlavorCardProps> = ({ flavor }) => {
  return (
    <div
      className={`relative z-30 lg:w-[50vw] w-96 lg:h-[70vh] md:w-[90vw] md:h-[50vh] h-80 flex-none ${flavor.rotation}`}
    >
      {/* Background SVG */}
      <OptimizedImage
        src={`/images/${flavor.color}-bg.svg`}
        alt={`${flavor.name} background`}
        fill
        className="absolute bottom-0 object-contain"
        priority={false}
        quality={90}
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 90vw, 50vw"
      />

      {/* Drink image */}
      <OptimizedImage
        src={`/images/${flavor.color}-drink.webp`}
        alt={`${flavor.name} drink`}
        fill
        className="drinks absolute left-1/2 -translate-x-1/2 bottom-0 md:h-full h-80 object-contain z-10"
        priority={false}
        quality={90}
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 90vw, 50vw"
      />

      {/* Elements image */}
      <OptimizedImage
        src={`/images/${flavor.color}-elements.webp`}
        alt={`${flavor.name} elements`}
        fill
        className="elements absolute md:top-0 md:bottom-auto bottom-10 w-full object-contain z-20"
        priority={false}
        quality={90}
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 90vw, 50vw"
      />

      {/* Flavor name */}
      <h1 className="absolute md:bottom-10 md:left-10 bottom-5 left-5 text-milk md:text-6xl text-3xl font-semibold uppercase tracking-tighter z-30">
        {flavor.name}
      </h1>
    </div>
  );
};

export default FlavorSlider;
