"use client";

import { useEffect, useRef } from "react";
import { useGSAPContext } from "@/providers/GSAPProvider";
import { MessageItem } from "@/types/components";

interface MessageSectionProps {
  className?: string;
  messages?: MessageItem[];
}

const MessageSection: React.FC<MessageSectionProps> = ({
  className = "",
  messages = [
    {
      id: "first-message",
      text: "Stir up your fearless past and",
      delay: 0,
      duration: 1,
      ease: "power1.in",
    },
    {
      id: "second-message",
      text: "your future with every gulp of Perfect Protein",
      delay: 0,
      duration: 1,
      ease: "power1.in",
    },
  ],
}) => {
  const { isLoaded, registerAnimation } = useGSAPContext();
  const sectionRef = useRef<HTMLElement>(null);
  const firstMessageRef = useRef<HTMLHeadingElement>(null);
  const secondMessageRef = useRef<HTMLHeadingElement>(null);
  const msgTextScrollRef = useRef<HTMLDivElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!isLoaded || typeof window === "undefined") return;

    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    const SplitText = window.SplitText;

    if (!gsap || !ScrollTrigger) {
      console.warn("GSAP or ScrollTrigger not loaded");
      return;
    }

    if (!SplitText) {
      console.warn("SplitText not available, using fallback animation");
    }

    const cleanupFunctions: (() => void)[] = [];

    try {
      // Check if all refs are available
      if (
        !firstMessageRef.current ||
        !secondMessageRef.current ||
        !paragraphRef.current ||
        !msgTextScrollRef.current
      ) {
        console.warn("MessageSection refs not ready");
        return;
      }

      // Create SplitText instances for text animations
      let firstMsgSplit, secMsgSplit, paragraphSplit;

      if (SplitText) {
        firstMsgSplit = new SplitText(firstMessageRef.current, {
          type: "words",
        });

        secMsgSplit = new SplitText(secondMessageRef.current, {
          type: "words",
        });

        paragraphSplit = new SplitText(paragraphRef.current, {
          type: "words, lines",
          linesClass: "paragraph-line",
        });
      } else {
        // Fallback: create simple word spans
        const createWordSpans = (element: HTMLElement) => {
          const text = element.textContent || "";
          element.innerHTML = text
            .split(" ")
            .map(
              (word) =>
                `<span style="display: inline-block; color: #faeade10;">${word}</span>`
            )
            .join(" ");
          return {
            words: Array.from(element.children),
            revert: () => {
              element.innerHTML = text;
            },
          };
        };

        firstMsgSplit = createWordSpans(firstMessageRef.current);
        secMsgSplit = createWordSpans(secondMessageRef.current);
        paragraphSplit = createWordSpans(paragraphRef.current);
      }

      // First message color animation
      const firstMsgAnimation = gsap.to(firstMsgSplit.words, {
        color: "#faeade",
        ease: "power1.in",
        stagger: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top center",
          end: "30% center",
          scrub: true,
        },
      });

      // Second message color animation
      const secMsgAnimation = gsap.to(secMsgSplit.words, {
        color: "#faeade",
        ease: "power1.in",
        stagger: 1,
        scrollTrigger: {
          trigger: secondMessageRef.current,
          start: "top center",
          end: "bottom center",
          scrub: true,
        },
      });

      // Reveal animation for the "Fuel Up" text
      const revealTl = gsap.timeline({
        delay: 1,
        scrollTrigger: {
          trigger: msgTextScrollRef.current,
          start: "top 60%",
        },
      });

      revealTl.to(msgTextScrollRef.current, {
        duration: 1,
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        ease: "circ.inOut",
      });

      // Paragraph text animation
      const paragraphTl = gsap.timeline({
        scrollTrigger: {
          trigger: paragraphRef.current,
          start: "top center",
        },
      });

      paragraphTl.from(paragraphSplit.words, {
        yPercent: 300,
        rotate: 3,
        ease: "power1.inOut",
        duration: 1,
        stagger: 0.01,
      });

      // Register cleanup functions
      cleanupFunctions.push(
        () => firstMsgAnimation.kill(),
        () => secMsgAnimation.kill(),
        () => revealTl.kill(),
        () => paragraphTl.kill(),
        () => firstMsgSplit.revert(),
        () => secMsgSplit.revert(),
        () => paragraphSplit.revert()
      );

      // Register all cleanup functions with the GSAP context
      cleanupFunctions.forEach(registerAnimation);
    } catch (error) {
      console.error("Error initializing MessageSection animations:", error);
    }

    // Cleanup function
    return () => {
      cleanupFunctions.forEach((cleanup) => {
        try {
          cleanup();
        } catch (error) {
          console.error("Error during MessageSection cleanup:", error);
        }
      });
    };
  }, [isLoaded, registerAnimation]);

  return (
    <section ref={sectionRef} className={`message-content ${className}`}>
      <div className="container mx-auto flex-center py-28 relative">
        <div className="w-full h-full">
          <div className="msg-wrapper">
            <h1 ref={firstMessageRef} className="first-message">
              {messages[0]?.text || "Stir up your fearless past and"}
            </h1>

            <div
              ref={msgTextScrollRef}
              style={{
                clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)",
              }}
              className="msg-text-scroll"
            >
              <div className="bg-light-brown md:pb-5 pb-3 px-5">
                <h2 className="text-red-brown">Fuel Up</h2>
              </div>
            </div>

            <h1 ref={secondMessageRef} className="second-message">
              {messages[1]?.text ||
                "your future with every gulp of Perfect Protein"}
            </h1>
          </div>

          <div className="flex-center md:mt-20 mt-10">
            <div className="max-w-md px-10 flex-center overflow-hidden">
              <p ref={paragraphRef}>
                Rev up your rebel spirit and feed the adventure of life with
                SPYLT, where you're one chug away from epic nostalgia and
                fearless fun.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MessageSection;
