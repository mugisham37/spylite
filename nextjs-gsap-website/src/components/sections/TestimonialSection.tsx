"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { cards } from "@/lib/constants";
import { useResponsive } from "@/lib/utils/mediaQuery";

const TestimonialSection = () => {
  const vdRef = useRef<(HTMLVideoElement | null)[]>([]);
  const { isMobile, isTablet } = useResponsive();

  useGSAP(() => {
    // Set initial margin top for the section
    gsap.set(".testimonials-section", {
      marginTop: "-140vh",
    });

    // Title animation timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".testimonials-section",
        start: "top bottom",
        end: "200% top",
        scrub: true,
      },
    });

    tl.to(".testimonials-section .first-title", {
      xPercent: 70,
    })
      .to(
        ".testimonials-section .sec-title",
        {
          xPercent: 25,
        },
        "<"
      )
      .to(
        ".testimonials-section .third-title",
        {
          xPercent: -50,
        },
        "<"
      );

    // Pin animation timeline - only on desktop
    if (!isMobile && !isTablet) {
      const pinTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".testimonials-section",
          start: "10% top",
          end: "200% top",
          scrub: 1.5,
          pin: true,
        },
      });

      pinTl.from(".vd-card", {
        yPercent: 150,
        stagger: 0.2,
        ease: "power1.inOut",
      });
    } else {
      // Mobile/tablet: simpler animation without pinning
      gsap.from(".vd-card", {
        scrollTrigger: {
          trigger: ".pin-box",
          start: "top 80%",
          end: "bottom 20%",
          scrub: 1,
        },
        yPercent: 50,
        stagger: 0.1,
        ease: "power1.inOut",
      });
    }
  }, [isMobile, isTablet]);

  const handlePlay = (index: number) => {
    const video = vdRef.current[index];
    if (video) {
      video.play().catch((error) => {
        console.warn("Video play failed:", error);
      });
    }
  };

  const handlePause = (index: number) => {
    const video = vdRef.current[index];
    if (video) {
      video.pause();
    }
  };

  const handleVideoLoad = (index: number) => {
    const video = vdRef.current[index];
    if (video) {
      // Preload metadata for better performance
      video.preload = "metadata";
    }
  };

  const handleVideoError = (
    index: number,
    error: React.SyntheticEvent<HTMLVideoElement, Event>
  ) => {
    console.warn(`Video ${index} failed to load:`, error);
    // Could implement fallback image here
  };

  return (
    <section className="testimonials-section">
      <div className="absolute size-full flex flex-col items-center pt-[5vw]">
        <h1 className="text-black first-title">What&apos;s</h1>
        <h1 className="text-light-brown sec-title">Everyone</h1>
        <h1 className="text-black third-title">Talking</h1>
      </div>

      <div className="pin-box">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`vd-card ${card.translation || ""} ${card.rotation}`}
            onMouseEnter={() => handlePlay(index)}
            onMouseLeave={() => handlePause(index)}
          >
            <video
              ref={(el) => {
                vdRef.current[index] = el;
              }}
              src={card.src}
              poster={card.img} // Use the person image as poster
              playsInline
              muted
              loop
              className="size-full object-cover"
              onLoadedMetadata={() => handleVideoLoad(index)}
              onError={(e) => handleVideoError(index, e)}
              preload="metadata"
            />

            {/* Fallback image overlay for loading states */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-0 transition-opacity duration-300"
              style={{ backgroundImage: `url(${card.img})` }}
              onLoad={() => {
                // Hide fallback when video is ready
                const video = vdRef.current[index];
                if (video && video.readyState >= 2) {
                  (
                    document.querySelector(
                      `[data-fallback="${index}"]`
                    ) as HTMLElement
                  )?.classList.add("opacity-0");
                }
              }}
              data-fallback={index}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialSection;
