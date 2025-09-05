"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useMediaQuery } from "react-responsive";
import { useRef, useState, useCallback } from "react";
import Image from "next/image";
import OptimizedVideo from "./OptimizedVideo";

interface VideoPinSectionProps {
  videoSrc?: string;
  poster?: string;
}

const VideoPinSection: React.FC<VideoPinSectionProps> = ({
  videoSrc = "/videos/pin-video.mp4",
  poster,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const isMobile = useMediaQuery({
    query: "(max-width: 768px)",
  });

  const handlePlayButtonClick = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play().catch(() => {
        // Handle autoplay restrictions
        console.log("Video play was prevented");
      });
      setIsPlaying(true);
    }
  }, [isPlaying]);

  const handleVideoPlay = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const handleVideoPause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  useGSAP(() => {
    if (!isMobile) {
      // Enhanced video pin animation with better timing
      const pinTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".vd-pin-section",
          start: "-10% top",
          end: "250% top",
          scrub: 1.2,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          id: "video-pin",
          refreshPriority: -1,
        },
      });

      // Smooth video reveal animation
      pinTl
        .to(".video-box", {
          clipPath: "circle(100% at 50% 50%)",
          ease: "power2.inOut",
          duration: 1,
        })
        .to(
          ".play-btn-container",
          {
            scale: 1,
            opacity: 1,
            ease: "back.out(1.7)",
            duration: 0.8,
          },
          "-=0.3"
        );

      // Play button hover animations
      const playBtnHover = gsap.timeline({ paused: true });
      playBtnHover
        .to(".play-btn", {
          scale: 1.1,
          backgroundColor: "rgba(255, 255, 255, 0.3)",
          duration: 0.3,
          ease: "power2.out",
        })
        .to(
          ".play-icon",
          {
            scale: 1.2,
            rotation: 5,
            duration: 0.3,
            ease: "power2.out",
          },
          0
        )
        .to(
          ".circle-text",
          {
            rotation: "+=20",
            duration: 0.5,
            ease: "power1.out",
          },
          0
        );

      // Play button click animation
      const playBtnClick = gsap.timeline({ paused: true });
      playBtnClick
        .to(".play-btn", {
          scale: 0.95,
          duration: 0.1,
          ease: "power2.inOut",
        })
        .to(".play-btn", {
          scale: 1.05,
          duration: 0.2,
          ease: "back.out(2)",
        });

      // Set up event listeners for hover effects
      const playButton = document.querySelector(".play-btn-container");
      if (playButton) {
        const handleMouseEnter = () => {
          setIsHovered(true);
          playBtnHover.play();
        };

        const handleMouseLeave = () => {
          setIsHovered(false);
          playBtnHover.reverse();
        };

        const handleClick = () => {
          playBtnClick.restart();
        };

        playButton.addEventListener("mouseenter", handleMouseEnter);
        playButton.addEventListener("mouseleave", handleMouseLeave);
        playButton.addEventListener("click", handleClick);

        // Cleanup function
        return () => {
          pinTl.kill();
          playBtnHover.kill();
          playBtnClick.kill();
          playButton.removeEventListener("mouseenter", handleMouseEnter);
          playButton.removeEventListener("mouseleave", handleMouseLeave);
          playButton.removeEventListener("click", handleClick);
        };
      }

      // Cleanup function for case when playButton is not found
      return () => {
        pinTl.kill();
        playBtnHover.kill();
        playBtnClick.kill();
      };
    }

    // Return undefined for mobile case (no cleanup needed)
    return undefined;
  }, [isMobile]);

  return (
    <section className="vd-pin-section">
      <div
        style={{
          clipPath: isMobile
            ? "circle(100% at 50% 50%)"
            : "circle(6% at 50% 50%)",
        }}
        className="size-full video-box"
      >
        <OptimizedVideo
          ref={videoRef}
          src={videoSrc}
          {...(poster && { poster })}
          playsInline
          muted
          loop
          autoPlay
          onPlay={handleVideoPlay}
          onPause={handleVideoPause}
          className="size-full absolute inset-0 object-cover"
        />

        <div
          className={`abs-center md:scale-100 scale-200 play-btn-container cursor-pointer ${
            isMobile ? "opacity-100 scale-100" : "opacity-0 scale-75"
          }`}
          onClick={handlePlayButtonClick}
          role="button"
          aria-label={isPlaying ? "Pause video" : "Play video"}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handlePlayButtonClick();
            }
          }}
        >
          <Image
            src="/images/circle-text.svg"
            alt="Play button circle text"
            className="spin-circle circle-text size-[15vw]"
            width={200}
            height={200}
          />
          <div className={`play-btn ${isHovered ? "hovered" : ""}`}>
            <Image
              src="/images/play.svg"
              alt={isPlaying ? "Pause" : "Play"}
              className="size-[3vw] ml-[.5vw] play-icon transition-transform duration-300"
              width={48}
              height={48}
              style={{
                transform: isPlaying ? "scale(0.8)" : "scale(1)",
                opacity: isPlaying ? 0.7 : 1,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoPinSection;
