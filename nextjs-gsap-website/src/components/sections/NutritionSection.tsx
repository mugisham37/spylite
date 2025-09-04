"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useResponsive } from "@/lib/utils/mediaQuery";
import { nutrientLists, type NutrientData } from "@/lib/constants";
import { useEffect, useState } from "react";
import Image from "next/image";

const NutritionSection = () => {
  const { isMobile } = useResponsive();
  const [lists, setLists] = useState<NutrientData[]>(nutrientLists);

  useEffect(() => {
    if (isMobile) {
      setLists(nutrientLists.slice(0, 3));
    } else {
      setLists(nutrientLists);
    }
  }, [isMobile]);

  useGSAP(() => {
    // Register plugins
    gsap.registerPlugin(ScrollTrigger, SplitText);

    // Check if elements exist before creating animations
    const nutritionTitleEl = document.querySelector(".nutrition-title");
    const nutritionSectionEl = document.querySelector(".nutrition-section");
    const paragraphEl = document.querySelector(".nutrition-section p");
    const nutritionTextScrollEl = document.querySelector(
      ".nutrition-text-scroll"
    );

    if (
      !nutritionTitleEl ||
      !nutritionSectionEl ||
      !paragraphEl ||
      !nutritionTextScrollEl
    ) {
      console.warn("NutritionSection: Required elements not found");
      return;
    }

    // Create SplitText instances
    const titleSplit = SplitText.create(".nutrition-title", {
      type: "chars",
    });
    const paragraphSplit = SplitText.create(".nutrition-section p", {
      type: "words, lines",
      linesClass: "paragraph-line",
    });

    // Content reveal animation
    const contentTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".nutrition-section",
        start: "top center",
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

    // "Body Good" text reveal animation
    const titleTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".nutrition-section",
        start: "top 80%",
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
      ScrollTrigger.getAll().forEach((trigger) => {
        if (
          trigger.trigger?.classList?.contains("nutrition-section") ||
          trigger.trigger?.classList?.contains("nutrition-title") ||
          trigger.trigger?.classList?.contains("nutrition-text-scroll")
        ) {
          trigger.kill();
        }
      });
    };
  }, [isMobile]);

  return (
    <section className="nutrition-section">
      {/* Top decorative image */}
      <Image
        src="/images/slider-dip.png"
        alt=""
        width={1920}
        height={200}
        className="w-full object-cover"
        priority={false}
      />

      {/* Large background image */}
      <Image
        src="/images/big-img.png"
        alt=""
        width={1920}
        height={1080}
        className="big-img"
        priority={false}
      />

      <div className="flex md:flex-row flex-col justify-between md:px-10 px-5 mt-14 md:mt-0">
        {/* Title section */}
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

        {/* Description text */}
        <div className="flex md:justify-center items-center translate-y-5">
          <div className="md:max-w-xs max-w-md">
            <p className="text-lg md:text-right text-balance font-paragraph">
              Milk contains a wide array of nutrients, including vitamins,
              minerals, and protein, and this is lactose free
            </p>
          </div>
        </div>

        {/* Nutrition facts box */}
        <div className="nutrition-box">
          <div className="list-wrapper">
            {lists.map((nutrient, index) => (
              <div key={index} className="relative flex-1 col-center">
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
