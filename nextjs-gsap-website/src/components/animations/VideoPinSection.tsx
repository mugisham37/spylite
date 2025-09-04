"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useMediaQuery } from "react-responsive";
import OptimizedImage from "../ui/OptimizedImage";
import OptimizedVideo from "../ui/OptimizedVideo";
import { videoConfigs } from "@/lib/utils/imageOptimization";
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
        <OptimizedVideo
          src={videoSrc}
          playsInline
          muted
          loop
          autoPlay
          preload={videoConfigs.benefit.preload}
          poster={posterSrc}
          lazy={videoConfigs.benefit.lazy}
          className="size-full absolute inset-0 object-cover"
        />

        <div className="abs-center md:scale-100 scale-200">
          <OptimizedImage
            src="/images/circle-text.svg"
            alt="Circular text animation"
            width={200}
            height={200}
            className="spin-circle"
            priority={false}
            sizes="200px"
            quality={95}
          />
          <div className="play-btn">
            <OptimizedImage
              src="/images/play.svg"
              alt="Play button"
              width={48}
              height={48}
              className="size-[3vw] ml-[.5vw]"
              priority={false}
              sizes="48px"
              quality={95}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoPinSection;
