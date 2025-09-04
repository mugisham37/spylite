"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { useResponsive } from "@/lib";
import { flavorlists } from "@/lib";
import Image from "next/image";

const FlavorSlider = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const { isTablet, isMobile } = useResponsive();

  useGSAP(() => {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    if (!sliderRef.current) return;

    const scrollAmount = sliderRef.current.scrollWidth - window.innerWidth;

    // Only apply horizontal scroll animation on desktop
    if (!isTablet && !isMobile) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".flavor-section",
          start: "2% top",
          end: `+=${scrollAmount + 1500}px`,
          scrub: true,
          pin: true,
        },
      });

      tl.to(".flavor-section", {
        x: `-${scrollAmount + 1500}px`,
        ease: "power1.inOut",
      });
    }

    // Title scroll animations (works on all devices)
    const titleTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".flavor-section",
        start: "top top",
        end: "bottom 80%",
        scrub: true,
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
  }, [isTablet, isMobile]);

  return (
    <div ref={sliderRef} className="slider-wrapper">
      <div className="flavors">
        {flavorlists.map((flavor) => (
          <div
            key={flavor.name}
            className={`relative z-30 lg:w-[50vw] w-96 lg:h-[70vh] md:w-[90vw] md:h-[50vh] h-80 flex-none ${flavor.rotation}`}
          >
            <Image
              src={`/images/${flavor.color}-bg.svg`}
              alt=""
              className="absolute bottom-0"
              width={800}
              height={600}
              priority={flavor.color === "brown"} // Prioritize first image
            />

            <Image
              src={`/images/${flavor.color}-drink.svg`}
              alt={`${flavor.name} drink`}
              className="drinks"
              width={400}
              height={600}
              priority={flavor.color === "brown"} // Prioritize first image
            />

            <Image
              src={`/images/${flavor.color}-elements.svg`}
              alt={`${flavor.name} elements`}
              className="elements"
              width={800}
              height={400}
              priority={flavor.color === "brown"} // Prioritize first image
            />

            <h1>{flavor.name}</h1>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlavorSlider;
