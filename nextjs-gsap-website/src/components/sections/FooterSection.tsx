"use client";

import { useMediaQuery } from "react-responsive";
import OptimizedImage from "../ui/OptimizedImage";
import OptimizedVideo from "../ui/OptimizedVideo";
import { imageDimensions, videoConfigs } from "@/lib/utils/imageOptimization";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { FooterSectionProps } from "@/types/components";

const FooterSection: React.FC<FooterSectionProps> = ({ className }) => {
  const isMobile = useMediaQuery({
    query: "(max-width: 768px)",
  });

  const titleRef = useRef<HTMLHeadingElement>(null);
  const socialButtonsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Animate the title reveal
    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current,
        {
          clipPath: "inset(0 100% 0 0)",
          opacity: 0,
        },
        {
          clipPath: "inset(0 0% 0 0)",
          opacity: 1,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    // Animate social buttons
    if (socialButtonsRef.current) {
      const buttons = socialButtonsRef.current.children;
      gsap.fromTo(
        buttons,
        {
          y: 50,
          opacity: 0,
          scale: 0.8,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: socialButtonsRef.current,
            start: "top 85%",
            end: "bottom 15%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }
  }, []);

  return (
    <section className={`footer-section ${className || ""}`}>
      <OptimizedImage
        src="/images/footer-dip.png"
        alt="Footer decorative border"
        width={1920}
        height={200}
        className="w-full object-cover -translate-y-1"
        priority={false}
        sizes={imageDimensions.footer.sizes}
        quality={90}
      />

      <div className="2xl:h-[110dvh] relative md:pt-[20vh] pt-[10vh]">
        <div className="overflow-hidden z-10">
          <h1
            ref={titleRef}
            className="general-title text-center text-milk py-5"
          >
            #CHUGRESPONSIBLY
          </h1>
        </div>

        {isMobile ? (
          <OptimizedImage
            src="/images/footer-drink.png"
            alt="Footer drink"
            width={400}
            height={600}
            className="absolute top-0 object-contain"
            priority={false}
            sizes={imageDimensions.testimonial.sizes}
            quality={85}
          />
        ) : (
          <OptimizedVideo
            src="/videos/splash.mp4"
            autoPlay
            playsInline
            muted
            loop
            className="absolute top-0 object-contain mix-blend-lighten"
            preload={videoConfigs.footer.preload}
            lazy={videoConfigs.footer.lazy}
            poster={videoConfigs.footer.poster}
          />
        )}

        <div
          ref={socialButtonsRef}
          className="flex-center gap-5 relative z-10 md:mt-20 mt-5"
        >
          <div className="social-btn">
            <OptimizedImage
              src="/images/yt.svg"
              alt="YouTube"
              width={32}
              height={32}
              className="w-8 h-8"
              priority={false}
              sizes={imageDimensions.icon.sizes}
              quality={95}
            />
          </div>
          <div className="social-btn">
            <OptimizedImage
              src="/images/insta.svg"
              alt="Instagram"
              width={32}
              height={32}
              className="w-8 h-8"
              priority={false}
              sizes={imageDimensions.icon.sizes}
              quality={95}
            />
          </div>
          <div className="social-btn">
            <OptimizedImage
              src="/images/tiktok.svg"
              alt="TikTok"
              width={32}
              height={32}
              className="w-8 h-8"
              priority={false}
              sizes={imageDimensions.icon.sizes}
              quality={95}
            />
          </div>
        </div>

        <div className="mt-40 md:px-10 px-5 flex gap-10 md:flex-row flex-col justify-between text-milk font-paragraph md:text-lg font-medium">
          <div className="flex items-center md:gap-16 gap-5">
            <div>
              <p>SPYLT Flavors</p>
            </div>
            <div>
              <p>Chug Club</p>
              <p>Student Marketing</p>
              <p>Dairy Dealers</p>
            </div>
            <div>
              <p>Company</p>
              <p>Contacts</p>
              <p>Tasty Talk</p>
            </div>
          </div>

          <div className="md:max-w-lg">
            <p>
              Get Exclusive Early Access and Stay Informed About Product
              Updates, Events, and More!
            </p>
            <div className="flex justify-between items-center border-b border-[#D9D9D9] py-5 md:mt-10">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full placeholder:font-sans placeholder:text-[#999999] bg-transparent outline-none text-milk"
              />
              <OptimizedImage
                src="/images/arrow.svg"
                alt="Submit arrow"
                width={24}
                height={24}
                className="cursor-pointer hover:scale-110 transition-transform"
                priority={false}
                sizes="24px"
                quality={95}
              />
            </div>
          </div>
        </div>

        <div className="copyright-box">
          <p>Copyright © 2025 Spylt - All Rights Reserved</p>
          <div className="flex items-center gap-7">
            <p className="cursor-pointer hover:opacity-75 transition-opacity">
              Privacy Policy
            </p>
            <p className="cursor-pointer hover:opacity-75 transition-opacity">
              Terms of Service
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FooterSection;
