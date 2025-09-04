"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useMediaQuery } from "react-responsive";
import Image from "next/image";
import { VideoPinSectionProps } from "@/types/components";

const VideoPinSection = ({
  videoSrc = "/videos/pin-video.mp4",
  posterSrc = "/images/video-img.webp",
  className = "",
}: VideoPinSectionProps = {}) => {
  const isMobile = useMediaQuery({
    query: "(max-width: 768px)",
  });

  useGSAP(() => {
    if (!isMobile) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".vd-pin-section",
          start: "-15% top",
          end: "200% top",
          scrub: 1.5,
          pin: true,
        },
      });

      tl.to(".video-box", {
        clipPath: "circle(100% at 50% 50%)",
        ease: "power1.inOut",
      });
    }
  }, [isMobile]);

  return (
    <section className={`vd-pin-section ${className}`}>
      <div
        style={{
          clipPath: isMobile
            ? "circle(100% at 50% 50%)"
            : "circle(6% at 50% 50%)",
        }}
        className="size-full video-box"
      >
        <video
          src={videoSrc}
          playsInline
          muted
          loop
          autoPlay
          preload="metadata"
          poster={posterSrc}
        />

        <div className="abs-center md:scale-100 scale-200">
          <Image
            src="/images/circle-text.svg"
            alt="Circular text animation"
            width={200}
            height={200}
            className="spin-circle"
            priority={false}
          />
          <div className="play-btn">
            <Image
              src="/images/play.svg"
              alt="Play button"
              width={48}
              height={48}
              className="size-[3vw] ml-[.5vw]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoPinSection;
