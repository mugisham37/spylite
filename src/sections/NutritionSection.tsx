"use client";

import { useEffect, useState } from "react";
import { useScrollTrigger } from "../hooks/useGSAP";
import { SplitText } from "gsap/all";
import { nutrientLists, type NutrientData } from "../constants";
import { NutritionSectionProps } from "../types/components";
import OptimizedImage from "../components/OptimizedImage";

const NutritionSection: React.FC<NutritionSectionProps> = ({
  className = "",
  animationConfig,
}) => {
  const [lists, setLists] = useState<NutrientData[]>(nutrientLists);

  // Handle responsive behavior with proper SSR safety
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.matchMedia("(max-width: 768px)").matches;

      if (mobile) {
        setLists(nutrientLists.slice(0, 3));
      } else {
        setLists(nutrientLists);
      }
    };

    // Initial check
    checkMobile();

    // Add listener for changes
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    mediaQuery.addEventListener("change", checkMobile);

    return () => {
      mediaQuery.removeEventListener("change", checkMobile);
    };
  }, []);

  useScrollTrigger(
    ({ gsap, ScrollTrigger }) => {
      const titleSplit = SplitText.create(".nutrition-title", {
        type: "chars",
      });
      const paragraphSplit = SplitText.create(".nutrition-section p", {
        type: "words, lines",
        linesClass: "paragraph-line",
      });

      const contentTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".nutrition-section",
          start: animationConfig?.start || "top center",
          end: animationConfig?.end || "bottom center",
          scrub: animationConfig?.scrub || false,
          pin: animationConfig?.pin || false,
          markers: animationConfig?.markers || false,
        },
      });

      contentTl
        .from(titleSplit.chars, {
          yPercent: 100,
          stagger: 0.02,
          ease: "power2.out",
        })
        .from(paragraphSplit.words, {
          yPercent: 300,
          rotate: 3,
          ease: "power1.inOut",
          duration: 1,
          stagger: 0.01,
        });

      const titleTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".nutrition-section",
          start: "top 80%",
          end: "bottom center",
          scrub: false,
        },
      });

      titleTl.to(".nutrition-text-scroll", {
        duration: 1,
        opacity: 1,
        clipPath: "polygon(100% 0, 0 0, 0 100%, 100% 100%)",
        ease: "power1.inOut",
      });

      // Cleanup function
      return () => {
        titleSplit.revert();
        paragraphSplit.revert();
        ScrollTrigger.getAll().forEach((trigger: any) => {
          if (
            trigger.trigger === document.querySelector(".nutrition-section")
          ) {
            trigger.kill();
          }
        });
      };
    },
    [animationConfig]
  );

  return (
    <section className={`nutrition-section ${className}`}>
      <OptimizedImage
        src="/images/slider-dip.png"
        alt="Decorative slider dip"
        className="w-full object-cover"
        priority={false}
        quality={90}
      />

      <OptimizedImage
        src="/images/big-img.png"
        alt="Nutrition background image"
        className="big-img"
        priority={false}
        quality={90}
      />

      <div className="flex md:flex-row flex-col justify-between md:px-10 px-5 mt-14 md:mt-0">
        <div className="relative inline-block md:translate-y-20">
          <div className="general-title relative flex flex-col justify-center items-center gap-24">
            <div className="overflow-hidden place-self-start">
              <h1 className="nutrition-title">It still does</h1>
            </div>
            <div
              style={{
                clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)",
              }}
              className="nutrition-text-scroll place-self-start"
            >
              <div className="bg-yellow-brown pb-5 md:pt-0 pt-3 md:px-5 px-3">
                <h2 className="text-milk-yellow">Body Good</h2>
              </div>
            </div>
          </div>
        </div>

        <div className="flex md:justify-center items-center translate-y-5">
          <div className="md:max-w-xs max-w-md">
            <p className="text-lg md:text-right text-balance font-paragraph">
              Milk contains a wide array of nutrients, including vitamins,
              minerals, and protein, and this is lactose free
            </p>
          </div>
        </div>

        <div className="nutrition-box">
          <div className="list-wrapper">
            {lists.map((nutrient: NutrientData, index: number) => (
              <div
                key={`${nutrient.label}-${index}`}
                className="relative flex-1 col-center"
              >
                <div>
                  <p className="md:text-lg font-paragraph">{nutrient.label}</p>
                  <p className="font-paragraph text-sm mt-2">up to</p>
                  <p className="text-2xl md:text-4xl tracking-tighter font-bold">
                    {nutrient.amount}
                  </p>
                </div>

                {index !== lists.length - 1 && (
                  <div className="spacer-border" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NutritionSection;
