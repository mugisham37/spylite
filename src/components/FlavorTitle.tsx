import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { FlavorTitleProps } from "../types/components";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, SplitText);

const FlavorTitle: React.FC<FlavorTitleProps> = ({
  className = "",
  animationConfig,
}) => {
  const firstTextRef = useRef<HTMLDivElement>(null);
  const secondTextRef = useRef<HTMLDivElement>(null);
  const scrollTextRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (
      !firstTextRef.current ||
      !secondTextRef.current ||
      !scrollTextRef.current
    )
      return;

    // Create SplitText instances
    const firstTextSplit = new SplitText(
      firstTextRef.current.querySelector("h1"),
      {
        type: "chars",
      }
    );

    const secondTextSplit = new SplitText(
      secondTextRef.current.querySelector("h1"),
      {
        type: "chars",
      }
    );

    // First text animation
    gsap.from(firstTextSplit.chars, {
      yPercent: 200,
      stagger: 0.02,
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: ".flavor-section",
        start: "top 30%",
        invalidateOnRefresh: true,
      },
    });

    // Middle text reveal animation
    gsap.to(scrollTextRef.current, {
      duration: 1,
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      scrollTrigger: {
        trigger: ".flavor-section",
        start: "top 10%",
        invalidateOnRefresh: true,
      },
    });

    // Second text animation
    gsap.from(secondTextSplit.chars, {
      yPercent: 200,
      stagger: 0.02,
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: ".flavor-section",
        start: "top 1%",
        invalidateOnRefresh: true,
      },
    });

    // Cleanup function
    return () => {
      firstTextSplit.revert();
      secondTextSplit.revert();
    };
  }, [animationConfig]);

  return (
    <div
      className={`general-title col-center h-full 2xl:gap-32 xl:gap-24 gap-16 ${className}`}
    >
      {/* First text line */}
      <div
        ref={firstTextRef}
        className="overflow-hidden 2xl:py-0 py-3 first-text-split"
      >
        <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-center">
          We have 6
        </h1>
      </div>

      {/* Middle animated text */}
      <div
        ref={scrollTextRef}
        style={{
          clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)",
        }}
        className="flavor-text-scroll"
      >
        <div className="bg-mid-brown pb-5 2xl:pt-0 pt-3 2xl:px-5 px-3 rounded-lg">
          <h2 className="text-milk text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-center">
            freaking
          </h2>
        </div>
      </div>

      {/* Second text line */}
      <div
        ref={secondTextRef}
        className="overflow-hidden 2xl:py-0 py-3 second-text-split"
      >
        <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-center">
          delicious flavors
        </h1>
      </div>
    </div>
  );
};

export default FlavorTitle;
